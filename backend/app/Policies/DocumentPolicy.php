<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Document $document): bool
    {
        if ($document->is_public) {
            return true;
        }

        // If not public, must be authenticated and have privilege
        if (! $user) {
            return false;
        }

        if ($user->hasRole('suporte')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            // Admin can see their own
            if ($document->uploaded_by === $user->id) {
                return true;
            }

            // Or if linked to their course
            if ($document->context_type === 'course') {
                return $user->adminCourses()->where('course_id', $document->context_id)->exists();
            }
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['suporte', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Document $document): bool
    {
        if ($user->hasRole('suporte')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            // Admin can delete their own uploads
            if ($document->uploaded_by === $user->id) {
                return true;
            }

            // Or if linked to the course/department context
            if ($document->context_type === 'course') {
                return $user->adminCourses()->where('course_id', $document->context_id)->exists();
            }
        }

        return false;
    }
}
