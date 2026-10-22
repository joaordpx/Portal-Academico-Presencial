<?php

namespace App\Filament\Widgets\Busca\Concerns;

use App\Support\EstatisticasBusca;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

/**
 * Comum aos widgets da página "Estatísticas da busca": só administradores
 * veem, e o período vem do filtro da página (7, 30 ou 90 dias).
 */
trait EstatisticaDaBusca
{
    use InteractsWithPageFilters;

    public static function canView(): bool
    {
        return auth()->user()?->hasRole('administrador') ?? false;
    }

    protected function dias(): int
    {
        return EstatisticasBusca::periodoValido($this->pageFilters['periodo'] ?? null);
    }
}
