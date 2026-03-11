<?php

namespace Tests\Feature\Interaction;

use App\Enums\ProgressionStatus;
use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Progression;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InteractionEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_comments_returns_only_approved_tree_for_resource(): void
    {
        [$resource] = $this->createResourceGraph();
        $user = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $parentApproved = Comment::query()->create([
            'content' => 'Approved parent',
            'user_id' => $user->id,
            'resource_id' => $resource->id,
            'is_approved' => true,
        ]);

        Comment::query()->create([
            'content' => 'Unapproved parent',
            'user_id' => $user->id,
            'resource_id' => $resource->id,
            'is_approved' => false,
        ]);

        Comment::query()->create([
            'content' => 'Approved reply',
            'user_id' => $user->id,
            'resource_id' => $resource->id,
            'parent_id' => $parentApproved->id,
            'is_approved' => true,
        ]);

        Comment::query()->create([
            'content' => 'Unapproved reply',
            'user_id' => $user->id,
            'resource_id' => $resource->id,
            'parent_id' => $parentApproved->id,
            'is_approved' => false,
        ]);

        $this->getJson('/api/resources/'.$resource->id.'/comments')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.content', 'Approved parent')
            ->assertJsonCount(1, '0.replies')
            ->assertJsonPath('0.replies.0.content', 'Approved reply');
    }

    public function test_citizen_can_create_comment(): void
    {
        [$resource] = $this->createResourceGraph();
        $citizen = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        Sanctum::actingAs($citizen);

        $this->postJson('/api/resources/'.$resource->id.'/comments', [
            'content' => 'This is my comment',
        ])
            ->assertCreated()
            ->assertJsonPath('content', 'This is my comment');

        $this->assertDatabaseHas('comments', [
            'resource_id' => $resource->id,
            'user_id' => $citizen->id,
            'content' => 'This is my comment',
        ]);
    }

    public function test_non_citizen_cannot_create_comment(): void
    {
        [$resource] = $this->createResourceGraph();
        $admin = User::factory()->create(['role' => Role::ADMIN, 'is_active' => true]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/resources/'.$resource->id.'/comments', [
            'content' => 'Blocked comment',
        ])->assertForbidden();
    }

    public function test_citizen_can_reply_to_comment(): void
    {
        [$resource] = $this->createResourceGraph();
        $citizen = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $parent = Comment::query()->create([
            'content' => 'Parent comment',
            'user_id' => $citizen->id,
            'resource_id' => $resource->id,
            'is_approved' => true,
        ]);

        Sanctum::actingAs($citizen);

        $this->postJson('/api/comments/'.$parent->id.'/reply', [
            'content' => 'Reply content',
        ])
            ->assertCreated()
            ->assertJsonPath('parent_id', $parent->id)
            ->assertJsonPath('resource_id', $resource->id);
    }

    public function test_favorite_add_and_remove_work(): void
    {
        [$resource] = $this->createResourceGraph();
        $user = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        Sanctum::actingAs($user);

        $this->postJson('/api/resources/'.$resource->id.'/favorite')
            ->assertStatus(201)
            ->assertJsonPath('favorite.resource_id', $resource->id);

        $this->assertDatabaseHas('favorites', [
            'user_id' => $user->id,
            'resource_id' => $resource->id,
        ]);

        $this->deleteJson('/api/resources/'.$resource->id.'/favorite')
            ->assertOk();

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $user->id,
            'resource_id' => $resource->id,
        ]);
    }

    public function test_progression_exploit_set_aside_and_dashboard_work(): void
    {
        [$resourceA, $resourceB] = $this->createResourceGraph(2);
        $user = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        Sanctum::actingAs($user);

        Favorite::query()->create([
            'user_id' => $user->id,
            'resource_id' => $resourceA->id,
        ]);

        $this->postJson('/api/resources/'.$resourceA->id.'/exploit')
            ->assertOk()
            ->assertJsonPath('progression.status', ProgressionStatus::EXPLOITED->value);

        $this->postJson('/api/resources/'.$resourceB->id.'/set-aside')
            ->assertOk()
            ->assertJsonPath('progression.status', ProgressionStatus::SET_ASIDE->value);

        $this->getJson('/api/progression')
            ->assertOk()
            ->assertJsonCount(1, 'favorites')
            ->assertJsonCount(1, 'exploited')
            ->assertJsonCount(1, 'set_aside');

        $this->assertDatabaseHas('progressions', [
            'user_id' => $user->id,
            'resource_id' => $resourceA->id,
            'status' => ProgressionStatus::EXPLOITED->value,
        ]);

        $this->assertDatabaseHas('progressions', [
            'user_id' => $user->id,
            'resource_id' => $resourceB->id,
            'status' => ProgressionStatus::SET_ASIDE->value,
        ]);
    }

    private function createResourceGraph(int $count = 1): array
    {
        $category = Category::query()->create(['name' => 'Category']);
        $relationType = RelationType::query()->create(['name' => 'Relation']);
        $resourceType = ResourceType::query()->create(['name' => 'Type']);
        $author = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $resources = [];

        for ($i = 1; $i <= $count; $i++) {
            $resources[] = Resource::query()->create([
                'title' => 'Resource '.$i,
                'content' => 'Resource '.$i.' content body.',
                'user_id' => $author->id,
                'category_id' => $category->id,
                'relation_type_id' => $relationType->id,
                'resource_type_id' => $resourceType->id,
                'status' => ResourceStatus::PUBLISHED->value,
                'is_public' => true,
            ]);
        }

        return $resources;
    }
}
