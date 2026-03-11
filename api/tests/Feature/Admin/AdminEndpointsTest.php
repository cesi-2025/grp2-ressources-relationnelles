<?php

namespace Tests\Feature\Admin;

use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Progression;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_statistics_returns_metrics_and_supports_category_filter(): void
    {
        $admin = User::factory()->create(['role' => Role::ADMIN, 'is_active' => true]);

        [$resourceA, $resourceB] = $this->createResourcesAcrossCategories();

        Progression::query()->create([
            'user_id' => $admin->id,
            'resource_id' => $resourceA->id,
            'status' => 'exploited',
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/statistics')
            ->assertOk()
            ->assertJsonStructure([
                'filters' => ['period', 'category'],
                'statistics' => [
                    'consultations',
                    'recherches',
                    'exploitations',
                    'creations',
                    'favoris',
                    'commentaires',
                    'resources_pending',
                    'resources_published',
                ],
            ]);

        $this->getJson('/api/admin/statistics?category='.$resourceA->category_id)
            ->assertOk()
            ->assertJsonPath('statistics.creations', 1)
            ->assertJsonPath('statistics.exploitations', 1);

        $this->getJson('/api/admin/statistics?category='.$resourceB->category_id)
            ->assertOk()
            ->assertJsonPath('statistics.creations', 1)
            ->assertJsonPath('statistics.exploitations', 0);
    }

    public function test_admin_can_suspend_resource(): void
    {
        $admin = User::factory()->create(['role' => Role::ADMIN, 'is_active' => true]);
        [$resource] = $this->createResourcesAcrossCategories();

        Sanctum::actingAs($admin);

        $this->putJson('/api/admin/resources/'.$resource->id.'/suspend')
            ->assertOk()
            ->assertJsonPath('resource.status', ResourceStatus::ARCHIVED->value);

        $this->assertDatabaseHas('resources', [
            'id' => $resource->id,
            'status' => ResourceStatus::ARCHIVED->value,
        ]);
    }

    public function test_moderator_can_validate_resource_and_moderate_comments(): void
    {
        $moderator = User::factory()->create(['role' => Role::MODERATOR, 'is_active' => true]);
        [$resource] = $this->createResourcesAcrossCategories();
        $author = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $comment = Comment::query()->create([
            'content' => 'Pending comment',
            'user_id' => $author->id,
            'resource_id' => $resource->id,
            'is_approved' => false,
        ]);

        Sanctum::actingAs($moderator);

        $this->putJson('/api/moderation/resources/'.$resource->id.'/validate')
            ->assertOk()
            ->assertJsonPath('resource.status', ResourceStatus::PUBLISHED->value);

        $this->putJson('/api/moderation/comments/'.$comment->id.'/approve')
            ->assertOk()
            ->assertJsonPath('comment.is_approved', true);

        $this->deleteJson('/api/moderation/comments/'.$comment->id)
            ->assertOk();

        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id,
        ]);
    }

    public function test_super_admin_can_create_privileged_user(): void
    {
        $superAdmin = User::factory()->create(['role' => Role::SUPER_ADMIN, 'is_active' => true]);

        Sanctum::actingAs($superAdmin);

        $this->postJson('/api/super-admin/users', [
            'name' => 'Moderator User',
            'email' => 'moderator.created@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => Role::MODERATOR->value,
            'is_active' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('user.role', Role::MODERATOR->value);

        $this->assertDatabaseHas('users', [
            'email' => 'moderator.created@example.com',
            'role' => Role::MODERATOR->value,
            'is_active' => true,
        ]);
    }

    public function test_role_protection_is_enforced_for_admin_groups(): void
    {
        $citizen = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);
        [$resource] = $this->createResourcesAcrossCategories();
        $commentAuthor = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);
        $comment = Comment::query()->create([
            'content' => 'Comment',
            'user_id' => $commentAuthor->id,
            'resource_id' => $resource->id,
            'is_approved' => false,
        ]);

        Sanctum::actingAs($citizen);

        $this->getJson('/api/admin/statistics')->assertForbidden();
        $this->putJson('/api/admin/resources/'.$resource->id.'/suspend')->assertForbidden();
        $this->putJson('/api/moderation/resources/'.$resource->id.'/validate')->assertForbidden();
        $this->putJson('/api/moderation/comments/'.$comment->id.'/approve')->assertForbidden();
        $this->deleteJson('/api/moderation/comments/'.$comment->id)->assertForbidden();
        $this->postJson('/api/super-admin/users', [
            'name' => 'Admin User',
            'email' => 'admin.created@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => Role::ADMIN->value,
        ])->assertForbidden();
    }

    /**
     * @return array<int, Resource>
     */
    private function createResourcesAcrossCategories(): array
    {
        $author = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);
        $relationType = RelationType::query()->create(['name' => 'Relation']);
        $resourceType = ResourceType::query()->create(['name' => 'Type']);
        $categoryA = Category::query()->create(['name' => 'Category A']);
        $categoryB = Category::query()->create(['name' => 'Category B']);

        $resourceA = Resource::query()->create([
            'title' => 'Resource A',
            'content' => 'Resource A content.',
            'user_id' => $author->id,
            'category_id' => $categoryA->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'status' => ResourceStatus::PENDING->value,
            'is_public' => true,
        ]);

        $resourceB = Resource::query()->create([
            'title' => 'Resource B',
            'content' => 'Resource B content.',
            'user_id' => $author->id,
            'category_id' => $categoryB->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'status' => ResourceStatus::PENDING->value,
            'is_public' => true,
        ]);

        return [$resourceA, $resourceB];
    }
}
