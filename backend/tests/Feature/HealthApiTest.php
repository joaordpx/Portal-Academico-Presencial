<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    /**
     * Test the health check endpoint returns 401 for guests.
     */
    public function test_health_check_returns_401_for_guest(): void
    {
        $response = $this->getJson('/api/health');
        $response->assertStatus(401);
    }

    /**
     * Test the health check endpoint returns 403 for unauthorized users (admin/aluno).
     */
    public function test_health_check_returns_403_for_unauthorized_users(): void
    {
        $admin = User::factory()->create()->assignRole('admin');
        $aluno = User::factory()->create()->assignRole('aluno');

        $this->actingAs($admin)->getJson('/api/health')->assertStatus(403);
        $this->actingAs($aluno)->getJson('/api/health')->assertStatus(403);
    }

    /**
     * Test the health check endpoint returns 200 for suporte role.
     */
    public function test_health_check_returns_success_for_suporte(): void
    {
        $support = User::factory()->create()->assignRole('suporte');

        $response = $this->actingAs($support)->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'timestamp',
                'services' => [
                    'database',
                    'redis',
                    'meilisearch',
                    'storage'
                ],
                'system' => [
                    'php_version',
                    'environment'
                ]
            ]);
    }
}
