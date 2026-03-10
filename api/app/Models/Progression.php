<?php

namespace App\Models;

use App\Enums\ProgressionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Progression extends Model
{
    protected $fillable = ['user_id', 'resource_id', 'status'];

    protected function casts(): array
    {
        return [
            'status' => ProgressionStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }
}
