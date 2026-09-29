<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Scout\Searchable;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory, Searchable, Auditable;

    public $incrementing = false;

    protected $keyType = 'int';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'title',
        'description',
        'center_id',
        'starts_at',
        'ends_at',
        'registration_ends_at',
        'workload_hours',
        'available_spots',
        'is_sold_out',
        'campus_name',
        'event_type',
        'image_url',
        'details_url',
        'is_published',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'registration_ends_at' => 'datetime',
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'is_sold_out' => 'boolean',
        'available_spots' => 'integer',
    ];

    /**
     * Build the searchable representation of the event.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'center_id' => $this->center_id,
            'campus_name' => $this->campus_name,
            'event_type' => $this->event_type,
        ];
    }

    /**
     * Get the center that owns the event.
     */
    public function center(): BelongsTo
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * Scope events available for public display.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->where(function (Builder $innerQuery): void {
                $innerQuery->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

}
