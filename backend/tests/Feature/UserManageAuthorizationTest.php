<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(): array
    {
        return [
            'name' => 'Novo Usuario',
            'cpf' => '123.456.789-10',
            'matricula' => 'A123456',
            'email' => 'novo.usuario@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'aluno',
        ];
    }

    public function test_guest_cannot_manage_users(): void
    {
        $response = $this->postJson('/api/users', $this->validPayload());

        $response->assertStatus(401);
        $response->assertJsonPath('message', 'Unauthenticated.');
        $response->assertJsonPath('error.code', 'AUTH_401');
        $response->assertJsonPath('error.type', 'authentication');
    }

    public function test_aluno_cannot_manage_users(): void
    {
        $this->seed(RoleSeeder::class);

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/users', $this->validPayload());

        $response->assertStatus(403);
        $response->assertJsonPath('message', 'This action is unauthorized.');
        $response->assertJsonPath('error.code', 'AUTH_403');
        $response->assertJsonPath('error.type', 'authorization');
    }

    public function test_admin_cannot_manage_users(): void
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->postJson('/api/users', $this->validPayload());

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }

    public function test_suporte_can_manage_users(): void
    {
        $this->seed(RoleSeeder::class);

        $suporte = User::factory()->create()->assignRole('suporte');

        $response = $this->actingAs($suporte)->postJson('/api/users', $this->validPayload());

        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'Novo Usuario');
        $response->assertJsonPath('data.role', 'aluno');
        $this->assertDatabaseHas('users', ['email' => 'novo.usuario@example.com']);
    }
}
