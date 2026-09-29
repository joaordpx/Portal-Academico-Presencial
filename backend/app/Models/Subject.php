<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

use App\Traits\Auditable;

class Subject extends Model
{
    use Searchable, Auditable;
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'period' => $this->period,
            'course_id' => $this->course_id,
            'course_name' => $this->course?->name,
            'description' => "Period {$this->period} of {$this->course?->name}",
        ];
    }
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'course_id',
        'period',
        'name',
    ];

    /**
     * Get the course that owns the subject.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
