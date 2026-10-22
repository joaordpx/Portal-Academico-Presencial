<?php

namespace App\Filament\Widgets\Busca;

use App\Filament\Widgets\Busca\Concerns\EstatisticaDaBusca;
use App\Support\EstatisticasBusca;
use Filament\Widgets\ChartWidget;

class DesfechoBuscas extends ChartWidget
{
    use EstatisticaDaBusca;

    protected static bool $isDiscovered = false;

    protected static bool $isLazy = false;

    protected static ?int $sort = 3;

    protected ?string $heading = 'Como as buscas terminam';

    protected ?string $description = 'Muitas buscas sem clique indicam resultados que não convencem.';

    protected ?string $maxHeight = '240px';

    protected ?string $pollingInterval = null;

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $d = EstatisticasBusca::desfecho($this->dias());

        return [
            'datasets' => [[
                'data' => [$d['comClique'], $d['semClique'], $d['semResultado']],
                'backgroundColor' => ['#00B894', '#A3A3A3', '#FF4D2E'],
                'borderWidth' => 0,
            ]],
            'labels' => ['Abriram um resultado', 'Viram resultados e não abriram', 'Nada encontrado'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['position' => 'bottom']],
            'scales' => ['x' => ['display' => false], 'y' => ['display' => false]],
            'cutout' => '62%',
        ];
    }
}
