<?php

namespace App\Http\Controllers\Api;

use App\Enums\TipoResultadoBusca;
use App\Http\Controllers\Controller;
use App\Models\Busca;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Recebe as buscas feitas no portal para as estatísticas do painel.
 * Único endpoint público de escrita: não guarda IP nem nada que identifique
 * quem buscou, e responde 204 mesmo quando descarta o termo.
 */
class BuscaController extends Controller
{
    public function store(Request $request): Response
    {
        $dados = $request->validate([
            'termo' => ['required', 'string', 'min:2', 'max:200'],
            'resultados' => ['required', 'integer', 'min:0', 'max:1000'],
            'tipoClicado' => ['nullable', Rule::enum(TipoResultadoBusca::class), 'required_with:posicao'],
            'posicao' => ['nullable', 'integer', 'min:1', 'max:255', 'required_with:tipoClicado'],
        ]);

        $termo = Busca::normalizarTermo($dados['termo']);

        if (mb_strlen($termo) >= 2 && ! Busca::pareceDadoPessoal($dados['termo'])) {
            Busca::create([
                'termo' => $termo,
                'resultados' => $dados['resultados'],
                'tipo_clicado' => $dados['tipoClicado'] ?? null,
                'posicao_clicada' => $dados['posicao'] ?? null,
            ]);
        }

        return response()->noContent();
    }
}
