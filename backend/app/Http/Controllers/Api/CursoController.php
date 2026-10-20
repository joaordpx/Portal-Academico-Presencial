<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CursoResource;
use App\Http\Resources\CursoResumoResource;
use App\Models\Curso;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CursoController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $cursos = Curso::publicados()
            ->with(['centro', 'ofertas.campus'])
            ->orderBy('nome')
            ->get();

        return CursoResumoResource::collection($cursos);
    }

    public function show(string $slug): CursoResource
    {
        $curso = Curso::publicados()
            ->with(['centro', 'ofertas.campus'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new CursoResource($curso);
    }
}
