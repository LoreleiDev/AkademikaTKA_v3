<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\IklanController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\MateriDisplayController;
use App\Http\Controllers\Api\PasswordResetController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Password Reset Routes
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetCode']);
    Route::post('/verify-reset-code', [PasswordResetController::class, 'verifyResetCode']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

Route::get('/news', [NewsController::class, 'publicIndex']);
Route::get('/iklan', [IklanController::class, 'publicIndex']);
// Public university stats
use App\Http\Controllers\Api\AdminUniversityStatController;
Route::get('/university-stats', [AdminUniversityStatController::class, 'publicIndex']);
Route::get('/materi/display/mapels', [MateriDisplayController::class, 'getAllMapelsWithMateri']);
Route::get('/materi/display/mapel/{id}', [MateriDisplayController::class, 'getMapelDetail']);
Route::get('/materi/display/materi/{id}', [MateriDisplayController::class, 'getMateriDetail']);
Route::get('/materi/display/mapel/{mapelId}/materi', [MateriDisplayController::class, 'getMateriByMapel']);
Route::get('/materi/display/materi', [MateriDisplayController::class, 'getAllMateri']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

    Route::get('/news', [NewsController::class, 'index']);
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

    Route::get('/iklan', [IklanController::class, 'index']);
    Route::post('/iklan', [IklanController::class, 'store']);
    Route::put('/iklan/{id}', [IklanController::class, 'update']);
    Route::delete('/iklan/{id}', [IklanController::class, 'destroy']);

    // Materi & Mapel
    Route::get('/materials', [MateriController::class, 'index']);
    Route::post('/materials/mapel', [MateriController::class, 'storeMapel']);
    Route::put('/materials/mapel/{id}', [MateriController::class, 'updateMapel']);
    Route::post('/materials/materi', [MateriController::class, 'storeMateri']);
    Route::put('/materials/materi/{id}', [MateriController::class, 'updateMateri']);
    Route::delete('/materials/materi/{id}', [MateriController::class, 'destroyMateri']);
    Route::delete('/materials/mapel/{id}', [MateriController::class, 'destroyMapel']);
    Route::post('/materials/mapel/{id}/home-image', [MateriController::class, 'uploadHomeImage']);
    // University stats management
    Route::get('/university-stats', [AdminUniversityStatController::class, 'index']);
    Route::post('/university-stats', [AdminUniversityStatController::class, 'store']);
    Route::put('/university-stats/{id}', [AdminUniversityStatController::class, 'update']);
    Route::delete('/university-stats/{id}', [AdminUniversityStatController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/getuser', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
});