<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EditalResource;
use App\Models\Edital;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EditalController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return EditalResource::collection(
            Edital::publicados()->orderByDesc('prazo')->get(),
        );
    }
}
