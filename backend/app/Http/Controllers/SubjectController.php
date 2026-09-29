<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use App\Services\SubjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function __construct(private SubjectService $subjectService)
    {
    }

    /**
     * Display a listing of subjects.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'course_id' => 'nullable|integer|min:1',
            'period' => 'nullable|integer|min:1',
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $perPage = (int) ($filters['per_page'] ?? 10);
        unset($filters['per_page']);

        return $this->subjectService->listSubjects($filters, $perPage);
    }

    /**
     * Display the specified subject.
     */
    public function show(string $id): SubjectResource
    {
        return $this->subjectService->getSubjectById((int) $id);
    }

    /**
     * Store a newly created subject.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Subject::class);

        $data = Validator::make($request->all(), [
            'course_id' => 'required|integer|exists:courses,id',
            'period' => 'required|integer|min:1',
            'name' => 'required|string|max:255',
        ])->after(function ($validator) use ($request) {
            $user = $request->user();
            if ($user->hasRole('admin')) {
                // Admin só pode criar disciplina para os cursos que gerencia
                $courseId = $request->input('course_id');
                if (!$user->adminCourses()->where('course_id', $courseId)->exists()) {
                    $validator->errors()->add('course_id', 'Você não tem permissão para gerenciar este curso.');
                }
            }
        })->validated();

        return $this->subjectService
            ->createSubject($data)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified subject.
     */
    public function update(Request $request, string $id): SubjectResource
    {
        $subject = Subject::findOrFail((int) $id);
        $this->authorize('update', $subject);

        $data = Validator::make($request->all(), [
            'course_id' => 'sometimes|integer|exists:courses,id',
            'period' => 'sometimes|integer|min:1',
            'name' => 'sometimes|string|max:255',
        ])->after(function ($validator) use ($request) {
            $user = $request->user();
            if ($user->hasRole('admin')) {
                $courseId = $request->input('course_id');
                if ($courseId && !$user->adminCourses()->where('course_id', $courseId)->exists()) {
                    $validator->errors()->add('course_id', 'Você não tem permissão para vincular esta disciplina a este curso.');
                }
            }
        })->validated();

        return $this->subjectService->updateSubject($subject->id, $data);
    }

    /**
     * Remove the specified subject.
     */
    public function destroy(string $id): JsonResponse
    {
        $subject = Subject::findOrFail((int) $id);
        $this->authorize('delete', $subject);

        $this->subjectService->deleteSubject($subject->id);

        return response()->json(status: 204);
    }
}
