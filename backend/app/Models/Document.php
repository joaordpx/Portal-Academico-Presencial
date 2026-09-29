<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

use App\Traits\Auditable;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory, Searchable, Auditable;

    /**
     * Supported document classifications.
     *
     * @var array<int, string>
     */
    public const DOCUMENT_TYPES = [
        'notice',
        'edital',
        'ppc',
        'event',
        'general',
    ];

    /**
     * Supported relational target contexts.
     *
     * @var array<int, string>
     */
    public const CONTEXT_TYPES = [
        'course',
        'subject',
        'center',
        'department',
    ];

    /**
     * Relational context to table map for existence checks.
     *
     * @var array<string, string>
     */
    public const CONTEXT_ENTITY_TABLES = [
        'course' => 'courses',
        'subject' => 'subjects',
        'center' => 'centers',
        'department' => 'departments',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'document_type',
        'context_type',
        'context_id',
        'original_name',
        'extension',
        'mime_type',
        'size_bytes',
        'disk',
        'path',
        'searchable_text',
        'uploaded_by',
        'is_public',
    ];

    /**
     * Build the searchable representation of the document.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        // Combinamos os metadados com o conteúdo extraído do PDF
        $metadata = implode(' ', array_filter([
            $this->title,
            $this->description,
            $this->document_type,
            $this->context_type,
            $this->original_name,
            $this->extension,
        ]));

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'document_type' => $this->document_type,
            'context_type' => $this->context_type,
            'context_id' => $this->context_id,
            'original_name' => $this->original_name,
            'extension' => $this->extension,
            'mime_type' => $this->mime_type,
            'is_public' => (bool) $this->is_public,
            // Aqui garantimos que o conteúdo do PDF (do banco) + metadados sejam indexados
            'searchable_text' => trim($metadata . ' ' . $this->searchable_text),
        ];
    }

    /**
     * Document uploader relation.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
