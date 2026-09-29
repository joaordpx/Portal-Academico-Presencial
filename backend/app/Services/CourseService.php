<?php

namespace App\Services;

use App\Http\Resources\CourseDetailResource;
use App\Http\Resources\CourseListResource;
use App\Models\Course;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CourseService
{
    /**
     * List and filter courses.
     *
     * @param array<string, mixed> $filters
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function listCourses(array $filters = [], int $perPage = 10): AnonymousResourceCollection
    {
        $query = Course::with(['center', 'department']);

        // Apply filters
        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['area'])) {
            $query->where('area', $filters['area']);
        }

        if (isset($filters['shift'])) {
            $query->where('shift', $filters['shift']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['center_id'])) {
            $query->where('center_id', $filters['center_id']);
        }

        if (isset($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        // Order and paginate
        $courses = $query->orderBy('name')->paginate($perPage);

        return CourseListResource::collection($courses);
    }

    /**
     * Get a single course by its ID with its subjects.
     *
     * @param int $id
     * @return CourseDetailResource
     * @throws ModelNotFoundException
     */
    public function getCourseById(int $id): CourseDetailResource
    {
        $course = Course::with(['center', 'department', 'subjects' => function ($query) {
            $query->orderBy('period');
        }])->findOrFail($id);

        return new CourseDetailResource($course);
    }

    /**
     * Create a new course.
     *
     * @param array<string, mixed> $data
     */
    public function createCourse(array $data): CourseDetailResource
    {
        $course = Course::create($data);

        return new CourseDetailResource($course->load('subjects'));
    }

    /**
     * Update an existing course by ID.
     *
     * @param int $id
     * @param array<string, mixed> $data
     */
    public function updateCourse(int $id, array $data): CourseDetailResource
    {
        $course = Course::findOrFail($id);
        $course->update($data);

        return new CourseDetailResource($course->fresh()->load('subjects'));
    }

    /**
     * Delete a course by ID.
     */
    public function deleteCourse(int $id): void
    {
        $course = Course::findOrFail($id);
        $course->delete();
    }
}
