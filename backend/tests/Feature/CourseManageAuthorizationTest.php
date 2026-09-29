<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseManageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'name' => 'Sistemas de Informacao',
            'type' => 'graduacao',
            'area' => 'Computacao',
            'shift' => 'Noturno',
            'min_duration' => 8,
            'market_description' => 'Curso voltado para desenvolvimento de sistemas.',
            'coordinator_email' => 'coordenacao.si@unimontes.br',
        ];
    }

    public function test_guest_cannot_manage_courses(): void
    {
        $response = $this->postJson('/api/courses', $this->validPayload());

        $response->assertStatus(401);
        $response->assertJsonPath('message', 'Unauthenticated.');
        $response->assertJsonPath('error.code', 'AUTH_401');
        $response->assertJsonPath('error.type', 'authentication');
    }

    public function test_aluno_cannot_manage_courses(): void
    {
        $this->seed(RoleSeeder::class);

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/courses', $this->validPayload());

        $response->assertStatus(403);
        $response->assertJsonPath('message', 'This action is unauthorized.');
        $response->assertJsonPath('error.code', 'AUTH_403');
        $response->assertJsonPath('error.type', 'authorization');
    }

    public function test_admin_cannot_create_course_now(): void
    {
        $this->seed(RoleSeeder::class);
        $admin = User::factory()->create()->assignRole('admin');

        // Agora admin não pode mais criar curso (regra 'tudo é proibido exceto quando permitido')
        $response = $this->actingAs($admin)->postJson('/api/courses', $this->validPayload());

        $response->assertStatus(403);
    }

    public function test_support_can_create_course(): void
    {
        $this->seed(RoleSeeder::class);
        $support = User::factory()->create()->assignRole('suporte');

        $response = $this->actingAs($support)->postJson('/api/courses', $this->validPayload());

        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'Sistemas de Informacao');
    }

    public function test_admin_can_only_update_linked_course(): void
    {
        $this->seed(RoleSeeder::class);

        $course = Course::factory()->create(['name' => 'Curso Original']);
        $admin = User::factory()->create()->assignRole('admin');

        // Admin NÃO vinculado -> 403
        $response = $this->actingAs($admin)->putJson('/api/courses/' . $course->id, [
            'name' => 'Tentativa Falha',
        ]);
        $response->assertStatus(403);

        // Vincula admin ao curso
        $admin->adminCourses()->attach($course->id);

        // Agora deve conseguir
        $response = $this->actingAs($admin)->putJson('/api/courses/' . $course->id, [
            'name' => 'Curso Atualizado',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Curso Atualizado');
    }

    public function test_admin_cannot_delete_course_now(): void
    {
        $this->seed(RoleSeeder::class);

        $course = Course::factory()->create();
        $admin = User::factory()->create()->assignRole('admin');

        // Admin não pode mais deletar (somente suporte)
        $response = $this->actingAs($admin)->deleteJson('/api/courses/' . $course->id);

        $response->assertStatus(403);
    }

    public function test_aluno_cannot_delete_course(): void
    {
        $this->seed(RoleSeeder::class);

        $course = Course::factory()->create();
        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->deleteJson('/api/courses/' . $course->id);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }
}
