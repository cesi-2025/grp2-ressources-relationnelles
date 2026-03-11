<?php

namespace Tests\Feature\Resource;

use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Models\Category;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResourceEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_published_public_resources_with_filters(): void
    {
        $categoryA = Category::query()->create(['name' => 'Cat A']);
        $categoryB = Category::query()->create(['name' => 'Cat B']);

        $relationA = RelationType::query()->create(['name' => 'Relation A']);
        $relationB = RelationType::query()->create(['name' => 'Relation B']);

        $typeA = ResourceType::query()->create(['name' => 'Type A']);
        $typeB = ResourceType::query()->create(['name' => 'Type B']);

        $author = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $visible = Resource::query()->create([
            'title' => 'Visible Resource',
            'content' => 'Visible resource content body.',
            'user_id' => $author->id,
            'category_id' => $categoryA->id,
            'relation_type_id' => $relationA->id,
            'resource_type_id' => $typeA->id,
            'status' => ResourceStatus::PUBLISHED->value,
            'is_public' => true,
        ]);

        Resource::query()->create([
            'title' => 'Hidden Resource',
            'content' => 'Hidden resource content body.',
            'user_id' => $author->id,
            'category_id' => $categoryB->id,
            'relation_type_id' => $relationB->id,
            'resource_type_id' => $typeB->id,
            'status' => ResourceStatus::PUBLISHED->value,
            'is_public' => false,
        ]);

        Resource::query()->create([
            'title' => 'Pending Resource',
            'content' => 'Pending resource content body.',
            'user_id' => $author->id,
            'category_id' => $categoryA->id,
            'relation_type_id' => $relationA->id,
            'resource_type_id' => $typeA->id,
            'status' => ResourceStatus::PENDING->value,
            'is_public' => true,
        ]);

        $response = $this->getJson('/api/resources?category='.$categoryA->id.'&relation_type='.$relationA->id.'&resource_type='.$typeA->id.'&sort=date');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $visible->id)
            ->assertJsonStructure([
                'current_page',
                'data',
                'per_page',
                'total',
            ]);
    }

    public function test_show_returns_resource_detail_for_public_published_resource(): void
    {
        $category = Category::query()->create(['name' => 'Category']);
        $relationType = RelationType::query()->create(['name' => 'Relation']);
        $resourceType = ResourceType::query()->create(['name' => 'Type']);
        $author = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $resource = Resource::query()->create([
            'title' => 'Resource Detail',
            'content' => 'Resource detail content.',
            'user_id' => $author->id,
            'category_id' => $category->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'status' => ResourceStatus::PUBLISHED->value,
            'is_public' => true,
        ]);

        $this->getJson('/api/resources/'.$resource->id)
            ->assertOk()
            ->assertJsonPath('id', $resource->id)
            ->assertJsonPath('title', 'Resource Detail');
    }

    public function test_store_creates_pending_resource_for_authenticated_citizen(): void
    {
        $category = Category::query()->create(['name' => 'Category']);
        $relationType = RelationType::query()->create(['name' => 'Relation']);
        $resourceType = ResourceType::query()->create(['name' => 'Type']);

        $user = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/resources', [
            'title' => 'New Resource',
            'content' => 'New resource content with enough length.',
            'category_id' => $category->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'is_public' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('title', 'New Resource')
            ->assertJsonPath('status', ResourceStatus::PENDING->value)
            ->assertJsonPath('user_id', $user->id);

        $this->assertDatabaseHas('resources', [
            'title' => 'New Resource',
            'status' => ResourceStatus::PENDING->value,
            'user_id' => $user->id,
        ]);
    }

    public function test_update_allows_author_and_blocks_non_author(): void
    {
        $category = Category::query()->create(['name' => 'Category']);
        $relationType = RelationType::query()->create(['name' => 'Relation']);
        $resourceType = ResourceType::query()->create(['name' => 'Type']);

        $author = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);
        $otherUser = User::factory()->create(['role' => Role::CITIZEN, 'is_active' => true]);

        $resource = Resource::query()->create([
            'title' => 'Initial Title',
            'content' => 'Initial content body for resource.',
            'user_id' => $author->id,
            'category_id' => $category->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'status' => ResourceStatus::PENDING->value,
            'is_public' => true,
        ]);

        Sanctum::actingAs($otherUser);
        $this->putJson('/api/resources/'.$resource->id, [
            'title' => 'Blocked Update',
            'content' => 'Blocked update content body.',
            'category_id' => $category->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'is_public' => true,
        ])->assertForbidden();

        Sanctum::actingAs($author);
        $this->putJson('/api/resources/'.$resource->id, [
            'title' => 'Updated Title',
            'content' => 'Updated content body for resource.',
            'category_id' => $category->id,
            'relation_type_id' => $relationType->id,
            'resource_type_id' => $resourceType->id,
            'is_public' => false,
        ])
            ->assertOk()
            ->assertJsonPath('title', 'Updated Title')
            ->assertJsonPath('is_public', false);

        $this->assertDatabaseHas('resources', [
            'id' => $resource->id,
            'title' => 'Updated Title',
            'is_public' => false,
        ]);
    }

    public function test_categories_endpoint_returns_list(): void
    {
        Category::query()->create(['name' => 'Category B']);
        Category::query()->create(['name' => 'Category A']);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.name', 'Category A')
            ->assertJsonPath('1.name', 'Category B');
    }
}
