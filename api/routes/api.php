<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ModerationController;
use App\Http\Controllers\ProgressionController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SuperAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::delete('/user', [AuthController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/admin/ping', function () {
    return response()->json([
        'status' => 'admin-ok',
    ]);
})->middleware(['auth:sanctum', 'role:admin,super_admin']);

Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{id}', [ResourceController::class, 'show']);
Route::post('/resources', [ResourceController::class, 'store'])->middleware(['auth:sanctum']);
Route::put('/resources/{resource}', [ResourceController::class, 'update'])->middleware(['auth:sanctum']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/resources/{id}/comments', [CommentController::class, 'indexByResource']);
Route::post('/resources/{id}/comments', [CommentController::class, 'store'])->middleware(['auth:sanctum']);
Route::post('/comments/{id}/reply', [CommentController::class, 'reply'])->middleware(['auth:sanctum']);

Route::post('/resources/{id}/favorite', [FavoriteController::class, 'store'])->middleware(['auth:sanctum']);
Route::delete('/resources/{id}/favorite', [FavoriteController::class, 'destroy'])->middleware(['auth:sanctum']);

Route::post('/resources/{id}/exploit', [ProgressionController::class, 'exploit'])->middleware(['auth:sanctum']);
Route::post('/resources/{id}/set-aside', [ProgressionController::class, 'setAside'])->middleware(['auth:sanctum']);
Route::get('/progression', [ProgressionController::class, 'index'])->middleware(['auth:sanctum']);

Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin,super_admin'])->group(function () {
    Route::get('/statistics', [AdminController::class, 'statistics']);
    Route::get('/resources', [AdminController::class, 'indexResources']);
    Route::put('/resources/{resource}/suspend', [AdminController::class, 'suspendResource']);
});

Route::prefix('moderation')->middleware(['auth:sanctum', 'role:moderator,admin,super_admin'])->group(function () {
    Route::put('/resources/{resource}/validate', [ModerationController::class, 'validateResource']);
    Route::put('/comments/{comment}/approve', [ModerationController::class, 'approveComment']);
    Route::delete('/comments/{comment}', [ModerationController::class, 'deleteComment']);
});

Route::prefix('super-admin')->middleware(['auth:sanctum', 'role:super_admin'])->group(function () {
    Route::post('/users', [SuperAdminController::class, 'createPrivilegedUser']);
});