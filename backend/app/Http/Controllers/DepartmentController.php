<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Services\DepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function __construct(private DepartmentService $departmentService)
    {
    }

    /**
     * Display a listing of departments.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'center_id' => 'nullable|integer|min:1',
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $perPage = (int) ($filters['per_page'] ?? 10);
        unset($filters['per_page']);

        return $this->departmentService->listDepartments($filters, $perPage);
    }

    /**
     * Display the specified department.
     */
    public function show(string $id): DepartmentResource
    {
        return $this->departmentService->getDepartmentById((int) $id);
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'center_id' => 'nullable|integer|exists:centers,id',
            'name' => 'required|string|max:255',
        ])->validated();

        return $this->departmentService
            ->createDepartment($data)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, string $id): DepartmentResource
    {
        $data = Validator::make($request->all(), [
            'center_id' => 'sometimes|nullable|integer|exists:centers,id',
            'name' => 'sometimes|string|max:255',
        ])->validated();

        return $this->departmentService->updateDepartment((int) $id, $data);
    }

    /**
     * Remove the specified department.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->departmentService->deleteDepartment((int) $id);

        return response()->json(status: 204);
    }
}
