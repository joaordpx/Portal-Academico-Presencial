<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'cpf' => $this->cpf,
            'matricula' => $this->matricula,
            'email' => $this->email,
            'course_id' => $this->course_id,
            'course' => CourseListResource::make($this->whenLoaded('course')),
            'role' => $this->roles->first()?->name,
            'roles' => $this->roles->pluck('name')->values(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
