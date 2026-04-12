<?php

namespace App\Http\Controllers;

use App\Enums\ProgressionStatus;
use App\Enums\ResourceStatus;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Progression;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function statistics(Request $request): JsonResponse
    {
        $period = $request->query('period', 'all');
        $categoryId = $request->query('category');

        $resourcesQuery = Resource::query();
        $progressionQuery = Progression::query()->where('status', ProgressionStatus::EXPLOITED->value);
        $favoritesQuery = Favorite::query();
        $commentsQuery = Comment::query();

        if ($categoryId) {
            $resourcesQuery->where('category_id', $categoryId);
            $progressionQuery->whereHas('resource', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            });
            $favoritesQuery->whereHas('resource', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            });
            $commentsQuery->whereHas('resource', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            });
        }

        if ($period !== 'all') {
            $since = match ($period) {
                'day' => now()->subDay(),
                'week' => now()->subWeek(),
                'month' => now()->subMonth(),
                default => null,
            };

            if ($since) {
                $resourcesQuery->where('created_at', '>=', $since);
                $progressionQuery->where('created_at', '>=', $since);
                $favoritesQuery->where('created_at', '>=', $since);
                $commentsQuery->where('created_at', '>=', $since);
            }
        }

        return response()->json([
            'filters' => [
                'period' => $period,
                'category' => $categoryId ? (int) $categoryId : null,
            ],
            'statistics' => [
                'consultations' => 0,
                'recherches' => 0,
                'exploitations' => $progressionQuery->count(),
                'creations' => $resourcesQuery->count(),
                'favoris' => $favoritesQuery->count(),
                'commentaires' => $commentsQuery->count(),
                'resources_pending' => (clone $resourcesQuery)->where('status', ResourceStatus::PENDING->value)->count(),
                'resources_published' => (clone $resourcesQuery)->where('status', ResourceStatus::PUBLISHED->value)->count(),
            ],
        ]);
    }

    public function suspendResource(Resource $resource): JsonResponse
    {
        $resource->update([
            'status' => ResourceStatus::ARCHIVED->value,
        ]);

        return response()->json([
            'message' => 'Resource suspended successfully.',
            'resource' => $resource,
        ]);
    }
}