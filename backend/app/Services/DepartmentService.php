<?php

namespace App\Services;

use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DepartmentService
{
    /**
     * List and filter departments.
     *
     * @param array<string, mixed> $filters
     */
    public function listDepartments(array $filters = [], int $perPage = 10): AnonymousResourceCollection
    {
        $query = Department::query();

        if (isset($filters['center_id'])) {
            $query->where('center_id', $filters['center_id']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        $departments = $query->orderBy('name')->paginate($perPage);

        return DepartmentResource::collection($departments);
    }

    /**
     * Get a single department by its ID.
     *
     * @throws ModelNotFoundException
     */
    public function getDepartmentById(int $id): DepartmentResource
    {
        return new DepartmentResource(Department::findOrFail($id));
    }

    /**
     * Create a new department.
     *
     * @param array<string, mixed> $data
     */
    public function createDepartment(array $data): DepartmentResource
    {
        return new DepartmentResource(Department::create($data));
    }

    /**
     * Update an existing department.
     *
     * @param array<string, mixed> $data
     */
    public function updateDepartment(int $id, array $data): DepartmentResource
    {
        $department = Department::findOrFail($id);
        $department->update($data);

        return new DepartmentResource($department->fresh());
    }

    /**
     * Delete a department by ID.
     */
    public function deleteDepartment(int $id): void
    {
        Department::findOrFail($id)->delete();
    }
}
