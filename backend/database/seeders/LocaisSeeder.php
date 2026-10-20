<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\Centro;
use App\Models\Local;
use Database\Seeders\Concerns\LeDadosJson;
use Illuminate\Database\Seeder;

class LocaisSeeder extends Seeder
{
    use LeDadosJson;

    public function run(): void
    {
        $sede = Campus::where('sede', true)->firstOrFail();
        $centros = Centro::pluck('id', 'sigla');

        foreach ($this->dados('locais') as $l) {
            Local::updateOrCreate(['slug' => $l['slug']], [
                'nome' => $l['nome'],
                'numero' => $l['numero'] ?? null,
                'tipo' => $l['tipo'],
                'campus_id' => $sede->id,
                'centro_id' => isset($l['centro']) ? $centros[$l['centro']['sigla']] : null,
                'descricao' => $l['descricao'],
                'setores' => $l['setores'],
                'servicos' => $l['servicos'],
                'localizacao' => $l['localizacao'] ?? null,
                'telefone' => $l['contato']['telefone'] ?? null,
                'email' => $l['contato']['email'] ?? null,
                'horarios' => $l['horarios'],
                'svg_id' => $l['svgId'] ?? null,
                'acessibilidade' => $l['acessibilidade'] ?? null,
            ]);
        }
    }
}
