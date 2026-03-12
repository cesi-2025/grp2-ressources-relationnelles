<?php

namespace Tests\Feature\Auth;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        RateLimiter::clear('login@example.com|127.0.0.1');
        RateLimiter::clear('new.citizen@example.com|127.0.0.1');

        parent::tearDown();
    }

    public function test_register_creates_citizen_and_returns_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New Citizen',
            'email' => 'new.citizen@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => ['id', 'name', 'email', 'role'],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'new.citizen@example.com',
            'role' => Role::CITIZEN->value,
            'is_active' => true,
        ]);
    }

    public function test_login_returns_sanctum_token(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => 'Password123!',
            'role' => Role::CITIZEN,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'Password123!',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => ['id', 'email'],
            ]);
    }

    public function test_login_is_rate_limited_after_too_many_attempts(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => 'Password123!',
            'role' => Role::CITIZEN,
            'is_active' => true,
        ]);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/login', [
                'email' => 'login@example.com',
                'password' => 'wrong-password',
            ])->assertUnauthorized();
        }

        $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    public function test_register_is_rate_limited_after_too_many_attempts(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/register', [
                'name' => 'New Citizen',
                'email' => 'new.citizen@example.com',
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
            ]);
        }

        $this->postJson('/api/register', [
            'name' => 'New Citizen',
            'email' => 'new.citizen@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertStatus(429);
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = User::factory()->create([
            'role' => Role::CITIZEN,
            'is_active' => true,
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this
            ->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout');

        $response->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_user_returns_authenticated_user(): void
    {
        $user = User::factory()->create([
            'role' => Role::CITIZEN,
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response
            ->assertOk()
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function test_role_middleware_blocks_non_admin_and_allows_admin(): void
    {
        $citizen = User::factory()->create([
            'role' => Role::CITIZEN,
            'is_active' => true,
        ]);

        Sanctum::actingAs($citizen);
        $this->getJson('/api/admin/ping')->assertForbidden();

        $admin = User::factory()->create([
            'role' => Role::ADMIN,
            'is_active' => true,
        ]);

        Sanctum::actingAs($admin);
        $this->getJson('/api/admin/ping')
            ->assertOk()
            ->assertJson([
                'status' => 'admin-ok',
            ]);
    }
}
