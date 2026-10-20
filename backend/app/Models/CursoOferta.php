<?php

namespace App\Models;

use App\Enums\Periodicidade;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Oferta de um curso em um campus, com as vagas de ingresso */
class CursoOferta extends Model
{
    protected $table = 'curso_ofertas';

    protected $fillable = ['curso_id', 'campus_id', 'vagas', 'periodicidade'];

    protected function casts(): array
    {
        return [
            'vagas' => 'integer',
            'periodicidade' => Periodicidade::class,
        ];
    }

    /** @return BelongsTo<Curso, $this> */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    /** @return BelongsTo<Campus, $this> */
    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }
}
