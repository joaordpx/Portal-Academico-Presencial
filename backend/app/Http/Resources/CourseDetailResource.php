<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge((new CourseListResource($this))->toArray($request), [
            'market_description' => $this->market_description,
            'coordinator_email' => $this->coordinator_email,
            'subjects' => SubjectResource::collection($this->whenLoaded('subjects')),
        ]);
    }
}
