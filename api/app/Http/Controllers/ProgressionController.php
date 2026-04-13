<?php

namespace App\Http\Controllers;

use App\Enums\ProgressionStatus;
use App\Models\Favorite;
use App\Models\Progression;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressionController extends Controller
{
    public function exploit(Request $request, int $id): JsonResponse
    {
        return $this->updateProgressionStatus($request, $id, ProgressionStatus::EXPLOITED);
    }

    public function setAside(Request $request, int $id): JsonResponse
    {
        return $this->updateProgressionStatus($request, $id, ProgressionStatus::SET_ASIDE);
    }

    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::query()
            ->with('resource')
            ->where('user_id', $request->user()->id)
            ->get();

        $progressions = Progression::query()
            ->with('resource')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'favorites' => $favorites,
            'exploited' => $progressions->where('status', ProgressionStatus::EXPLOITED),
            'set_aside' => $progressions->where('status', ProgressionStatus::SET_ASIDE),
        ]);
    }

    private function updateProgressionStatus(Request $request, int $resourceId, ProgressionStatus $status): JsonResponse
    {
        Resource::query()->findOrFail($resourceId);

        $progression = Progression::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'resource_id' => $resourceId,
            ],
            [
                'status' => $status->value,
            ]
        );

        return response()->json([
            'message' => 'Progression status updated.',
            'progression' => $progression,
        ]);
    }
}