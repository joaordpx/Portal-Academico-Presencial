<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocalResource;
use App\Models\Local;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LocalController extends Controller
{
    /** Locais publicados; `?campus={slug}` filtra por campus */
    public function index(Request $request): AnonymousResourceCollection
    {
        $locais = Local::publicados()
            ->with(['campus', 'centro.cursos'])
            ->when($request->query('campus'), fn ($q, $slug) => $q->whereRelation('campus', 'slug', $slug))
            ->orderByRaw('numero is null')
            ->orderBy('numero')
            ->orderBy('nome')
            ->get();

        return LocalResource::collection($locais);
    }

    public function show(string $slug): LocalResource
    {
        $local = Local::publicados()
            ->with(['campus', 'centro.cursos'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new LocalResource($local);
    }
}
