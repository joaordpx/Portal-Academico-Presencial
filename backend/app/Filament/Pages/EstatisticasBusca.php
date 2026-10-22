<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\Busca\BuscasPorDia;
use App\Filament\Widgets\Busca\CliquesPorTipo;
use App\Filament\Widgets\Busca\DesfechoBuscas;
use App\Filament\Widgets\Busca\PosicaoDoClique;
use App\Filament\Widgets\Busca\ResumoBusca;
use App\Filament\Widgets\Busca\TermosMaisBuscados;
use App\Filament\Widgets\Busca\TermosSemResultado;
use App\Models\Busca;
use App\Support\EstatisticasBusca as E;
use BackedEnum;
use Filament\Forms\Components\Select;
use Filament\Pages\Dashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

/**
 * Estatísticas da busca global do portal — só para administradores.
 * É um "dashboard" próprio para ganhar o filtro de período compartilhado
 * por todos os widgets.
 */
class EstatisticasBusca extends Dashboard
{
    use HasFiltersForm;

    protected static string $routePath = '/estatisticas-busca';

    protected static ?string $title = 'Estatísticas da busca';

    protected static ?string $navigationLabel = 'Estatísticas da busca';

    protected static string|UnitEnum|null $navigationGroup = 'Relatórios';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChartBar;

    protected static ?int $navigationSort = 1;

    public static function canAccess(): bool
    {
        return auth()->user()?->hasRole('administrador') ?? false;
    }

    public function getSubheading(): string
    {
        return 'Registros anônimos: o portal não guarda quem buscou. Cada busca fica guardada por '
            .Busca::RETENCAO_DIAS.' dias.';
    }

    public function filtersForm(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('periodo')
                ->label('Período')
                ->options(array_combine(
                    E::PERIODOS,
                    array_map(fn (int $d) => "Últimos {$d} dias", E::PERIODOS),
                ))
                ->default(E::PERIODO_PADRAO)
                ->selectablePlaceholder(false),
        ]);
    }

    public function getWidgets(): array
    {
        return [
            ResumoBusca::class,
            BuscasPorDia::class,
            DesfechoBuscas::class,
            PosicaoDoClique::class,
            CliquesPorTipo::class,
            TermosSemResultado::class,
            TermosMaisBuscados::class,
        ];
    }

    public function getColumns(): int|array
    {
        // Dois gráficos por linha em telas médias; três só em telas largas
        return ['default' => 1, 'lg' => 2, '2xl' => 3];
    }
}
