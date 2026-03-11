<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $allowedRoles = collect($roles)
            ->map(static fn (string $role): string => trim($role))
            ->filter()
            ->values();

        if ($allowedRoles->isEmpty()) {
            return response()->json([
                'message' => 'No role constraint defined.',
            ], 500);
        }

        $userRole = $user->role instanceof Role ? $user->role->value : (string) $user->role;

        if (! $allowedRoles->contains($userRole)) {
            return response()->json([
                'message' => 'Forbidden.',
            ], 403);
        }

        return $next($request);
    }
}
