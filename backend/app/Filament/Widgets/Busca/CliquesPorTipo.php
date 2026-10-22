<?php

namespace App\Filament\Widgets\Busca;

use App\Filament\Widgets\Busca\Concerns\EstatisticaDaBusca;
use App\Support\EstatisticasBusca;
use Filament\Widgets\ChartWidget;

class CliquesPorTipo extends ChartWidget
{
    use EstatisticaDaBusca;

    protected static bool $isDiscovered = false;

    protected static bool $isLazy = false;

    protected static ?int $sort = 5;

    protected ?string $heading = 'O que as pessoas abrem';

    protected ?string $description = 'Cliques por tipo de resultado.';

    /** Largura toda em telas médias, um terço em telas largas */
    protected int|string|array $columnSpan = ['default' => 'full', '2xl' => 1];

    protected ?string $maxHeight = '240px';

    protected ?string $pollingInterval = null;

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $cliques = EstatisticasBusca::cliquesPorTipo($this->dias());

        return [
            'datasets' => [[
                'label' => 'Cliques',
                'data' => array_values($cliques),
                'backgroundColor' => '#6E3AFF',
                'borderRadius' => 4,
            ]],
            'labels' => array_keys($cliques),
        ];
    }

    protected function getOptions(): array
    {
        return [
            'indexAxis' => 'y',
            'plugins' => ['legend' => ['display' => false]],
            'scales' => ['x' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
        ];
    }
}
