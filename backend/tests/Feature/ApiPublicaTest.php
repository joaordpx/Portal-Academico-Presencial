<?php

namespace Tests\Feature;

use App\Models\Curso;
use App\Models\Edital;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiPublicaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(); // dados reais de database/seeders/dados
    }

    public function test_lista_os_cursos_no_formato_do_frontend(): void
    {
        $resposta = $this->getJson('/api/cursos')->assertOk()->assertJsonCount(41);

        $resposta->assertJsonStructure([['slug', 'nome', 'grau', 'modalidade', 'campi', 'centro', 'turnos', 'area', 'duracao', 'imagem']]);
    }

    public function test_detalha_um_curso_com_vagas_por_campus(): void
    {
        $this->getJson('/api/cursos/pedagogia')
            ->assertOk()
            ->assertJsonPath('nome', 'Pedagogia')
            ->assertJsonPath('campi.0', 'Montes Claros') // campus-sede primeiro
            ->assertJsonPath('vagas.0', ['campus' => 'Montes Claros', 'quantidade' => 70, 'periodicidade' => 'anuais'])
            ->assertJsonCount(8, 'vagas')
            ->assertJsonPath('coordenacao.email', 'coord.pedagogia@unimontes.br');
    }

    public function test_curso_inexistente_retorna_404(): void
    {
        $this->getJson('/api/cursos/nao-existe')->assertNotFound();
    }

    public function test_curso_despublicado_nao_aparece(): void
    {
        Curso::where('slug', 'direito')->update(['publicado' => false]);

        $this->getJson('/api/cursos')->assertJsonCount(40);
        $this->getJson('/api/cursos/direito')->assertNotFound();
    }

    public function test_lista_os_campi_com_a_sede_primeiro(): void
    {
        $this->getJson('/api/campi')
            ->assertOk()
            ->assertJsonCount(13)
            ->assertJsonPath('0.sede', true)
            ->assertJsonPath('0.cidade', 'Montes Claros');
    }

    public function test_locais_trazem_o_centro_e_seus_cursos(): void
    {
        $this->getJson('/api/locais/predio-3')
            ->assertOk()
            ->assertJsonPath('centro.sigla', 'CCET')
            ->assertJsonFragment(['Sistemas de Informação']);
    }

    public function test_contato_vazio_e_objeto_e_nao_lista(): void
    {
        // predio-1 não tem telefone nem e-mail cadastrados
        $this->assertStringContainsString('"contato":{}', $this->getJson('/api/locais/predio-1')->getContent());
    }

    public function test_filtra_locais_por_campus(): void
    {
        $this->getJson('/api/locais?campus=montes-claros')->assertOk()->assertJsonCount(11);
        $this->getJson('/api/locais?campus=januaria')->assertOk()->assertJsonCount(0);
    }

    public function test_editais_trazem_prazo_e_nao_trazem_status(): void
    {
        $this->getJson('/api/editais')
            ->assertOk()
            ->assertJsonCount(Edital::count())
            ->assertJsonMissingPath('0.status')
            ->assertJsonStructure([['id', 'titulo', 'tipo', 'publico', 'campus', 'prazo', 'url']]);
    }

    public function test_detalha_um_evento_em_paragrafos(): void
    {
        $this->getJson('/api/eventos/semana-municipal-de-inovacao')
            ->assertOk()
            ->assertJsonCount(3, 'conteudo')
            ->assertJsonPath('dataFim', '2026-10-23');
    }
}
