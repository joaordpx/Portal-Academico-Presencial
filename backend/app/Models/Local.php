<?php

namespace App\Models;

use App\Enums\LocalTipo;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Prédio, setor ou serviço de um campus */
class Local extends Model
{
    protected $table = 'locais';

    protected $fillable = [
        'slug', 'nome', 'numero', 'tipo', 'campus_id', 'centro_id', 'descricao', 'setores', 'servicos',
        'localizacao', 'telefone', 'email', 'horarios', 'latitude', 'longitude', 'svg_id',
        'acessibilidade', 'publicado',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => LocalTipo::class,
            'setores' => 'array',
            'servicos' => 'array',
            'horarios' => 'array',
            'acessibilidade' => 'array',
            'latitude' => 'float',
            'longitude' => 'float',
            'publicado' => 'boolean',
        ];
    }

    /** @param Builder<Local> $query */
    #[Scope]
    protected function publicados(Builder $query): void
    {
        $query->where('publicado', true);
    }

    /** @return BelongsTo<Campus, $this> */
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    /** @return BelongsTo<Centro, $this> */
    public function centro(): BelongsTo
    {
        return $this->belongsTo(Centro::class);
    }
}
