<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        Resource::query()->findOrFail($id);

        $favorite = Favorite::query()->firstOrCreate([
            'user_id' => $request->user()->id,
            'resource_id' => $id,
        ]);

        return response()->json([
            'message' => 'Resource added to favorites.',
            'favorite' => $favorite,
        ], $favorite->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        Resource::query()->findOrFail($id);

        Favorite::query()
            ->where('user_id', $request->user()->id)
            ->where('resource_id', $id)
            ->delete();

        return response()->json([
            'message' => 'Resource removed from favorites.',
        ]);
    }
}
