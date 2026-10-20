<?php

namespace App\Http\Resources;

use App\Models\Edital;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Edital — registro cru. O status (aberto/encerrado) é derivado do prazo no frontend.
 *
 * @mixin Edital
 */
class EditalResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'tipo' => $this->tipo->value,
            'publico' => $this->publico,
            'campus' => $this->campus,
            'prazo' => $this->prazo->toDateString(),
            'url' => $this->url,
        ];
    }
}
