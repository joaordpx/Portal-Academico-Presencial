<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api-playground', function () {
    return view('api-playground');
});

Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

Route::get('/home', function () {
    return view('home');
})->middleware('auth')->name('home');

// Rotas autenticadas para telas funcionais
Route::middleware('auth')->group(function () {
    Route::get('/courses', [PageController::class, 'coursesIndex'])->name('courses.list');
    Route::get('/courses/{id}', [PageController::class, 'coursesShow'])->name('courses.detail');
    Route::get('/subjects', [PageController::class, 'subjectsIndex'])->name('subjects.list');
    Route::get('/documents', [PageController::class, 'documentsIndex'])->name('documents.list');
});

// Rotas admin com role-based access
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/courses', [PageController::class, 'adminCourses'])->name('admin.courses');
});

Route::middleware(['auth', 'role:admin|suporte'])->group(function () {
    Route::get('/admin/support', [PageController::class, 'adminSupport'])->name('admin.support');
});

Route::middleware(['auth', 'role:suporte'])->group(function () {
    Route::get('/admin/users', [PageController::class, 'adminUsers'])->name('admin.users');
});
