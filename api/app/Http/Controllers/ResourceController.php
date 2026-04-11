<?php

namespace App\Http\Controllers;

use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Js;

class ResourceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $resources = Resource::query()
            ->with(['user', 'category', 'relationType', 'resourceType'])
            ->where('is_public', true)
            ->where('status', ResourceStatus::PUBLISHED->value)
            ->when($request->query('category'), function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->query('relation_type'), function ($query, $relationTypeId) {
                $query->where('relation_type_id', $relationTypeId);
            })
            ->when($request->query('resource_type'), function ($query, $resourceTypeId) {
                $query->where('resource_type_id', $resourceTypeId);
            });

        $sort = $request->query('sort', 'date');

        if ($sort === 'title') {
            $resources->orderBy('title');
        } else {
            $resources->orderByDesc('created_at');
        }

        return response()->json($resources->paginate(15)->withQueryString());
    }
    
    public function show(int $id): JsonResponse
    {
        $resource = Resource::query()
            ->with(['user', 'category', 'relationType', 'resourceType'])
            ->where('is_public', true)
            ->where('status', ResourceStatus::PUBLISHED->value)
            ->findOrFail($id);

        return response()->json($resource);
    }


    public function store(StoreResourceRequest $request): JsonResponse
    {
        if (!$request->user()) {
        return response()->json(['message' => 'Unauthorized.'], 401);
    }

    if (!in_array($request->user()->role, [
        Role::CITIZEN,
        Role::ADMIN,
        Role::SUPER_ADMIN,
        Role::MODERATOR,
    ])) {
        return response()->json(['message' => 'Forbidden.'], 403);
    }

    $resource = Resource::query()->create([
        ...$request->validated(),
        'user_id'   => $request->user()->id,
        'status'    => ResourceStatus::PENDING->value,
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
    
    public function destroy(Resource $resource): JsonResponse
    {
        $resource->delete();
        return response()->json(['message' => 'Ressources supprimée.']);
    }
}
