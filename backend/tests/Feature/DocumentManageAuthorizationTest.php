<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Course;
use App\Models\Department;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentManageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_upload_document(): void
    {
        Storage::fake('local');

        $response = $this->postJson('/api/documents', [
            'title' => 'Edital 001',
            'document_type' => 'edital',
            'file' => UploadedFile::fake()->create('edital.pdf', 50, 'application/pdf'),
        ]);

        $response->assertStatus(401);
        $response->assertJsonPath('error.code', 'AUTH_401');
    }

    public function test_aluno_cannot_upload_document(): void
    {
        Storage::fake('local');
        $this->seed(RoleSeeder::class);

        $aluno = User::factory()->create()->assignRole('aluno');

        $response = $this->actingAs($aluno)->postJson('/api/documents', [
            'title' => 'Edital 002',
            'document_type' => 'edital',
            'file' => UploadedFile::fake()->create('edital.pdf', 50, 'application/pdf'),
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }

    public function test_admin_can_upload_and_delete_document(): void
    {
        Storage::fake('local');
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');
        $course = Course::factory()->create();

        $uploadResponse = $this->actingAs($admin)->postJson('/api/documents', [
            'title' => 'PPC Sistemas',
            'document_type' => 'ppc',
            'context_type' => 'course',
            'context_id' => $course->id,
            'file' => UploadedFile::fake()->create('ppc-sistemas.pdf', 120, 'application/pdf'),
        ]);

        $uploadResponse->assertStatus(201);
        $documentId = (int) $uploadResponse->json('data.id');

        $this->assertDatabaseHas('documents', [
            'id' => $documentId,
            'title' => 'PPC Sistemas',
            'document_type' => 'ppc',
            'context_type' => 'course',
            'context_id' => $course->id,
        ]);

        $storedPath = Document::findOrFail($documentId)->path;
        Storage::disk('local')->assertExists($storedPath);

        $deleteResponse = $this->actingAs($admin)->deleteJson('/api/documents/' . $documentId);

        $deleteResponse->assertStatus(204);
        $this->assertDatabaseMissing('documents', ['id' => $documentId]);
        Storage::disk('local')->assertMissing($storedPath);
    }

    public function test_admin_cannot_upload_relational_context_with_nonexistent_target(): void
    {
        Storage::fake('local');
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');

        $response = $this->actingAs($admin)->postJson('/api/documents', [
            'title' => 'Plano de Disciplina',
            'document_type' => 'edital',
            'context_type' => 'course',
            'context_id' => 999999,
            'file' => UploadedFile::fake()->create('plano.pdf', 120, 'application/pdf'),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['context_id']);
    }

    public function test_admin_can_upload_document_linked_to_course(): void
    {
        Storage::fake('local');
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');
        $course = Course::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/documents', [
            'title' => 'Projeto Pedagogico do Curso',
            'document_type' => 'ppc',
            'context_type' => 'course',
            'context_id' => $course->id,
            'file' => UploadedFile::fake()->create('ppc-curso.pdf', 120, 'application/pdf'),
        ]);

        $response->assertStatus(201);
        $documentId = (int) $response->json('data.id');

        $this->assertDatabaseHas('documents', [
            'id' => $documentId,
            'document_type' => 'ppc',
            'context_type' => 'course',
            'context_id' => $course->id,
        ]);
    }

    public function test_admin_can_upload_edital_linked_to_department(): void
    {
        Storage::fake('local');
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');
        $department = Department::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/documents', [
            'title' => 'Edital de Monitoria',
            'document_type' => 'edital',
            'context_type' => 'department',
            'context_id' => $department->id,
            'file' => UploadedFile::fake()->create('edital-monitoria.pdf', 120, 'application/pdf'),
        ]);

        $response->assertStatus(201);
        $documentId = (int) $response->json('data.id');

        $this->assertDatabaseHas('documents', [
            'id' => $documentId,
            'document_type' => 'edital',
            'context_type' => 'department',
            'context_id' => $department->id,
        ]);
    }

    public function test_admin_cannot_upload_ppc_without_course_link(): void
    {
        Storage::fake('local');
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create()->assignRole('admin');
        $department = Department::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/documents', [
            'title' => 'PPC Invalido',
            'document_type' => 'ppc',
            'context_type' => 'department',
            'context_id' => $department->id,
            'file' => UploadedFile::fake()->create('ppc.pdf', 120, 'application/pdf'),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['context_type']);
    }
}
