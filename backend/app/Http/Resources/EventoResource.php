<?php

namespace App\Http\Resources;

use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Evento — espelha `Evento` do frontend.
 *
 * @mixin Evento
 */
class EventoResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $conteudo = array_values(array_filter(array_map('trim', preg_split('/\R{2,}/', $this->conteudo ?? ''))));

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'titulo' => $this->titulo,
            'descricao' => $this->descricao,
            'conteudo' => $conteudo ?: null,
            'tipo' => $this->tipo->value,
            'data' => $this->data->toDateString(),
            'dataFim' => $this->data_fim?->toDateString(),
            'horario' => $this->horario,
            'local' => $this->local,
            'campus' => $this->campus,
            'imagem' => $this->imagem,
            // O frontend chama de "externo" o que vem de outro sistema
            'origem' => $this->origem === 'manual' ? 'manual' : 'externo',
            'organizador' => $this->organizador,
            'linkOficial' => $this->link_oficial,
            'inscricoesAbertas' => $this->inscricoes_abertas,
        ];
    }
}
