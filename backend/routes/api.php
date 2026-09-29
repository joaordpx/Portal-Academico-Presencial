<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\AdminCourseController;
use App\Http\Controllers\CenterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\HealthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:web', 'can:health.read'])->group(function () {
    Route::get('health', HealthController::class);
});

Route::prefix('manual-do-calouro')->name('manual.')->group(function () {
});

Route::middleware('throttle:60,1')->group(function () {
    Route::get('search', [SearchController::class, 'index']);
    Route::get('search/suggest', [SearchController::class, 'suggest']);
});

Route::apiResource('courses', CourseController::class)->only([
    'index', 'show'
]);

Route::apiResource('subjects', SubjectController::class)->only([
    'index', 'show'
]);

Route::apiResource('centers', CenterController::class)->only([
    'index', 'show'
]);

Route::apiResource('departments', DepartmentController::class)->only([
    'index', 'show'
]);

Route::apiResource('documents', DocumentController::class)->only([
    'index', 'show'
]);
Route::get('documents/{id}/download', [DocumentController::class, 'download'])->name('documents.download');

Route::get('events', [EventController::class, 'index']);
Route::get('events/{event}', [EventController::class, 'show']);

Route::middleware(['auth:web', 'can:courses.manage'])->group(function () {
    Route::apiResource('courses', CourseController::class)->only([
        'store', 'update', 'destroy'
    ]);

    Route::get('admins/{user}/courses', [AdminCourseController::class, 'index']);
    Route::post('admins/{user}/courses/{course}', [AdminCourseController::class, 'store']);
    Route::delete('admins/{user}/courses/{course}', [AdminCourseController::class, 'destroy']);
});

Route::middleware(['auth:web', 'can:subjects.manage'])->group(function () {
    Route::apiResource('subjects', SubjectController::class)->only([
        'store', 'update', 'destroy'
    ]);
});

Route::middleware(['auth:web', 'can:centers.manage'])->group(function () {
    Route::apiResource('centers', CenterController::class)->only([
        'store', 'update', 'destroy'
    ]);
});

Route::middleware(['auth:web', 'can:departments.manage'])->group(function () {
    Route::apiResource('departments', DepartmentController::class)->only([
        'store', 'update', 'destroy'
    ]);
});

Route::middleware(['auth:web', 'can:documents.manage'])->group(function () {
    Route::apiResource('documents', DocumentController::class)->only([
        'store', 'destroy'
    ]);
});

Route::middleware(['auth:web', 'can:users.manage'])->group(function () {
    Route::apiResource('users', UserController::class);
});
