<?php

namespace App\Filament\Widgets\Busca;

use App\Filament\Widgets\Busca\Concerns\EstatisticaDaBusca;
use App\Support\EstatisticasBusca as E;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/** Números principais do período, comparados com o período anterior de mesmo tamanho */
class ResumoBusca extends StatsOverviewWidget
{
    use EstatisticaDaBusca;

    protected static bool $isDiscovered = false;

    protected static bool $isLazy = false;

    protected static ?int $sort = 1;

    protected ?string $pollingInterval = null;

    protected function getStats(): array
    {
        $dias = $this->dias();
        $atual = E::resumo($dias);
        $anterior = E::resumo($dias, 1);
        $serie = E::porDia($dias);

        $pctSem = E::percentual($atual['semResultado'], $atual['total']);
        $pctSemAntes = E::percentual($anterior['semResultado'], $anterior['total']);
        $pctClique = E::percentual($atual['comClique'], $atual['total']);
        $pctCliqueAntes = E::percentual($anterior['comClique'], $anterior['total']);

        return [
            $this->comparado(
                Stat::make('Buscas', number_format($atual['total'], 0, ',', '.')),
                E::variacao($atual['total'], $anterior['total']),
                '%',
                subirEhBom: true,
            )->chart(array_column($serie, 'total'))->chartColor('primary'),

            $this->comparado(
                Stat::make('Sem resultado', "{$pctSem}%"),
                $anterior['total'] > 0 ? $pctSem - $pctSemAntes : null,
                ' p.p.',
                subirEhBom: false,
            )->chart(array_column($serie, 'semResultado'))->chartColor('danger'),

            $this->comparado(
                Stat::make('Abriram um resultado', "{$pctClique}%"),
                $anterior['total'] > 0 ? $pctClique - $pctCliqueAntes : null,
                ' p.p.',
                subirEhBom: true,
            )->chart(array_column($serie, 'comClique'))->chartColor('success'),

            Stat::make(
                'Posição média do clique',
                $atual['posicaoMedia'] === null ? '—' : number_format($atual['posicaoMedia'], 1, ',', ''),
            )->description('1 = o primeiro resultado da lista'),
        ];
    }

    /** Descrição "+12% vs. período anterior", com seta e cor conforme o sentido desejado */
    private function comparado(Stat $stat, ?int $diferenca, string $unidade, bool $subirEhBom): Stat
    {
        if ($diferenca === null) {
            return $stat->description('Sem dados do período anterior');
        }

        if ($diferenca === 0) {
            return $stat->description('Igual ao período anterior')->descriptionColor('gray');
        }

        $subiu = $diferenca > 0;
        $sinal = $subiu ? '+' : '−';

        return $stat
            ->description($sinal.abs($diferenca).$unidade.' vs. período anterior')
            ->descriptionIcon($subiu ? Heroicon::ArrowTrendingUp : Heroicon::ArrowTrendingDown)
            ->descriptionColor($subiu === $subirEhBom ? 'success' : 'danger');
    }
}
