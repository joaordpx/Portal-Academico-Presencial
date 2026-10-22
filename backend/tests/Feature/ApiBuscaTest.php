<?php

namespace Tests\Feature;

use App\Enums\TipoResultadoBusca;
use App\Models\Busca;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ApiBuscaTest extends TestCase
{
    use RefreshDatabase;

    public function test_registra_a_busca_com_o_clique(): void
    {
        $this->postJson('/api/buscas', [
            'termo' => '  Matrícula   ',
            'resultados' => 4,
            'tipoClicado' => 'link',
            'posicao' => 2,
        ])->assertNoContent();

        $busca = Busca::sole();
        $this->assertSame('matricula', $busca->termo);
        $this->assertSame(4, $busca->resultados);
        $this->assertSame(TipoResultadoBusca::Link, $busca->tipo_clicado);
        $this->assertSame(2, $busca->posicao_clicada);
    }

    public function test_registra_busca_sem_clique_e_sem_resultado(): void
    {
        $this->postJson('/api/buscas', ['termo' => 'Bandejão', 'resultados' => 0])->assertNoContent();

        $this->assertDatabaseHas('buscas', [
            'termo' => 'bandejao',
            'resultados' => 0,
            'tipo_clicado' => null,
            'posicao_clicada' => null,
        ]);
    }

    /** @return array<string, array{string}> */
    public static function dadosPessoais(): array
    {
        return [
            'CPF formatado' => ['123.456.789-09'],
            'CPF só dígitos' => ['12345678909'],
            'telefone' => ['(38) 99876-5432'],
            'e-mail' => ['fulano@unimontes.br'],
        ];
    }

    #[DataProvider('dadosPessoais')]
    public function test_descarta_termos_que_parecem_dado_pessoal(string $termo): void
    {
        $this->postJson('/api/buscas', ['termo' => $termo, 'resultados' => 0])->assertNoContent();

        $this->assertDatabaseCount('buscas', 0);
    }

    public function test_aceita_numeros_curtos_como_predio_ou_ano(): void
    {
        $this->postJson('/api/buscas', ['termo' => 'prédio 3 edital 2026', 'resultados' => 2])->assertNoContent();

        $this->assertDatabaseHas('buscas', ['termo' => 'predio 3 edital 2026']);
    }

    public function test_valida_os_campos(): void
    {
        $this->postJson('/api/buscas', ['termo' => 'a', 'resultados' => 1])->assertJsonValidationErrors('termo');
        $this->postJson('/api/buscas', ['termo' => 'ru', 'resultados' => -1])->assertJsonValidationErrors('resultados');
        $this->postJson('/api/buscas', ['termo' => 'ru', 'resultados' => 1, 'tipoClicado' => 'qualquer', 'posicao' => 1])
            ->assertJsonValidationErrors('tipoClicado');
        // Clique precisa vir com tipo e posição juntos
        $this->postJson('/api/buscas', ['termo' => 'ru', 'resultados' => 1, 'posicao' => 1])
            ->assertJsonValidationErrors('tipoClicado');

        $this->assertDatabaseCount('buscas', 0);
    }

    public function test_nao_guarda_nada_que_identifique_quem_buscou(): void
    {
        $colunas = Schema::getColumnListing('buscas');

        $this->assertEqualsCanonicalizing(
            ['id', 'termo', 'resultados', 'tipo_clicado', 'posicao_clicada', 'created_at'],
            $colunas,
        );
    }

    public function test_limita_a_quantidade_de_registros_por_minuto(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $this->postJson('/api/buscas', ['termo' => "termo {$i}", 'resultados' => 1])->assertNoContent();
        }

        $this->postJson('/api/buscas', ['termo' => 'mais um', 'resultados' => 1])->assertTooManyRequests();
    }

    public function test_apaga_buscas_com_mais_de_90_dias(): void
    {
        $antiga = Busca::create(['termo' => 'antiga', 'resultados' => 1]);
        $antiga->forceFill(['created_at' => now()->subDays(91)])->save();
        Busca::create(['termo' => 'recente', 'resultados' => 1]);

        $this->artisan('model:prune', ['--model' => [Busca::class]])->assertSuccessful();

        $this->assertSame(['recente'], Busca::pluck('termo')->all());
    }
}
