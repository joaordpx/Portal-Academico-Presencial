<?php

namespace App\Support;

use App\Enums\TipoResultadoBusca;
use App\Models\Busca;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * Consultas das estatísticas da busca global, usadas pelos widgets do painel.
 * Todas recebem o período em dias, contando o dia de hoje.
 *
 * Definições:
 * - sem resultado: a busca não encontrou nada (o que falta no portal);
 * - com clique: a pessoa abriu um dos resultados (a busca ajudou);
 * - sem clique: houve resultados, mas nenhum foi aberto (a busca não convenceu).
 */
class EstatisticasBusca
{
    public const PERIODOS = [7, 30, 90];

    public const PERIODO_PADRAO = 30;

    public static function periodoValido(mixed $dias): int
    {
        return in_array((int) $dias, self::PERIODOS, true) ? (int) $dias : self::PERIODO_PADRAO;
    }

    public static function inicio(int $dias, int $periodosAtras = 0): CarbonImmutable
    {
        return CarbonImmutable::today()->subDays($dias * ($periodosAtras + 1) - 1);
    }

    /** @return Builder<Busca> */
    public static function noPeriodo(int $dias, int $periodosAtras = 0): Builder
    {
        $query = Busca::query()->where('created_at', '>=', self::inicio($dias, $periodosAtras));

        return $periodosAtras === 0
            ? $query
            : $query->where('created_at', '<', self::inicio($dias, $periodosAtras - 1));
    }

    /**
     * Totais do período e do período anterior, para comparação.
     *
     * @return array{total: int, semResultado: int, comClique: int, posicaoMedia: ?float}
     */
    public static function resumo(int $dias, int $periodosAtras = 0): array
    {
        $linha = self::noPeriodo($dias, $periodosAtras)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN resultados = 0 THEN 1 ELSE 0 END) as sem_resultado')
            ->selectRaw('SUM(CASE WHEN tipo_clicado IS NOT NULL THEN 1 ELSE 0 END) as com_clique')
            ->selectRaw('AVG(posicao_clicada) as posicao_media')
            ->toBase()
            ->first();

        return [
            'total' => (int) $linha->total,
            'semResultado' => (int) $linha->sem_resultado,
            'comClique' => (int) $linha->com_clique,
            'posicaoMedia' => $linha->posicao_media === null ? null : round((float) $linha->posicao_media, 1),
        ];
    }

    /**
     * Uma linha por dia do período, inclusive os dias sem nenhuma busca.
     *
     * @return list<array{dia: string, total: int, semResultado: int, comClique: int}>
     */
    public static function porDia(int $dias): array
    {
        $porData = self::noPeriodo($dias)
            ->selectRaw('DATE(created_at) as dia')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN resultados = 0 THEN 1 ELSE 0 END) as sem_resultado')
            ->selectRaw('SUM(CASE WHEN tipo_clicado IS NOT NULL THEN 1 ELSE 0 END) as com_clique')
            ->groupBy('dia')
            ->toBase()
            ->get()
            ->keyBy('dia');

        $serie = [];
        for ($d = self::inicio($dias); $d->lte(CarbonImmutable::today()); $d = $d->addDay()) {
            $linha = $porData->get($d->toDateString());
            $serie[] = [
                'dia' => $d->toDateString(),
                'total' => (int) ($linha->total ?? 0),
                'semResultado' => (int) ($linha->sem_resultado ?? 0),
                'comClique' => (int) ($linha->com_clique ?? 0),
            ];
        }

        return $serie;
    }

    /** @return array{comClique: int, semClique: int, semResultado: int} */
    public static function desfecho(int $dias): array
    {
        $r = self::resumo($dias);

        return [
            'comClique' => $r['comClique'],
            'semClique' => $r['total'] - $r['comClique'] - $r['semResultado'],
            'semResultado' => $r['semResultado'],
        ];
    }

    /**
     * Cliques por tipo de resultado, na ordem do enum (zero incluído).
     *
     * @return array<string, int> rótulo => cliques
     */
    public static function cliquesPorTipo(int $dias): array
    {
        $contagem = self::noPeriodo($dias)
            ->whereNotNull('tipo_clicado')
            ->selectRaw('tipo_clicado, COUNT(*) as total')
            ->groupBy('tipo_clicado')
            ->toBase()
            ->pluck('total', 'tipo_clicado');

        $saida = [];
        foreach (TipoResultadoBusca::cases() as $tipo) {
            $saida[$tipo->getLabel()] = (int) ($contagem[$tipo->value] ?? 0);
        }

        return $saida;
    }

    /**
     * Em que posição da lista estava o resultado clicado. Muitos cliques
     * abaixo do 3º lugar indicam que a ordenação pode melhorar.
     *
     * @return array<string, int> rótulo => cliques
     */
    public static function posicoesClicadas(int $dias): array
    {
        $contagem = self::noPeriodo($dias)
            ->whereNotNull('posicao_clicada')
            ->selectRaw('CASE WHEN posicao_clicada >= 6 THEN 6 ELSE posicao_clicada END as faixa, COUNT(*) as total')
            ->groupBy('faixa')
            ->toBase()
            ->pluck('total', 'faixa');

        $saida = [];
        foreach (range(1, 6) as $faixa) {
            $saida[$faixa === 6 ? '6º ou mais' : "{$faixa}º"] = (int) ($contagem[$faixa] ?? 0);
        }

        return $saida;
    }

    /**
     * Termos agrupados, para as tabelas do painel. `MIN(id)` serve de chave do registro.
     *
     * @return Builder<Busca>
     */
    public static function termos(int $dias, bool $somenteSemResultado = false): Builder
    {
        return self::noPeriodo($dias)
            ->when($somenteSemResultado, fn (Builder $q) => $q->where('resultados', 0))
            ->select('termo')
            ->selectRaw('MIN(id) as id')
            ->selectRaw('COUNT(*) as vezes')
            ->selectRaw('ROUND(100.0 * SUM(CASE WHEN tipo_clicado IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*)) as taxa_clique')
            ->selectRaw('MAX(created_at) as ultima_vez')
            ->groupBy('termo');
    }

    /** Variação percentual entre dois valores; null quando não há base de comparação */
    public static function variacao(float $atual, float $anterior): ?int
    {
        return $anterior > 0 ? (int) round(($atual - $anterior) / $anterior * 100) : null;
    }

    public static function percentual(int $parte, int $total): int
    {
        return $total > 0 ? (int) round($parte / $total * 100) : 0;
    }
}
