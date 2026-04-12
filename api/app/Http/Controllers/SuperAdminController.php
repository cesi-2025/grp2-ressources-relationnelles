<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class SuperAdminController extends Controller
{
    public function createPrivilegedUser(Request $request): JsonResponse
    {
        $normalizedEmail = User::normalizeEmail((string) $request->input('email'));

        $request->merge([
            'name' => trim(strip_tags((string) $request->input('name'))),
            'email' => $normalizedEmail,
            'email_hash' => $normalizedEmail !== '' ? User::hashEmailValue($normalizedEmail) : null,
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255'],
            'email_hash' => ['required', 'string', 'size:64', 'unique:users,email_hash'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::in([Role::MODERATOR->value, Role::ADMIN->value])],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Privileged user created successfully.',
            'user' => $user,
        ], 201);
    }
}