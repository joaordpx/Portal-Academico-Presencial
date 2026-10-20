<?php

namespace App\Http\Resources;

use App\Models\Campus;
use App\Models\CursoOferta;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Campus ou núcleo — espelha `Unidade` do frontend.
 *
 * @mixin Campus
 */
class CampusResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'nome' => $this->nome,
            'cidade' => $this->cidade,
            'regiao' => $this->regiao,
            'sede' => $this->sede,
            'endereco' => $this->endereco,
            // Objeto mesmo vazio: um array PHP vazio viraria [] no JSON
            'contato' => (object) array_filter(['telefone' => $this->telefone, 'email' => $this->email]),
            'horarios' => $this->horarios ?? [],
            // Nomes dos cursos publicados ofertados no campus (sem repetir bacharelado/licenciatura)
            'cursos' => $this->ofertas
                ->filter(fn (CursoOferta $o) => $o->curso->publicado)
                ->map(fn (CursoOferta $o) => $o->curso->nome)
                ->unique()
                ->sort()
                ->values(),
            'servicos' => $this->servicos ?? [],
            'mapsUrl' => $this->maps_url,
        ];
    }
}
