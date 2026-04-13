<?php
 
namespace App\Http\Controllers;
 
use App\Enums\ResourceStatus;
use App\Models\Comment;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
 
class ModerationController extends Controller
{
    public function listResources(Request $request): JsonResponse
    {
        $query = Resource::query()->with(['user', 'category', 'relationType', 'resourceType']);
 
        $status = $request->query('status', ResourceStatus::PENDING->value);
        $query->where('status', $status);
 
        return response()->json($query->orderByDesc('created_at')->get());
    }
 
    public function listComments(Request $request): JsonResponse
    {
        $query = Comment::query()->with('user');
 
        if ($request->query('approved') === 'false') {
            $query->where('is_approved', false);
        }
 
        return response()->json($query->orderByDesc('created_at')->get());
    }
 
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