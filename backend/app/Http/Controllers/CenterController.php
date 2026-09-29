<?php

namespace App\Http\Controllers;

use App\Http\Resources\CenterResource;
use App\Services\CenterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Validator;

class CenterController extends Controller
{
    public function __construct(private CenterService $centerService)
    {
    }

    /**
     * Display a listing of centers.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $perPage = (int) ($filters['per_page'] ?? 10);
        unset($filters['per_page']);

        return $this->centerService->listCenters($filters, $perPage);
    }

    /**
     * Display the specified center.
     */
    public function show(string $id): CenterResource
    {
        return $this->centerService->getCenterById((int) $id);
    }

    /**
     * Store a newly created center.
     */
    public function store(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:centers,name',
        ])->validated();

        return $this->centerService
            ->createCenter($data)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified center.
     */
    public function update(Request $request, string $id): CenterResource
    {
        $data = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:centers,name,' . $id,
        ])->validated();

        return $this->centerService->updateCenter((int) $id, $data);
    }

    /**
     * Remove the specified center.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->centerService->deleteCenter((int) $id);

        return response()->json(status: 204);
    }
}
