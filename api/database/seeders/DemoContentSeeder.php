<?php

namespace Database\Seeders;

use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Models\Category;
use App\Models\Comment;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::query()->orderBy('id')->get();
        $relationTypes = RelationType::query()->orderBy('id')->get();
        $resourceTypes = ResourceType::query()->orderBy('id')->get();

        if ($categories->isEmpty() || $relationTypes->isEmpty() || $resourceTypes->isEmpty()) {
            return;
        }

        $authors = User::query()
            ->whereIn('role', [Role::CITIZEN->value, Role::MODERATOR->value, Role::ADMIN->value])
            ->orderBy('id')
            ->get();

        if ($authors->isEmpty()) {
            return;
        }

        $resources = collect();

        for ($index = 1; $index <= 20; $index++) {
            $author = $authors[($index - 1) % $authors->count()];
            $category = $categories[($index - 1) % $categories->count()];
            $relationType = $relationTypes[($index - 1) % $relationTypes->count()];
            $resourceType = $resourceTypes[($index - 1) % $resourceTypes->count()];

            $status = match (true) {
                $index % 7 === 0 => ResourceStatus::ARCHIVED->value,
                $index % 5 === 0 => ResourceStatus::PENDING->value,
                default => ResourceStatus::PUBLISHED->value,
            };

            $resource = Resource::query()->updateOrCreate(
                ['title' => sprintf('Demo Resource %02d', $index)],
                [
                    'content' => 'Contenu de démonstration pour la ressource '.sprintf('%02d', $index).'. Ce texte sert aux tests QA.',
                    'user_id' => $author->id,
                    'category_id' => $category->id,
                    'relation_type_id' => $relationType->id,
                    'resource_type_id' => $resourceType->id,
                    'status' => $status,
                    'is_public' => $status === ResourceStatus::PUBLISHED->value,
                ]
            );

            $resources->push($resource);
        }

        $commentAuthors = User::query()
            ->whereIn('role', [Role::CITIZEN->value, Role::MODERATOR->value])
            ->orderBy('id')
            ->get();

        if ($commentAuthors->isEmpty()) {
            return;
        }

        $parentComments = [];

        for ($index = 1; $index <= 15; $index++) {
            $resource = $resources[($index - 1) % $resources->count()];
            $author = $commentAuthors[($index - 1) % $commentAuthors->count()];

            $parentId = null;

            if ($index % 5 === 0 && $parentComments !== []) {
                $parentId = $parentComments[array_key_last($parentComments)];
            }

            $comment = Comment::query()->updateOrCreate(
                [
                    'resource_id' => $resource->id,
                    'user_id' => $author->id,
                    'content' => 'Commentaire démo '.sprintf('%02d', $index),
                ],
                [
                    'parent_id' => $parentId,
                    'is_approved' => $index % 3 !== 0,
                ]
            );

            if ($parentId === null) {
                $parentComments[] = $comment->id;
            }
        }
    }
}
