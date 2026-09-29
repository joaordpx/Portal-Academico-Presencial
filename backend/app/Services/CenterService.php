<?php

namespace App\Services;

use App\Http\Resources\CenterResource;
use App\Models\Center;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CenterService
{
    /**
     * List and filter centers.
     *
     * @param array<string, mixed> $filters
     */
    public function listCenters(array $filters = [], int $perPage = 10): AnonymousResourceCollection
    {
        $query = Center::query();

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        $centers = $query->orderBy('name')->paginate($perPage);

        return CenterResource::collection($centers);
    }

    /**
     * Get a single center by its ID.
     *
     * @throws ModelNotFoundException
     */
    public function getCenterById(int $id): CenterResource
    {
        return new CenterResource(Center::findOrFail($id));
    }

    /**
     * Create a new center.
     *
     * @param array<string, mixed> $data
     */
    public function createCenter(array $data): CenterResource
    {
        return new CenterResource(Center::create($data));
    }

    /**
     * Update an existing center.
     *
     * @param array<string, mixed> $data
     */
    public function updateCenter(int $id, array $data): CenterResource
    {
        $center = Center::findOrFail($id);
        $center->update($data);

        return new CenterResource($center->fresh());
    }

    /**
     * Delete a center by ID.
     */
    public function deleteCenter(int $id): void
    {
        Center::findOrFail($id)->delete();
    }
}
