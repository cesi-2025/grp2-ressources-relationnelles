<?php

namespace App\Http\Controllers;

use App\Enums\ProgressionStatus;
use App\Enums\ResourceStatus;
use App\Enums\Role;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Progression;
use App\Models\Resource;
use App\Models\ResourceView;
use App\Models\SearchLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    /**
     * Build the base queries applying every supported statistics filter.
     *
     * @return array<string, \Illuminate\Database\Eloquent\Builder>
     */
    private function buildStatisticsQueries(Request $request): array
    {
        $categoryId = $request->query('category');
        $relationTypeId = $request->query('relation_type');
        $resourceTypeId = $request->query('resource_type');
        $period = $request->query('period', 'all');

        $applyResourceFilters = function ($query, bool $direct = true) use ($categoryId, $relationTypeId, $resourceTypeId) {
            if ($direct) {
                if ($categoryId) {
                    $query->where('category_id', $categoryId);
                }
                if ($relationTypeId) {
                    $query->where('relation_type_id', $relationTypeId);
                }
                if ($resourceTypeId) {
                    $query->where('resource_type_id', $resourceTypeId);
                }
            } else {
                $query->whereHas('resource', function ($sub) use ($categoryId, $relationTypeId, $resourceTypeId) {
                    if ($categoryId) {
                        $sub->where('category_id', $categoryId);
                    }
                    if ($relationTypeId) {
                        $sub->where('relation_type_id', $relationTypeId);
                    }
                    if ($resourceTypeId) {
                        $sub->where('resource_type_id', $resourceTypeId);
                    }
                });
            }
        };

        $resourcesQuery = Resource::query();
        $progressionQuery = Progression::query()->where('status', ProgressionStatus::EXPLOITED->value);
        $favoritesQuery = Favorite::query();
        $commentsQuery = Comment::query();
        $viewsQuery = ResourceView::query();
        $searchesQuery = SearchLog::query();

        $applyResourceFilters($resourcesQuery, true);
        $applyResourceFilters($progressionQuery, false);
        $applyResourceFilters($favoritesQuery, false);
        $applyResourceFilters($commentsQuery, false);
        $applyResourceFilters($viewsQuery, false);

        if ($categoryId) {
            $searchesQuery->where('category_id', $categoryId);
        }
        if ($relationTypeId) {
            $searchesQuery->where('relation_type_id', $relationTypeId);
        }
        if ($resourceTypeId) {
            $searchesQuery->where('resource_type_id', $resourceTypeId);
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
                $viewsQuery->where('created_at', '>=', $since);
                $searchesQuery->where('created_at', '>=', $since);
            }
        }

        return compact(
            'resourcesQuery',
            'progressionQuery',
            'favoritesQuery',
            'commentsQuery',
            'viewsQuery',
            'searchesQuery'
        );
    }

    public function statistics(Request $request): JsonResponse
    {
        $queries = $this->buildStatisticsQueries($request);

        return response()->json([
            'filters' => [
                'period' => $request->query('period', 'all'),
                'category' => $request->query('category') ? (int) $request->query('category') : null,
                'relation_type' => $request->query('relation_type') ? (int) $request->query('relation_type') : null,
                'resource_type' => $request->query('resource_type') ? (int) $request->query('resource_type') : null,
            ],
            'statistics' => [
                'consultations' => $queries['viewsQuery']->count(),
                'recherches' => $queries['searchesQuery']->count(),
                'exploitations' => $queries['progressionQuery']->count(),
                'creations' => $queries['resourcesQuery']->count(),
                'favoris' => $queries['favoritesQuery']->count(),
                'commentaires' => $queries['commentsQuery']->count(),
                'resources_pending' => (clone $queries['resourcesQuery'])->where('status', ResourceStatus::PENDING->value)->count(),
                'resources_published' => (clone $queries['resourcesQuery'])->where('status', ResourceStatus::PUBLISHED->value)->count(),
            ],
        ]);
    }

    public function exportStatistics(Request $request): StreamedResponse
    {
        $queries = $this->buildStatisticsQueries($request);

        $rows = [
            ['indicateur', 'valeur'],
            ['consultations', $queries['viewsQuery']->count()],
            ['recherches', $queries['searchesQuery']->count()],
            ['exploitations', $queries['progressionQuery']->count()],
            ['creations', $queries['resourcesQuery']->count()],
            ['favoris', $queries['favoritesQuery']->count()],
            ['commentaires', $queries['commentsQuery']->count()],
            ['resources_pending', (clone $queries['resourcesQuery'])->where('status', ResourceStatus::PENDING->value)->count()],
            ['resources_published', (clone $queries['resourcesQuery'])->where('status', ResourceStatus::PUBLISHED->value)->count()],
        ];

        $filename = 'statistiques-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'wb');
            foreach ($rows as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function listResources(Request $request): JsonResponse
    {
        $query = Resource::query()->with(['user', 'category', 'relationType', 'resourceType']);

        if ($request->query('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->query('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        return response()->json($query->orderByDesc('created_at')->paginate(50)->withQueryString());
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

    public function destroyResource(Resource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json([
            'message' => 'Resource deleted successfully.',
        ]);
    }

    public function listCitizens(Request $request): JsonResponse
    {
        $query = User::query()->where('role', Role::CITIZEN->value)->orderByDesc('created_at');

        return response()->json($query->get());
    }

    public function toggleCitizen(User $user): JsonResponse
    {
        $role = $user->role instanceof Role ? $user->role->value : (string) $user->role;

        if ($role !== Role::CITIZEN->value) {
            return response()->json([
                'message' => 'Only citizen accounts can be toggled from this endpoint.',
            ], 403);
        }

        $user->update(['is_active' => ! $user->is_active]);

        return response()->json([
            'message' => 'User status updated.',
            'user' => $user,
        ]);
    }
}