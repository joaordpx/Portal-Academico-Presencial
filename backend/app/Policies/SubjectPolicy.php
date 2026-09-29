<?php

namespace App\Policies;

use App\Models\Subject;
use App\Models\User;

class SubjectPolicy
{
    /**
     * Determine whether the user can view any subjects.
     */
    public function viewAny(?User $user): bool
    {
        // Subjects listing is currently public by product decision.
        return true;
    }

    /**
     * Determine whether the user can view the subject.
     */
    public function view(?User $user, Subject $subject): bool
    {
        // Subject detail is currently public by product decision.
        return true;
    }

    /**
     * Determine whether the user can create subjects.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['suporte', 'admin']);
    }

    /**
     * Determine whether the user can update the subject.
     */
    public function update(User $user, Subject $subject): bool
    {
        if ($user->hasRole('suporte')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            // Verifica se o admin está vinculado ao curso desta disciplina
            return $user->adminCourses()->where('course_id', $subject->course_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the subject.
     */
    public function delete(User $user, Subject $subject): bool
    {
        if ($user->hasRole('suporte')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            // Verifica se o admin está vinculado ao curso desta disciplina
            return $user->adminCourses()->where('course_id', $subject->course_id)->exists();
        }

        return false;
    }
}
