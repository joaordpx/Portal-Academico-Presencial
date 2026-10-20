<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Campus ou núcleo da universidade (o campus-sede tem `sede = true`) */
class Campus extends Model
{
    protected $table = 'campi';

    protected $fillable = [
        'slug', 'nome', 'cidade', 'regiao', 'sede', 'endereco', 'telefone', 'email',
        'horarios', 'servicos', 'maps_url',
    ];

    protected function casts(): array
    {
        return [
            'sede' => 'boolean',
            'horarios' => 'array',
            'servicos' => 'array',
        ];
    }

    /** @return HasMany<CursoOferta, $this> */
    public function ofertas(): HasMany
    {
        return $this->hasMany(CursoOferta::class);
    }

    /** @return HasMany<Local, $this> */
    public function locais(): HasMany
    {
        return $this->hasMany(Local::class);
    }
}
