<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Centro de ensino (CCET, CCH...) */
class Centro extends Model
{
    protected $table = 'centros';

    protected $fillable = ['sigla', 'nome'];

    /** @return HasMany<Curso, $this> */
    public function cursos(): HasMany
    {
        return $this->hasMany(Curso::class);
    }

    /** @return HasMany<Local, $this> */
    public function locais(): HasMany
    {
        return $this->hasMany(Local::class);
    }
}
