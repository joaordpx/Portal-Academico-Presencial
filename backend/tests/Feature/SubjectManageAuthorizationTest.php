<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Subject;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubjectManageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(int $courseId): array
    {
        return [
            'course_id' => $courseId,
            'period' => 1,
            'name' => 'Algoritmos e Estruturas de Dados',
        ];
    }

    public function test_guest_cannot_manage_subjects(): void
    {
        $course = Course::factory()->create();

        $response = $this->postJson('/api/subjects', $this->validPayload($course->id));

        $response->assertStatus(401);
        $response->assertJsonPath('message', 'Unauthenticated.');
        $response->assertJsonPath('error.code', 'AUTH_401');
        $response->assertJsonPath('error.type', 'authentication');
    }

    public function test_aluno_cannot_manage_subjects(): void
    {
        $this->seed(RoleSeeder::class);
        $course = Course::factory()->create();

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/subjects', $this->validPayload($course->id));

        $response->assertStatus(403);
        $response->assertJsonPath('message', 'This action is unauthorized.');
        $response->assertJsonPath('error.code', 'AUTH_403');
        $response->assertJsonPath('error.type', 'authorization');
    }

    public function test_admin_can_only_create_subject_for_linked_course(): void
    {
        $this->seed(RoleSeeder::class);
        $course = Course::factory()->create();
        $admin = User::factory()->create()->assignRole('admin');

        // Tentativa sem vínculo -> 422 (validado no after() do Controller)
        $response = $this->actingAs($admin)->postJson('/api/subjects', $this->validPayload($course->id));
        $response->assertStatus(422);

        // Com vínculo
        $admin->adminCourses()->attach($course->id);
        $response = $this->actingAs($admin)->postJson('/api/subjects', $this->validPayload($course->id));

        $response->assertStatus(201);
        $response->assertJsonPath('data.course_id', $course->id);
    }

    public function test_admin_can_only_update_subject_of_linked_course(): void
    {
        $this->seed(RoleSeeder::class);
        $course = Course::factory()->create();
        $subject = Subject::factory()->create(['name' => 'Disciplina Original', 'course_id' => $course->id]);
        $admin = User::factory()->create()->assignRole('admin');

        // Sem vínculo -> 403 (Policy)
        $response = $this->actingAs($admin)->putJson('/api/subjects/' . $subject->id, [
            'name' => 'Tentativa Falha',
        ]);
        $response->assertStatus(403);

        // Com vínculo
        $admin->adminCourses()->attach($course->id);
        $response = $this->actingAs($admin)->putJson('/api/subjects/' . $subject->id, [
            'name' => 'Disciplina Atualizada',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Disciplina Atualizada');
    }

    public function test_admin_can_only_delete_subject_of_linked_course(): void
    {
        $this->seed(RoleSeeder::class);
        $course = Course::factory()->create();
        $subject = Subject::factory()->create(['course_id' => $course->id]);
        $admin = User::factory()->create()->assignRole('admin');

        // Sem vínculo -> 403
        $response = $this->actingAs($admin)->deleteJson('/api/subjects/' . $subject->id);
        $response->assertStatus(403);

        // Com vínculo
        $admin->adminCourses()->attach($course->id);
        $response = $this->actingAs($admin)->deleteJson('/api/subjects/' . $subject->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('subjects', ['id' => $subject->id]);
    }

    public function test_aluno_cannot_update_subject(): void
    {
        $this->seed(RoleSeeder::class);
        $subject = Subject::factory()->create();

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->putJson('/api/subjects/' . $subject->id, [
            'name' => 'Nao deveria atualizar',
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }
}
