<?php

use App\Http\Controllers\Api\CampusController;
use App\Http\Controllers\Api\CursoController;
use App\Http\Controllers\Api\EditalController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\LocalController;
use Illuminate\Support\Facades\Route;

/*
 * API pública (somente leitura) consumida pelo frontend do portal.
 * Toda escrita acontece pelo painel administrativo (/admin).
 * Só registros publicados são expostos.
 */

Route::get('/status', fn () => ['status' => 'ok']);

Route::middleware('throttle:120,1')->group(function () {
    Route::get('/cursos', [CursoController::class, 'index']);
    Route::get('/cursos/{slug}', [CursoController::class, 'show']);

    Route::get('/campi', [CampusController::class, 'index']);

    Route::get('/locais', [LocalController::class, 'index']);
    Route::get('/locais/{slug}', [LocalController::class, 'show']);

    Route::get('/editais', [EditalController::class, 'index']);

    Route::get('/eventos', [EventoController::class, 'index']);
    Route::get('/eventos/{slug}', [EventoController::class, 'show']);
});
