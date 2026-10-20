<?php

namespace App\Http\Resources;

use App\Enums\Turno;
use App\Models\Curso;
use App\Models\CursoOferta;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Item da listagem /cursos — espelha `CursoResumo` do frontend.
 *
 * @mixin Curso
 */
class CursoResumoResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'nome' => $this->nome,
            'grau' => $this->grau->value,
            'modalidade' => $this->modalidade,
            // Campus-sede primeiro, os demais em ordem alfabética
            'campi' => $this->ofertas
                ->sortBy(fn (CursoOferta $o) => [! $o->campus->sede, $o->campus->cidade])
                ->map(fn (CursoOferta $o) => $o->campus->cidade)
                ->values(),
            'centro' => $this->centro?->sigla,
            'turnos' => $this->turnos->map(fn (Turno $t) => $t->value)->values(),
            'area' => $this->area,
            'duracao' => $this->duracao,
            'imagem' => $this->imagem,
        ];
    }
}
