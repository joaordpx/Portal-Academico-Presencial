<?php

namespace App\Filament\Widgets\Busca;

use App\Filament\Widgets\Busca\Concerns\EstatisticaDaBusca;
use App\Support\EstatisticasBusca;
use Filament\Widgets\ChartWidget;

class PosicaoDoClique extends ChartWidget
{
    use EstatisticaDaBusca;

    protected static bool $isDiscovered = false;

    protected static bool $isLazy = false;

    protected static ?int $sort = 4;

    protected ?string $heading = 'Posição do resultado aberto';

    protected ?string $description = 'O ideal é a maioria no 1º lugar. Cliques lá embaixo pedem ajuste na ordenação.';

    protected ?string $maxHeight = '240px';

    protected ?string $pollingInterval = null;

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $posicoes = EstatisticasBusca::posicoesClicadas($this->dias());

        return [
            'datasets' => [[
                'label' => 'Cliques',
                'data' => array_values($posicoes),
                // Até o 3º lugar é o esperado; dali para baixo, sinal de atenção
                'backgroundColor' => ['#00B894', '#00B894', '#00B894', '#FFB800', '#FFB800', '#FFB800'],
                'borderRadius' => 4,
            ]],
            'labels' => array_keys($posicoes),
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['display' => false]],
            'scales' => ['y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
        ];
    }
}
