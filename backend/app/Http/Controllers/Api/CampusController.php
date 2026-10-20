<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CampusResource;
use App\Models\Campus;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CampusController extends Controller
{
    /** Todos os campi; o frontend separa o campus-sede (`sede: true`) dos demais */
    public function index(): AnonymousResourceCollection
    {
        $campi = Campus::with('ofertas.curso')
            ->orderByDesc('sede')
            ->orderBy('cidade')
            ->get();

        return CampusResource::collection($campi);
    }
}
