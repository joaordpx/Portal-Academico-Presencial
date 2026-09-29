<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CenterManageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'name' => 'Centro de Ciencias Exatas',
        ];
    }

    public function test_guest_cannot_manage_centers(): void
    {
        $response = $this->postJson('/api/centers', $this->validPayload());

        $response->assertStatus(401);
        $response->assertJsonPath('error.code', 'AUTH_401');
    }

    public function test_aluno_cannot_manage_centers(): void
    {
        $this->seed(RoleSeeder::class);

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/centers', $this->validPayload());

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }

    public function test_admin_can_create_center(): void
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->postJson('/api/centers', $this->validPayload());

        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'Centro de Ciencias Exatas');
    }

    public function test_admin_can_update_center(): void
    {
        $this->seed(RoleSeeder::class);
        $center = Center::factory()->create(['name' => 'Centro Antigo']);
        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->putJson('/api/centers/' . $center->id, [
            'name' => 'Centro Atualizado',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Centro Atualizado');
        $this->assertDatabaseHas('centers', ['id' => $center->id, 'name' => 'Centro Atualizado']);
    }

    public function test_admin_can_delete_center(): void
    {
        $this->seed(RoleSeeder::class);
        $center = Center::factory()->create();
        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->deleteJson('/api/centers/' . $center->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('centers', ['id' => $center->id]);
    }

    public function test_aluno_cannot_update_center(): void
    {
        $this->seed(RoleSeeder::class);
        $center = Center::factory()->create();
        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->putJson('/api/centers/' . $center->id, [
            'name' => 'Nao deveria atualizar',
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }
}
