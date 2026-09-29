<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    private function suporteUser(): User
    {
        $this->seed(RoleSeeder::class);

        return User::factory()->create()->assignRole('suporte');
    }

    public function test_suporte_can_list_users(): void
    {
        $suporte = $this->suporteUser();
        User::factory()->count(3)->create();

        $response = $this->actingAs($suporte)->getJson('/api/users');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'cpf',
                    'matricula',
                    'email',
                    'course_id',
                    'role',
                    'roles',
                ],
            ],
            'links',
            'meta',
        ]);
    }

    public function test_suporte_can_view_user(): void
    {
        $suporte = $this->suporteUser();
        $user = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($suporte)->getJson('/api/users/' . $user->id);

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $user->id);
        $response->assertJsonPath('data.email', $user->email);
        $response->assertJsonPath('data.role', 'aluno');
    }

    public function test_suporte_can_create_user(): void
    {
        $suporte = $this->suporteUser();

        $response = $this->actingAs($suporte)->postJson('/api/users', [
            'name' => 'Usuario Criado',
            'cpf' => '123.456.789-10',
            'matricula' => 'A123456',
            'email' => 'usuario.criado@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'aluno',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.email', 'usuario.criado@example.com');
        $response->assertJsonPath('data.role', 'aluno');
        $this->assertDatabaseHas('users', ['email' => 'usuario.criado@example.com']);
    }

    public function test_suporte_can_update_user(): void
    {
        $suporte = $this->suporteUser();
        $user = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($suporte)->putJson('/api/users/' . $user->id, [
            'name' => 'Usuario Editado',
            'email' => 'usuario.editado@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'suporte',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Usuario Editado');
        $response->assertJsonPath('data.role', 'suporte');
        $this->assertDatabaseHas('users', ['id' => $user->id, 'email' => 'usuario.editado@example.com']);
    }

    public function test_suporte_can_delete_user(): void
    {
        $suporte = $this->suporteUser();
        $user = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($suporte)->deleteJson('/api/users/' . $user->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
