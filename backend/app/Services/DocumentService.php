<?php

namespace App\Services;

use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentService
{
    /**
     * List and filter documents.
     */
    public function listDocuments(array $filters = [], int $perPage = 10): AnonymousResourceCollection
    {
        $query = Document::query();

        if (isset($filters['q'])) {
            $value = (string) $filters['q'];
            $query->where(function ($q) use ($value) {
                $q->where('title', 'like', '%' . $value . '%')
                    ->orWhere('original_name', 'like', '%' . $value . '%');
            });
        }

        foreach (['context_type', 'document_type', 'context_id', 'is_public'] as $field) {
            if (isset($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        $documents = $query->orderByDesc('created_at')->paginate($perPage);
        return DocumentResource::collection($documents);
    }

    /**
     * Create and store a new document.
     */
    public function createDocument(array $data, UploadedFile $file, ?User $user): DocumentResource
    {
        $realMime = $file->getMimeType();
        $allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];

        if (!in_array($realMime, $allowedMimes)) {
            throw new \InvalidArgumentException("File content does not match allowed types.");
        }

        $path = $file->store('documents', 'local');
        $searchableText = null;

        if ($realMime === 'application/pdf') {
            try {
                $parser = new \Smalot\PdfParser\Parser();
                $pdf = $parser->parseFile($file->getRealPath());
                $searchableText = $pdf->getText();
            } catch (\Throwable $e) {
                Log::error("Failed to extract text from PDF: " . $e->getMessage());
            }
        } elseif ($realMime === 'text/plain') {
            $searchableText = file_get_contents($file->getRealPath());
        }

        if ($searchableText) {
            $searchableText = mb_substr($searchableText, 0, 50000);
        }

        $document = Document::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'document_type' => $data['document_type'],
            'context_type' => $data['context_type'] ?? null,
            'context_id' => $data['context_id'] ?? null,
            'original_name' => Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension(),
            'extension' => $file->getClientOriginalExtension(),
            'mime_type' => $realMime,
            'size_bytes' => $file->getSize() ?: 0,
            'disk' => 'local',
            'path' => $path,
            'searchable_text' => $searchableText,
            'uploaded_by' => $user?->id,
            'is_public' => (bool) ($data['is_public'] ?? false),
        ]);

        return new DocumentResource($document);
    }

    public function deleteDocument(int $id): void
    {
        $document = Document::findOrFail($id);
        if (Storage::disk($document->disk)->exists($document->path)) {
            Storage::disk($document->disk)->delete($document->path);
        }
        $document->delete();
    }
}
