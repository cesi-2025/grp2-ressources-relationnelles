<?php

namespace App\Enums;

enum Role: string
{
    case CITIZEN = 'citizen';
    case MODERATOR = 'moderator';
    case ADMIN = 'admin';
    case SUPER_ADMIN = 'super_admin';
}
