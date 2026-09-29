<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use App\Services\AdminCourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Validator;

class AdminCourseController extends Controller
{
    public function __construct(private AdminCourseService $adminCourseService)
    {
    }

    /**
     * List courses linked to an admin user.
     */
    public function index(Request $request, string $user): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $perPage = (int) ($filters['per_page'] ?? 10);

        return $this->adminCourseService->listAdminCourses(User::findOrFail((int) $user), $perPage);
    }

    /**
     * Link a course to an admin user.
     */
    public function store(string $user, string $course): JsonResponse
    {
        $this->adminCourseService->attachCourse(
            User::findOrFail((int) $user),
            Course::findOrFail((int) $course)
        );

        return response()->json([
            'message' => 'Course linked to admin successfully.',
        ], 201);
    }

    /**
     * Unlink a course from an admin user.
     */
    public function destroy(string $user, string $course): JsonResponse
    {
        $this->adminCourseService->detachCourse(
            User::findOrFail((int) $user),
            Course::findOrFail((int) $course)
        );

        return response()->json(status: 204);
    }
}
