<?php

namespace Tests\Feature\Auth;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
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
            'name' => '  <b>New Citizen</b>  ',
            'email' => '  NEW.CITIZEN@example.com  ',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => ['id', 'name', 'email', 'role'],
            ])
            ->assertJsonPath('user.name', 'New Citizen')
            ->assertJsonPath('user.email', 'new.citizen@example.com');

        $this->assertDatabaseHas('users', [
            'email_hash' => User::hashEmailValue('new.citizen@example.com'),
            'role' => Role::CITIZEN->value,
            'is_active' => true,
        ]);

        $user = User::query()->where('email_hash', User::hashEmailValue('new.citizen@example.com'))->firstOrFail();

        $this->assertSame('New Citizen', $user->name);
        $this->assertSame('new.citizen@example.com', $user->email);
        $this->assertNotSame('new.citizen@example.com', $user->getRawOriginal('email'));
        $this->assertNotSame('New Citizen', $user->getRawOriginal('name'));
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

    public function test_protected_auth_routes_require_authentication(): void
    {
        $this->postJson('/api/logout')
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);

        $this->getJson('/api/user')
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);

        $this->deleteJson('/api/user')
            ->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_user_deletion_anonymizes_account_and_revokes_tokens(): void
    {
        $user = User::factory()->create([
            'name' => 'Citizen Name',
            'email' => 'delete.me@example.com',
            'role' => Role::ADMIN,
            'is_active' => true,
        ]);

        $token = $user->createToken('delete-account')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->deleteJson('/api/user')
            ->assertOk()
            ->assertJson([
                'message' => 'Account anonymized successfully.',
            ]);

        $user->refresh();

        $this->assertSame('Deleted User', $user->name);
        $this->assertFalse($user->is_active);
        $this->assertSame(Role::CITIZEN, $user->role);
        $this->assertStringStartsWith('deleted-user-'.$user->id.'-', $user->email);
        $this->assertStringEndsWith('@example.invalid', $user->email);
        $this->assertNotSame($user->email, $user->getRawOriginal('email'));
        $this->assertDatabaseCount('personal_access_tokens', 0);
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

    public function test_api_responses_include_security_headers(): void
    {
        $this->getJson('/api/ping')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('Referrer-Policy', 'no-referrer')
            ->assertHeader('X-XSS-Protection', '1; mode=block')
            ->assertHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    }
}
