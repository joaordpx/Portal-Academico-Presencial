<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_guest_only_sees_public_documents_in_list(): void
    {
        Document::factory()->create(['title' => 'Public Doc', 'is_public' => true]);
        Document::factory()->create(['title' => 'Private Doc', 'is_public' => false]);

        $response = $this->getJson('/api/documents');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Public Doc');
    }

    public function test_guest_cannot_view_private_document_details(): void
    {
        $document = Document::factory()->create(['is_public' => false]);

        $response = $this->getJson('/api/documents/' . $document->id);

        $response->assertStatus(403);
        $response->assertJsonPath('error.code', 'AUTH_403');
    }

    public function test_guest_cannot_download_private_document(): void
    {
        Storage::fake('local');
        $document = Document::factory()->create([
            'is_public' => false,
            'path' => 'private.pdf',
            'disk' => 'local'
        ]);

        $response = $this->get('/api/documents/' . $document->id . '/download');

        $response->assertStatus(403);
    }

    public function test_admin_can_view_their_own_private_document(): void
    {
        $admin = User::factory()->create()->assignRole('admin');
        $document = Document::factory()->create([
            'is_public' => false, 
            'uploaded_by' => $admin->id
        ]);

        $response = $this->actingAs($admin)->getJson('/api/documents/' . $document->id);

        $response->assertStatus(200);
        $response->assertJsonPath('data.title', $document->title);
    }

    public function test_support_can_view_any_private_document(): void
    {
        $support = User::factory()->create()->assignRole('suporte');
        $document = Document::factory()->create(['is_public' => false]);

        $response = $this->actingAs($support)->getJson('/api/documents/' . $document->id);

        $response->assertStatus(200);
    }

    public function test_audit_log_masks_sensitive_data(): void
    {
        $support = User::factory()->create()->assignRole('suporte');
        
        // Trigger an auditable event (creation of a user with PII)
        $this->actingAs($support)->postJson('/api/users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'cpf' => '123.456.789-00',
            'matricula' => '2026001',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'aluno'
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'event' => 'created',
            'auditable_type' => User::class,
        ]);

        $log = \App\Models\AuditLog::where('auditable_type', User::class)
            ->where('event', 'created')
            ->where('new_values->email', 'john@example.com')
            ->latest()
            ->first();

        $this->assertNotNull($log, 'Audit log for user creation was not found.');
        
        $newValues = $log->new_values;

        $this->assertArrayNotHasKey('cpf', $newValues);
        $this->assertArrayNotHasKey('matricula', $newValues);
        $this->assertArrayNotHasKey('password', $newValues);
        $this->assertEquals('John Doe', $newValues['name']);
    }
}
