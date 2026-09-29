<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

use App\Traits\Auditable;

class Center extends Model
{
    use Searchable, Auditable;
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => "Academic Center: {$this->name}",
        ];
    }
    /** @use HasFactory<\Database\Factories\CenterFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get the departments for this center.
     */
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    /**
     * Get the courses associated to this center.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
