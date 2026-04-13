<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActivitySession extends Model
{
    protected $fillable = [
        'resource_id',
        'owner_id',
        'started_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
    ];

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ActivitySessionParticipant::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ActivitySessionMessage::class);
    }
}
