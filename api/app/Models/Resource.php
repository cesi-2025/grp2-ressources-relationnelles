<?php

namespace App\Models;

use App\Enums\ResourceStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resource extends Model
{
    protected $fillable = [
        'title',
        'content',
        'user_id',
        'category_id',
        'relation_type_id',
        'resource_type_id',
        'status',
        'is_public'
    ];

    protected function casts(): array
    {
        return [
            'status' => ResourceStatus::class,
            'is_public' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function relationType(): BelongsTo
    {
        return $this->belongsTo(RelationType::class);
    }

    public function resourceType(): BelongsTo
    {
        return $this->belongsTo(ResourceType::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function progressions(): HasMany
    {
        return $this->hasMany(Progression::class);
    }
}
