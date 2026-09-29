<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Determine whether the user can view any courses.
     */
    public function viewAny(?User $user): bool
    {
        // Courses listing is currently public by product decision.
        return true;
    }

    /**
     * Determine whether the user can view the course.
     */
    public function view(?User $user, Course $course): bool
    {
        // Course detail is currently public by product decision.
        return true;
    }

    /**
     * Determine whether the user can create courses.
     * Only 'suporte' can create new courses. 'admin' manages existing ones.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('suporte');
    }

    /**
     * Determine whether the user can update the course.
     */
    public function update(User $user, Course $course): bool
    {
        if ($user->hasRole('suporte')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            // Verifica se o admin está vinculado a este curso específico
            return $user->adminCourses()->where('course_id', $course->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the course.
     * Only 'suporte' can delete courses.
     */
    public function delete(User $user, Course $course): bool
    {
        return $user->hasRole('suporte');
    }
}
