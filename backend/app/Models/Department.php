<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

use App\Traits\Auditable;

class Department extends Model
{
    use Searchable, Auditable;
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'center_id' => $this->center_id,
            'center_name' => $this->center?->name,
            'description' => "Department of {$this->name} at {$this->center?->name}",
        ];
    }
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'center_id',
        'name',
    ];

    /**
     * Get the center this department belongs to.
     */
    public function center(): BelongsTo
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * Get the courses associated to this department.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
