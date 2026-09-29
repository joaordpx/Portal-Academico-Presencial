<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        $perPage = (int) ($filters['per_page'] ?? 10);

        $query = User::query()
            ->with(['course', 'roles'])
            ->orderBy('name');

        if (! empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('cpf', 'like', '%' . $search . '%')
                    ->orWhere('matricula', 'like', '%' . $search . '%');
            });
        }

        return UserResource::collection($query->paginate($perPage));
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): UserResource
    {
        $user->auditCustomEvent('accessed');
        
        return new UserResource($user->load(['course', 'roles']));
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'cpf' => ['nullable', 'string', 'max:14', Rule::unique('users', 'cpf')],
            'matricula' => ['nullable', 'string', 'max:30', Rule::unique('users', 'matricula')],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => 'required|string|min:8|confirmed',
            'course_id' => 'nullable|integer|exists:courses,id',
            'role' => 'required|string|in:suporte,admin,aluno',
        ])->validated();

        $user = DB::transaction(function () use ($data): User {
            $user = User::create([
                'name' => $data['name'],
                'cpf' => $data['cpf'] ?? null,
                'matricula' => $data['matricula'] ?? null,
                'email' => $data['email'],
                'password' => $data['password'],
                'course_id' => $data['course_id'] ?? null,
            ]);

            $user->syncRoles([$data['role']]);

            return $user->load(['course', 'roles']);
        });

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): UserResource
    {
        $data = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'cpf' => ['sometimes', 'nullable', 'string', 'max:14', Rule::unique('users', 'cpf')->ignore($user->id)],
            'matricula' => ['sometimes', 'nullable', 'string', 'max:30', Rule::unique('users', 'matricula')->ignore($user->id)],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'course_id' => 'sometimes|nullable|integer|exists:courses,id',
            'role' => 'sometimes|required|string|in:suporte,admin,aluno',
        ])->validated();

        DB::transaction(function () use ($user, $data): void {
            $payload = [];

            foreach (['name', 'cpf', 'matricula', 'email', 'course_id'] as $field) {
                if (array_key_exists($field, $data)) {
                    $payload[$field] = $data[$field];
                }
            }

            if (array_key_exists('password', $data) && $data['password'] !== null && $data['password'] !== '') {
                $payload['password'] = $data['password'];
            }

            if ($payload !== []) {
                $user->fill($payload);
                $user->save();
            }

            if (array_key_exists('role', $data)) {
                $user->syncRoles([$data['role']]);
            }
        });

        return new UserResource($user->fresh()->load(['course', 'roles']));
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json(status: 204);
    }
}
