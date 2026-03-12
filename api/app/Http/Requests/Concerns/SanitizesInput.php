<?php

namespace App\Http\Requests\Concerns;

trait SanitizesInput
{
    protected function sanitizePlainText(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $sanitized = strip_tags($value);
        $sanitized = preg_replace('/\s+/u', ' ', $sanitized) ?? $sanitized;

        return trim($sanitized);
    }

    protected function sanitizeEmail(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return strtolower(trim($value));
    }
}
