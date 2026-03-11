<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');

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
