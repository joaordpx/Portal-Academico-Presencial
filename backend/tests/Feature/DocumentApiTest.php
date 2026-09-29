<?php

namespace Tests\Feature;

use App\Models\Document;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_should_list_documents_publicly(): void
    {
        Document::factory()->count(2)->create(['is_public' => true]);

        $response = $this->getJson('/api/documents');

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    public function test_should_download_document_file_publicly(): void
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('edital-teste.pdf', 25, 'application/pdf');
        $path = $file->store('documents', 'local');

        $document = Document::factory()->create([
            'document_type' => 'edital',
            'context_type' => null,
            'context_id' => null,
            'original_name' => 'edital-teste.pdf',
            'mime_type' => 'application/pdf',
            'disk' => 'local',
            'path' => $path,
            'is_public' => true,
        ]);

        $response = $this->get('/api/documents/' . $document->id . '/download');

        $response->assertStatus(200);
    }
}
