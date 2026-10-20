<?php

namespace App\Models;

use App\Enums\EditalTipo;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/** Edital ou oportunidade. O status (aberto/encerrado) é derivado do prazo. */
class Edital extends Model
{
    protected $table = 'editais';

    protected $fillable = ['titulo', 'tipo', 'publico', 'campus', 'prazo', 'url', 'publicado'];

    protected function casts(): array
    {
        return [
            'tipo' => EditalTipo::class,
            'prazo' => 'date',
            'publicado' => 'boolean',
        ];
    }

    /** @param Builder<Edital> $query */
    #[Scope]
    protected function publicados(Builder $query): void
    {
        $query->where('publicado', true);
    }

    /** Aberto até o fim do dia do prazo */
    public function estaAberto(): bool
    {
        return $this->prazo->endOfDay()->isFuture();
    }
}
