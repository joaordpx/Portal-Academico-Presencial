<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserWebAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_support_can_open_user_admin_page(): void
    {
        $this->seed(RoleSeeder::class);

        $suporte = User::factory()->create()->assignRole('suporte');

        $response = $this->actingAs($suporte)->get('/admin/users');

        $response->assertStatus(200);
        $response->assertSee('Usuários');
        $response->assertSee('Cadastro e manutenção de usuários da plataforma');
    }

    public function test_admin_cannot_open_user_admin_page(): void
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->get('/admin/users');

        $response->assertStatus(403);
    }

    public function test_aluno_cannot_open_user_admin_page(): void
    {
        $this->seed(RoleSeeder::class);

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->get('/admin/users');

        $response->assertStatus(403);
    }
}