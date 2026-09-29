<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseDetailResource;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    protected CourseService $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'search' => 'nullable|string',
            'area' => 'nullable|string',
            'shift' => 'nullable|string',
            'type' => 'nullable|string|in:' . implode(',', Course::TYPES),
            'center_id' => 'nullable|integer|min:1',
            'department_id' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $perPage = (int) ($filters['per_page'] ?? 10);
        unset($filters['per_page']);

        return $this->courseService->listCourses($filters, $perPage);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): CourseDetailResource
    {
        return $this->courseService->getCourseById((int)$id);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Course::class);

        $data = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|in:' . implode(',', Course::TYPES),
            'center_id' => 'nullable|integer|exists:centers,id',
            'department_id' => 'nullable|integer|exists:departments,id',
            'area' => 'required|string|max:255',
            'shift' => 'required|string|max:255',
            'min_duration' => 'required|integer|min:1',
            'market_description' => 'required|string',
            'coordinator_email' => 'required|email|max:255',
        ])->validated();

        return $this->courseService
            ->createCourse($data)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): CourseDetailResource
    {
        $course = Course::findOrFail((int) $id);
        $this->authorize('update', $course);

        $data = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|nullable|string|in:' . implode(',', Course::TYPES),
            'center_id' => 'sometimes|nullable|integer|exists:centers,id',
            'department_id' => 'sometimes|nullable|integer|exists:departments,id',
            'area' => 'sometimes|string|max:255',
            'shift' => 'sometimes|string|max:255',
            'min_duration' => 'sometimes|integer|min:1',
            'market_description' => 'sometimes|string',
            'coordinator_email' => 'sometimes|email|max:255',
        ])->validated();

        return $this->courseService->updateCourse($course->id, $data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $course = Course::findOrFail((int) $id);
        $this->authorize('delete', $course);

        $this->courseService->deleteCourse($course->id);

        return response()->json(status: 204);
    }
}
