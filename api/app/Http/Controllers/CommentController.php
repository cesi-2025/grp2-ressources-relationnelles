<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function indexByResource(int $id): JsonResponse
    {
        Resource::query()->findOrFail($id);

        $comments = Comment::query()
            ->with([
                'user',
                'replies' => function ($query) {
                    $query->where('is_approved', true)
                        ->with('user')
                        ->orderBy('created_at');
                },
            ])
            ->where('resource_id', $id)
            ->whereNull('parent_id')
            ->where('is_approved', true)
            ->orderBy('created_at')
            ->get();

        return response()->json($comments);
    }

    public function store(CommentRequest $request, int $id): JsonResponse
    {
        $resource = Resource::query()->findOrFail($id);

        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $comment = Comment::query()->create([
            'content' => $request->string('content')->toString(),
            'user_id' => $request->user()->id,
            'resource_id' => $resource->id,
            'parent_id' => null,
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }

    public function reply(CommentRequest $request, int $id): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $parentComment = Comment::query()->findOrFail($id);

        $comment = Comment::query()->create([
            'content' => $request->string('content')->toString(),
            'user_id' => $request->user()->id,
            'resource_id' => $parentComment->resource_id,
            'parent_id' => $parentComment->id,
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }
}