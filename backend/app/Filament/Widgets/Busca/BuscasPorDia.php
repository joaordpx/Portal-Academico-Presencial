<?php

namespace App\Filament\Widgets\Busca;

use App\Filament\Widgets\Busca\Concerns\EstatisticaDaBusca;
use App\Support\EstatisticasBusca;
use Carbon\CarbonImmutable;
use Filament\Widgets\ChartWidget;

class BuscasPorDia extends ChartWidget
{
    use EstatisticaDaBusca;

    protected static bool $isDiscovered = false;

    protected static bool $isLazy = false;

    protected static ?int $sort = 2;

    protected ?string $heading = 'Buscas por dia';

    protected ?string $description = 'Total de buscas, quantas terminaram com um resultado aberto e quantas não encontraram nada.';

    protected int|string|array $columnSpan = 'full';

    protected ?string $maxHeight = '280px';

    protected ?string $pollingInterval = null;

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $serie = EstatisticasBusca::porDia($this->dias());

        return [
            'datasets' => [
                [
                    'label' => 'Buscas',
                    'data' => array_column($serie, 'total'),
                    'borderColor' => '#6E3AFF',
                    'backgroundColor' => 'rgba(110, 58, 255, 0.12)',
                    'fill' => true,
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Abriram um resultado',
                    'data' => array_column($serie, 'comClique'),
                    'borderColor' => '#00B894',
                    'backgroundColor' => '#00B894',
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Sem resultado',
                    'data' => array_column($serie, 'semResultado'),
                    'borderColor' => '#FF4D2E',
                    'backgroundColor' => '#FF4D2E',
                    'tension' => 0.3,
                ],
            ],
            'labels' => array_map(
                fn (array $d) => CarbonImmutable::parse($d['dia'])->format('d/m'),
                $serie,
            ),
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['position' => 'bottom']],
            'scales' => ['y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
            'interaction' => ['mode' => 'index', 'intersect' => false],
        ];
    }
}
