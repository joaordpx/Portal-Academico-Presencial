<?php

namespace Tests\Feature;

use App\Filament\Pages\EstatisticasBusca as Pagina;
use App\Filament\Widgets\Busca\BuscasPorDia;
use App\Filament\Widgets\Busca\CliquesPorTipo;
use App\Filament\Widgets\Busca\DesfechoBuscas;
use App\Filament\Widgets\Busca\PosicaoDoClique;
use App\Filament\Widgets\Busca\ResumoBusca;
use App\Filament\Widgets\Busca\TermosMaisBuscados;
use App\Filament\Widgets\Busca\TermosSemResultado;
use App\Models\Busca;
use App\Models\User;
use App\Support\EstatisticasBusca;
use Carbon\CarbonImmutable;
use Database\Seeders\PapeisSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class EstatisticasBuscaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PapeisSeeder::class);
        $this->travelTo(CarbonImmutable::parse('2026-10-22 15:00'));
    }

    private function buscaEm(string $quando, string $termo, int $resultados, ?string $tipo = null, ?int $posicao = null): void
    {
        $b = Busca::create([
            'termo' => $termo,
            'resultados' => $resultados,
            'tipo_clicado' => $tipo,
            'posicao_clicada' => $posicao,
        ]);
        $b->forceFill(['created_at' => CarbonImmutable::parse($quando)])->save();
    }

    private function dadosDeExemplo(): void
    {
        // Período atual (últimos 7 dias: 16/10 a 22/10)
        $this->buscaEm('2026-10-22 09:00', 'pedagogia', 3, 'curso', 1);
        $this->buscaEm('2026-10-22 10:00', 'pedagogia', 3, 'curso', 2);
        $this->buscaEm('2026-10-21 11:00', 'bandejao', 0);
        $this->buscaEm('2026-10-21 12:00', 'bandejao', 0);
        $this->buscaEm('2026-10-20 13:00', 'edital', 4);
        $this->buscaEm('2026-10-16 08:00', 'predio 3', 1, 'local', 7);
        // Período anterior (09/10 a 15/10)
        $this->buscaEm('2026-10-15 08:00', 'ru', 1, 'secao', 1);
        $this->buscaEm('2026-10-10 08:00', 'xyz', 0);
    }

    private function admin(): User
    {
        return User::factory()->create()->assignRole('administrador');
    }

    /* ── Acesso ── */

    public function test_administrador_abre_a_pagina(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/estatisticas-busca')
            ->assertOk()
            ->assertSee('Estatísticas da busca');
    }

    public function test_editor_nao_acessa_nem_pela_url(): void
    {
        $this->actingAs(User::factory()->create()->assignRole('editor'))
            ->get('/admin/estatisticas-busca')
            ->assertForbidden();
    }

    public function test_widgets_nao_aparecem_no_dashboard_dos_editores(): void
    {
        $this->actingAs(User::factory()->create()->assignRole('editor'))
            ->get('/admin')
            ->assertOk()
            ->assertDontSee('Buscas por dia')
            ->assertDontSee('Termos sem resultado');
    }

    /** @return array<string, array{class-string}> */
    public static function widgets(): array
    {
        return [
            'resumo' => [ResumoBusca::class],
            'por dia' => [BuscasPorDia::class],
            'desfecho' => [DesfechoBuscas::class],
            'cliques por tipo' => [CliquesPorTipo::class],
            'posição' => [PosicaoDoClique::class],
            'sem resultado' => [TermosSemResultado::class],
            'mais buscados' => [TermosMaisBuscados::class],
        ];
    }

    #[DataProvider('widgets')]
    public function test_widget_so_e_visivel_para_administrador(string $widget): void
    {
        $this->actingAs(User::factory()->create()->assignRole('editor'));
        $this->assertFalse($widget::canView());
        $this->assertFalse($widget::isDiscovered());

        $this->actingAs($this->admin());
        $this->assertTrue($widget::canView());
    }

    #[DataProvider('widgets')]
    public function test_widget_renderiza_com_dados(string $widget): void
    {
        $this->dadosDeExemplo();
        $this->actingAs($this->admin());

        Livewire::test($widget, ['pageFilters' => ['periodo' => 7]])->assertOk();
    }

    public function test_filtro_de_periodo_muda_a_pagina(): void
    {
        $this->dadosDeExemplo();
        $this->actingAs($this->admin());

        Livewire::test(Pagina::class)
            ->assertSet('filters.periodo', 30)
            ->set('filters.periodo', 7)
            ->assertOk();
    }

    public function test_tabelas_mostram_os_termos_do_periodo(): void
    {
        $this->dadosDeExemplo();
        $this->actingAs($this->admin());

        Livewire::test(TermosSemResultado::class, ['pageFilters' => ['periodo' => 7]])
            ->assertSee('bandejao')
            ->assertDontSee('pedagogia')
            ->assertDontSee('xyz'); // é do período anterior

        Livewire::test(TermosMaisBuscados::class, ['pageFilters' => ['periodo' => 7]])
            ->assertSee('pedagogia')
            ->assertSee('bandejao');
    }

    /* ── Consultas ── */

    public function test_resumo_do_periodo_e_do_anterior(): void
    {
        $this->dadosDeExemplo();

        $this->assertSame(
            ['total' => 6, 'semResultado' => 2, 'comClique' => 3, 'posicaoMedia' => 3.3],
            EstatisticasBusca::resumo(7),
        );
        $this->assertSame(
            ['total' => 2, 'semResultado' => 1, 'comClique' => 1, 'posicaoMedia' => 1.0],
            EstatisticasBusca::resumo(7, 1),
        );
    }

    public function test_serie_diaria_inclui_dias_sem_busca(): void
    {
        $this->dadosDeExemplo();

        $serie = EstatisticasBusca::porDia(7);

        $this->assertCount(7, $serie);
        $this->assertSame('2026-10-16', $serie[0]['dia']);
        $this->assertSame(['dia' => '2026-10-17', 'total' => 0, 'semResultado' => 0, 'comClique' => 0], $serie[1]);
        $this->assertSame(['dia' => '2026-10-21', 'total' => 2, 'semResultado' => 2, 'comClique' => 0], $serie[5]);
        $this->assertSame(2, $serie[6]['comClique']);
    }

    public function test_desfecho_cliques_por_tipo_e_posicoes(): void
    {
        $this->dadosDeExemplo();

        $this->assertSame(['comClique' => 3, 'semClique' => 1, 'semResultado' => 2], EstatisticasBusca::desfecho(7));

        $porTipo = EstatisticasBusca::cliquesPorTipo(7);
        $this->assertSame(2, $porTipo['Cursos']);
        $this->assertSame(1, $porTipo['Locais']);
        $this->assertSame(0, $porTipo['Eventos']);

        $this->assertSame(
            ['1º' => 1, '2º' => 1, '3º' => 0, '4º' => 0, '5º' => 0, '6º ou mais' => 1],
            EstatisticasBusca::posicoesClicadas(7),
        );
    }

    public function test_termos_agrupados_com_taxa_de_clique(): void
    {
        $this->dadosDeExemplo();

        $termos = EstatisticasBusca::termos(7)->orderByDesc('vezes')->orderBy('termo')->get()->keyBy('termo');

        $this->assertSame(2, (int) $termos['pedagogia']->vezes);
        $this->assertSame(100, (int) $termos['pedagogia']->taxa_clique);
        $this->assertSame(0, (int) $termos['bandejao']->taxa_clique);
        $this->assertFalse($termos->has('xyz'));
    }

    public function test_periodo_invalido_volta_ao_padrao(): void
    {
        $this->assertSame(30, EstatisticasBusca::periodoValido('999'));
        $this->assertSame(7, EstatisticasBusca::periodoValido('7'));
        $this->assertSame(30, EstatisticasBusca::periodoValido(null));
    }
}
