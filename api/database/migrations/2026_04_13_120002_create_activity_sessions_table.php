<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('started_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('activity_session_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['activity_session_id', 'user_id']);
        });

        Schema::create('activity_session_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->timestamps();

            $table->index(['activity_session_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_session_messages');
        Schema::dropIfExists('activity_session_participants');
        Schema::dropIfExists('activity_sessions');
    }
};
