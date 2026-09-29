<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

use App\Traits\Auditable;

class Course extends Model
{
    use Searchable, Auditable;
    
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'area' => $this->area,
            'shift' => $this->shift,
            'market_description' => $this->market_description,
            'center_name' => $this->center?->name,
            'department_name' => $this->department?->name,
            'description' => $this->market_description,
        ];
    }
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;

    /**
     * Official institutional course types.
     *
     * @var array<int, string>
     */
    public const TYPES = [
        'graduacao',
        'pos-graduacao',
        'tecnico',
        'ead',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'center_id',
        'department_id',
        'area',
        'shift',
        'min_duration',
        'market_description',
        'coordinator_email',
    ];

    /**
     * Get the subjects for the course.
     */
    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }

    /**
     * Get the center that owns this course.
     */
    public function center(): BelongsTo
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * Get the department that owns this course.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the students for the course.
     */
    public function students(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get admins linked to one or more courses.
     */
    public function admins(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
