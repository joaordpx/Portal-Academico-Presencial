<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Document;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReadAuditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_viewing_user_details_triggers_audit_log(): void
    {
        $support = User::factory()->create()->assignRole('suporte');
        $targetUser = User::factory()->create(['name' => 'Target User']);

        $response = $this->actingAs($support)->getJson("/api/users/{$targetUser->id}");

        $response->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $support->id,
            'event' => 'accessed',
            'auditable_type' => User::class,
            'auditable_id' => $targetUser->id,
        ]);
    }

    public function test_downloading_document_triggers_audit_log(): void
    {
        Storage::fake('local');
        
        $file = UploadedFile::fake()->create('test.pdf', 100);
        $path = $file->store('documents', 'local');

        $support = User::factory()->create()->assignRole('suporte');
        $document = Document::factory()->create([
            'is_public' => true,
            'path' => $path,
            'disk' => 'local'
        ]);

        $response = $this->actingAs($support)->get("/api/documents/{$document->id}/download");

        $response->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $support->id,
            'event' => 'downloaded',
            'auditable_type' => Document::class,
            'auditable_id' => $document->id,
        ]);
    }
}
