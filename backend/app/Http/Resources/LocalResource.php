<?php

namespace App\Http\Resources;

use App\Models\Curso;
use App\Models\Local;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

/**
 * Prédio, setor ou serviço — espelha `Local` do frontend.
 *
 * @mixin Local
 */
class LocalResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'nome' => $this->nome,
            'numero' => $this->numero,
            'tipo' => $this->tipo->value,
            'campus' => $this->campus->nome,
            'descricao' => $this->descricao,
            'centro' => $this->centro ? ['sigla' => $this->centro->sigla, 'nome' => $this->centro->nome] : null,
            // Cursos do centro sediado no prédio — só para o estudante se identificar
            'cursosDoCentro' => $this->centro
                ? $this->centro->cursos
                    ->filter(fn (Curso $c) => $c->publicado)
                    ->pluck('nome')
                    ->unique()
                    ->sort()
                    ->values()
                : [],
            'setores' => $this->setores ?? [],
            'servicos' => $this->servicos ?? [],
            'localizacao' => $this->localizacao,
            // Objeto mesmo vazio: um array PHP vazio viraria [] no JSON
            'contato' => (object) array_filter(['telefone' => $this->telefone, 'email' => $this->email]),
            'horarios' => $this->horarios ?? [],
            'coordenadas' => $this->latitude !== null && $this->longitude !== null
                ? ['lat' => $this->latitude, 'lng' => $this->longitude]
                : null,
            'svgId' => $this->svg_id,
            // Nulo enquanto o levantamento não for concluído: o portal não afirma o que não foi conferido
            'acessibilidade' => ($this->acessibilidade['levantada'] ?? false)
                ? Arr::except($this->acessibilidade, 'levantada')
                : null,
        ];
    }
}
