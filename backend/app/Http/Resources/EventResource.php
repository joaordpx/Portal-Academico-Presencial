<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $startsAt = $this->starts_at ? $this->starts_at->format('Y-m-d') : null;
        $endsAt = $this->ends_at ? $this->ends_at->format('Y-m-d') : null;
        $registrationEndsAt = $this->registration_ends_at ? $this->registration_ends_at->format('Y-m-d') : null;
        $publishedAt = $this->published_at ? $this->published_at->toISOString() : null;

        return [
            'id' => $this->id,
            'nome' => $this->title,
            'descricao' => trim(strip_tags((string) $this->description)),
            'data_inicio' => $startsAt,
            'data_fim' => $endsAt,
            'data_limite_inscricao' => $registrationEndsAt,
            'carga_horaria' => $this->workload_hours,
            'vagas_disponiveis' => $this->available_spots,
            'esgotado' => $this->is_sold_out,
            'center_id' => $this->center_id,
            'center' => $this->whenLoaded('center', function (): ?array {
                return $this->center ? [
                    'id' => $this->center->id,
                    'name' => $this->center->name,
                ] : null;
            }),
            'campus' => $this->campus_name,
            'tipo' => $this->event_type,
            'imagem' => $this->image_url,
            'url_detalhes' => $this->details_url,
            'is_published' => $this->is_published,
            'published_at' => $publishedAt,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
