<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCourseLinkAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_link_course_to_admin(): void
    {
        $this->seed(RoleSeeder::class);

        $targetAdmin = User::factory()->create();
        $targetAdmin->assignRole('admin');
        $course = Course::factory()->create();

        $response = $this->postJson('/api/admins/' . $targetAdmin->id . '/courses/' . $course->id);

        $response->assertStatus(401);
        $response->assertJsonPath('error.code', 'AUTH_401');
    }

    public function test_aluno_cannot_link_course_to_admin(): void
    {
        $this->seed(RoleSeeder::class);

        $targetAdmin = User::factory()->create();
        $targetAdmin->assignRole('admin');
        $course = Course::factory()->create();
        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/admins/' . $targetAdmin->id . '/courses/' . $course->id);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }

    public function test_admin_can_link_and_unlink_course(): void
    {
        $this->seed(RoleSeeder::class);

        $targetAdmin = User::factory()->create();
        $targetAdmin->assignRole('admin');

        $course = Course::factory()->create();
        $admin = User::factory()->create()->assignRole('admin');

        $linkResponse = $this->actingAs($admin)->postJson('/api/admins/' . $targetAdmin->id . '/courses/' . $course->id);

        $linkResponse->assertStatus(201);
        $this->assertDatabaseHas('course_user', [
            'user_id' => $targetAdmin->id,
            'course_id' => $course->id,
        ]);

        $listResponse = $this->actingAs($admin)->getJson('/api/admins/' . $targetAdmin->id . '/courses');

        $listResponse->assertStatus(200);
        $listResponse->assertJsonPath('data.0.id', $course->id);

        $unlinkResponse = $this->actingAs($admin)->deleteJson('/api/admins/' . $targetAdmin->id . '/courses/' . $course->id);

        $unlinkResponse->assertStatus(204);
        $this->assertDatabaseMissing('course_user', [
            'user_id' => $targetAdmin->id,
            'course_id' => $course->id,
        ]);
    }
}
