<?php

namespace App\Services;

use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectService
{
    /**
     * List and filter subjects.
     *
     * @param array<string, mixed> $filters
     */
    public function listSubjects(array $filters = [], int $perPage = 10): AnonymousResourceCollection
    {
        $query = Subject::query();

        if (isset($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }

        if (isset($filters['period'])) {
            $query->where('period', $filters['period']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        $subjects = $query->orderBy('period')->orderBy('name')->paginate($perPage);

        return SubjectResource::collection($subjects);
    }

    /**
     * Get a single subject by its ID.
     *
     * @throws ModelNotFoundException
     */
    public function getSubjectById(int $id): SubjectResource
    {
        $subject = Subject::findOrFail($id);

        return new SubjectResource($subject);
    }

    /**
     * Create a new subject.
     *
     * @param array<string, mixed> $data
     */
    public function createSubject(array $data): SubjectResource
    {
        $subject = Subject::create($data);

        return new SubjectResource($subject);
    }

    /**
     * Update an existing subject by ID.
     *
     * @param array<string, mixed> $data
     */
    public function updateSubject(int $id, array $data): SubjectResource
    {
        $subject = Subject::findOrFail($id);
        $subject->update($data);

        return new SubjectResource($subject->fresh());
    }

    /**
     * Delete a subject by ID.
     */
    public function deleteSubject(int $id): void
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
    }
}
