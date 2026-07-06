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
    public function listUsers(Request $request): JsonResponse
    {
        $query = User::query()->orderByDesc('created_at');
 
        if ($request->query('role')) {
            $query->where('role', $request->query('role'));
        }
 
        return response()->json($query->get());
    }
 
    public function toggleUser(User $user): JsonResponse
    {
        $user->update(['is_active' => ! $user->is_active]);
 
        return response()->json([
            'message' => 'User status updated.',
            'user' => $user,
        ]);
    }
 
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
            'role' => ['required', Rule::in([Role::MODERATOR->value, Role::ADMIN->value, Role::SUPER_ADMIN->value])],
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