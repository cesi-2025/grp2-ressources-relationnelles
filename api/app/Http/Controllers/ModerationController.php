<?php

namespace App\Http\Controllers;

use App\Enums\ResourceStatus;
use App\Models\Comment;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;

class ModerationController extends Controller
{
    public function validateResource(Resource $resource): JsonResponse
    {
        $resource->update([
            'status' => ResourceStatus::PUBLISHED->value,
        ]);

        return response()->json([
            'message' => 'Resource validated successfully.',
            'resource' => $resource,
        ]);
    }
    public function indexComments(): JsonResponse
    {
        $comments = Comment::query()
            ->with(['user', 'resource'])
            ->where('is_approved', false)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($comments);
    }
    public function approveComment(Comment $comment): JsonResponse
    {
        $comment->update([
            'is_approved' => true,
        ]);

        return response()->json([
            'message' => 'Comment approved successfully.',
            'comment' => $comment,
        ]);
    }

    public function deleteComment(Comment $comment): JsonResponse
    {
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully.',
        ]);
    }
}
