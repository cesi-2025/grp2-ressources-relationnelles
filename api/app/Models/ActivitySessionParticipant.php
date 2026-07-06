<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivitySessionParticipant extends Model
{
    protected $fillable = [
        'activity_session_id',
        'user_id',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(ActivitySession::class, 'activity_session_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
