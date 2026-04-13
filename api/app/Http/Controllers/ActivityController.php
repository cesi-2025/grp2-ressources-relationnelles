<?php

namespace App\Http\Controllers;

use App\Models\ActivitySession;
use App\Models\ActivitySessionMessage;
use App\Models\ActivitySessionParticipant;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function start(Request $request, Resource $resource): JsonResponse
    {
        $user = $request->user();

        $session = ActivitySession::query()->create([
            'resource_id' => $resource->id,
            'owner_id' => $user->id,
            'started_at' => now(),
        ]);

        ActivitySessionParticipant::query()->create([
            'activity_session_id' => $session->id,
            'user_id' => $user->id,
        ]);

        $session->load(['owner', 'participants.user', 'resource']);

        return response()->json([
            'message' => 'Session started.',
            'session' => $session,
        ], 201);
    }

    public function show(Request $request, ActivitySession $session): JsonResponse
    {
        $this->authorizeParticipant($request, $session);
        $session->load(['owner', 'participants.user', 'resource']);

        return response()->json($session);
    }

    public function invite(Request $request, ActivitySession $session): JsonResponse
    {
        $this->authorizeOwner($request, $session);

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $participant = ActivitySessionParticipant::query()->firstOrCreate([
            'activity_session_id' => $session->id,
            'user_id' => $validated['user_id'],
        ]);

        $participant->load('user');

        return response()->json([
            'message' => 'Participant invited.',
            'participant' => $participant,
        ], $participant->wasRecentlyCreated ? 201 : 200);
    }

    public function messages(Request $request, ActivitySession $session): JsonResponse
    {
        $this->authorizeParticipant($request, $session);

        $messages = ActivitySessionMessage::query()
            ->with('user')
            ->where('activity_session_id', $session->id)
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function postMessage(Request $request, ActivitySession $session): JsonResponse
    {
        $this->authorizeParticipant($request, $session);

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:1', 'max:2000'],
        ]);

        $message = ActivitySessionMessage::query()->create([
            'activity_session_id' => $session->id,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        $message->load('user');

        return response()->json($message, 201);
    }

    private function authorizeParticipant(Request $request, ActivitySession $session): void
    {
        $userId = $request->user()->id;
        $isOwner = $session->owner_id === $userId;
        $isParticipant = $session->participants()->where('user_id', $userId)->exists();

        if (! $isOwner && ! $isParticipant) {
            abort(403, 'You are not a participant of this session.');
        }
    }

    private function authorizeOwner(Request $request, ActivitySession $session): void
    {
        if ($session->owner_id !== $request->user()->id) {
            abort(403, 'Only the session owner can perform this action.');
        }
    }
}
