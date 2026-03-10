<?php

namespace App\Enums;

enum ResourceStatus: string
{
    case PENDING = 'pending';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';
    case REJECTED = 'rejected';
}
