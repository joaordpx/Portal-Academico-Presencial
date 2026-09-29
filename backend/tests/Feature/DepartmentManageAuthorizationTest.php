<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Department;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DepartmentManageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(?int $centerId): array
    {
        return [
            'center_id' => $centerId,
            'name' => 'Departamento de Computacao',
        ];
    }

    public function test_guest_cannot_manage_departments(): void
    {
        $center = Center::factory()->create();

        $response = $this->postJson('/api/departments', $this->validPayload($center->id));

        $response->assertStatus(401);
        $response->assertJsonPath('error.code', 'AUTH_401');
    }

    public function test_aluno_cannot_manage_departments(): void
    {
        $this->seed(RoleSeeder::class);
        $center = Center::factory()->create();

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/departments', $this->validPayload($center->id));

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }

    public function test_admin_can_create_department(): void
    {
        $this->seed(RoleSeeder::class);
        $center = Center::factory()->create();

        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->postJson('/api/departments', $this->validPayload($center->id));

        $response->assertStatus(201);
        $response->assertJsonPath('data.center_id', $center->id);
        $response->assertJsonPath('data.name', 'Departamento de Computacao');
    }

    public function test_admin_can_update_department(): void
    {
        $this->seed(RoleSeeder::class);
        $department = Department::factory()->create(['name' => 'Departamento Antigo']);
        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->putJson('/api/departments/' . $department->id, [
            'name' => 'Departamento Atualizado',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Departamento Atualizado');
        $this->assertDatabaseHas('departments', ['id' => $department->id, 'name' => 'Departamento Atualizado']);
    }

    public function test_admin_can_delete_department(): void
    {
        $this->seed(RoleSeeder::class);
        $department = Department::factory()->create();
        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->deleteJson('/api/departments/' . $department->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('departments', ['id' => $department->id]);
    }

    public function test_aluno_cannot_delete_department(): void
    {
        $this->seed(RoleSeeder::class);
        $department = Department::factory()->create();
        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->deleteJson('/api/departments/' . $department->id);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }
}
