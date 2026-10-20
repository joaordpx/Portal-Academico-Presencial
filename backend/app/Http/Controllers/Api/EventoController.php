<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventoResource;
use App\Models\Evento;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EventoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return EventoResource::collection(
            Evento::publicados()->orderBy('data')->get(),
        );
    }

    public function show(string $slug): EventoResource
    {
        return new EventoResource(
            Evento::publicados()->where('slug', $slug)->firstOrFail(),
        );
    }
}
