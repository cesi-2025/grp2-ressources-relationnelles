<?php

namespace App\Http\Controllers;

use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Resource;
use App\Models\ResourceView;
use App\Models\SearchLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $categoryId = $request->query('category');
        $relationTypeId = $request->query('relation_type');
        $resourceTypeId = $request->query('resource_type');
        $searchQuery = $request->query('q');

        $resources = Resource::query()
            ->with(['user', 'category', 'relationType', 'resourceType'])
            ->where('status', ResourceStatus::PUBLISHED->value)
            ->where(function ($query) use ($user) {
                $query->where('is_public', true);

                if ($user) {
                    $query->orWhere('user_id', $user->id);
                }
            })
            ->when($categoryId, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($relationTypeId, function ($query, $relationTypeId) {
                $query->where('relation_type_id', $relationTypeId);
            })
            ->when($resourceTypeId, function ($query, $resourceTypeId) {
                $query->where('resource_type_id', $resourceTypeId);
            })
            ->when($searchQuery, function ($query, $searchQuery) {
                $query->where(function ($sub) use ($searchQuery) {
                    $sub->where('title', 'like', '%'.$searchQuery.'%')
                        ->orWhere('content', 'like', '%'.$searchQuery.'%');
                });
            });

        $sort = $request->query('sort', 'date');

        if ($sort === 'title') {
            $resources->orderBy('title');
        } else {
            $resources->orderByDesc('created_at');
        }

        if ($searchQuery || $categoryId || $relationTypeId || $resourceTypeId) {
            SearchLog::query()->create([
                'user_id' => $user?->id,
                'query' => $searchQuery ? (string) $searchQuery : null,
                'category_id' => $categoryId ? (int) $categoryId : null,
                'relation_type_id' => $relationTypeId ? (int) $relationTypeId : null,
                'resource_type_id' => $resourceTypeId ? (int) $resourceTypeId : null,
            ]);
        }

        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min(60, $perPage));

        return response()->json($resources->paginate($perPage)->withQueryString());
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $resource = Resource::query()
            ->with(['user', 'category', 'relationType', 'resourceType'])
            ->where('status', ResourceStatus::PUBLISHED->value)
            ->where(function ($query) use ($user) {
                $query->where('is_public', true);

                if ($user) {
                    $query->orWhere('user_id', $user->id);
                }
            })
            ->findOrFail($id);

        ResourceView::query()->create([
            'resource_id' => $resource->id,
            'user_id' => $user?->id,
        ]);

        return response()->json($resource);
    }

    public function share(int $id): JsonResponse
    {
        $resource = Resource::query()
            ->where('status', ResourceStatus::PUBLISHED->value)
            ->where('is_public', true)
            ->findOrFail($id);

        $frontUrl = rtrim((string) config('app.front_url', env('FRONT_URL', '')), '/');
        $path = '/ressources/'.$resource->id;

        return response()->json([
            'id' => $resource->id,
            'title' => $resource->title,
            'url' => $frontUrl !== '' ? $frontUrl.$path : $path,
        ]);
    }

    public function store(StoreResourceRequest $request): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $resource = Resource::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'status' => ResourceStatus::PENDING->value,
            'is_public' => $request->boolean('is_public', true),
        ]);

        $resource->load(['user', 'category', 'relationType', 'resourceType']);

        return response()->json($resource, 201);
    }

    public function update(UpdateResourceRequest $request, Resource $resource): JsonResponse
    {
        $this->authorize('update', $resource);

        $resource->update([
            ...$request->validated(),
            'is_public' => $request->boolean('is_public', true),
        ]);

        $resource->load(['user', 'category', 'relationType', 'resourceType']);

        return response()->json($resource);
    }
}