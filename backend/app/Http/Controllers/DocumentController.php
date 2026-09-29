<?php

namespace App\Http\Controllers;

use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function __construct(private DocumentService $documentService)
    {
    }

    /**
     * Display a listing of documents.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = Validator::make($request->all(), [
            'q' => 'nullable|string|max:255',
            'document_type' => 'nullable|string|in:' . implode(',', Document::DOCUMENT_TYPES),
            'context_type' => 'nullable|string|in:' . implode(',', Document::CONTEXT_TYPES),
            'context_id' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ])->validated();

        // Security: In the public listing, only show public documents
        if (! auth()->check() || ! auth()->user()->hasRole(['suporte', 'admin'])) {
            $filters['is_public'] = true;
        }

        $perPage = (int) ($filters['per_page'] ?? 10);
        unset($filters['per_page']);

        return $this->documentService->listDocuments($filters, $perPage);
    }

    /**
     * Display one document metadata.
     */
    public function show(string $id): DocumentResource
    {
        $document = Document::findOrFail((int) $id);
        $this->authorize('view', $document);

        return new DocumentResource($document);
    }

    /**
     * Upload and store a document.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Document::class);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'document_type' => 'required|string|in:' . implode(',', Document::DOCUMENT_TYPES),
            'context_type' => 'nullable|string|in:' . implode(',', Document::CONTEXT_TYPES),
            'context_id' => 'nullable|integer|min:1',
            'is_public' => 'nullable|boolean',
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB limit
                'mimetypes:application/pdf,image/jpeg,image/png,text/plain',
            ],
        ]);

        $validator->after(function ($validator) use ($request): void {
            $documentType = $request->input('document_type');
            $contextType = $request->input('context_type');
            $contextId = $request->input('context_id');

            if ($contextType === null && $contextId !== null) {
                $validator->errors()->add('context_id', 'context_id can only be used when context_type is provided.');
                return;
            }

            if ($contextType === null) {
                if ($documentType === 'ppc') {
                    $validator->errors()->add('context_type', 'ppc documents must be linked to a course.');
                }
                return;
            }

            if ($contextId === null) {
                $validator->errors()->add('context_id', 'context_id is required when context_type is provided.');
                return;
            }

            $table = Document::CONTEXT_ENTITY_TABLES[$contextType];
            if (! DB::table($table)->where('id', $contextId)->exists()) {
                $validator->errors()->add('context_id', 'The selected context_id is invalid.');
            }
            if ($documentType === 'ppc' && $contextType !== 'course') {
                $validator->errors()->add('context_type', 'ppc documents must be linked to a course.');
            }
        });

        $data = $validator->validated();

        $resource = $this->documentService->createDocument(
            $data,
            $request->file('file'),
            $request->user()
        );

        return $resource->response()->setStatusCode(201);
    }

    /**
     * Download the physical file by document ID.
     */
    public function download(string $id): StreamedResponse
    {
        $document = Document::findOrFail((int) $id);
        $this->authorize('view', $document);

        $document->auditCustomEvent('downloaded');

        return Storage::disk($document->disk)->download($document->path, $document->original_name);
    }

    /**
     * Remove one document.
     */
    public function destroy(string $id): JsonResponse
    {
        $document = Document::findOrFail((int) $id);
        $this->authorize('delete', $document);
        
        $this->documentService->deleteDocument((int) $id);

        return response()->json(status: 204);
    }
}
