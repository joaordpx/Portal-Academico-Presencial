<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'area' => $this->area,
            'shift' => $this->shift,
            'min_duration' => $this->min_duration,
            'type' => $this->type,
            'center_name' => $this->whenLoaded('center', fn() => $this->center->name),
            'department_name' => $this->whenLoaded('department', fn() => $this->department->name),
        ];
    }
}
