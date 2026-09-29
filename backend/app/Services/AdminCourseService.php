<?php

namespace App\Services;

use App\Http\Resources\CourseListResource;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class AdminCourseService
{
    /**
     * List courses linked to an admin user.
     */
    public function listAdminCourses(User $user, int $perPage = 10): AnonymousResourceCollection
    {
        $this->assertUserIsAdmin($user);

        $courses = $user->adminCourses()->orderBy('name')->paginate($perPage);

        return CourseListResource::collection($courses);
    }

    /**
     * Link one course to an admin user.
     */
    public function attachCourse(User $user, Course $course): void
    {
        $this->assertUserIsAdmin($user);

        $user->adminCourses()->syncWithoutDetaching([$course->id]);
    }

    /**
     * Unlink one course from an admin user.
     */
    public function detachCourse(User $user, Course $course): void
    {
        $this->assertUserIsAdmin($user);

        $user->adminCourses()->detach($course->id);
    }

    /**
     * Ensure course assignment is only done for admin users.
     */
    private function assertUserIsAdmin(User $user): void
    {
        if (! $user->hasRole('admin')) {
            throw ValidationException::withMessages([
                'user' => 'The selected user must have the admin role.',
            ]);
        }
    }
}
