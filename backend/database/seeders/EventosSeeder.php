<?php

namespace Database\Seeders;

use App\Models\Evento;
use Database\Seeders\Concerns\LeDadosJson;
use Illuminate\Database\Seeder;

class EventosSeeder extends Seeder
{
    use LeDadosJson;

    public function run(): void
    {
        foreach ($this->dados('eventos') as $e) {
            Evento::updateOrCreate(['slug' => $e['slug']], [
                'titulo' => $e['titulo'],
                'descricao' => $e['descricao'],
                'conteudo' => isset($e['conteudo']) ? implode("\n\n", $e['conteudo']) : null,
                'tipo' => $e['tipo'],
                'data' => $e['data'],
                'data_fim' => $e['dataFim'] ?? null,
                'horario' => $e['horario'] ?? null,
                'local' => $e['local'] ?? null,
                'campus' => $e['campus'] ?? null,
                'imagem' => $e['imagem'] ?? null,
                'origem' => 'manual',
                'organizador' => $e['organizador'] ?? null,
                'link_oficial' => $e['linkOficial'] ?? null,
                'inscricoes_abertas' => $e['inscricoesAbertas'] ?? false,
            ]);
        }
    }
}
