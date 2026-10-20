<?php

namespace Database\Seeders;

use App\Models\Edital;
use Database\Seeders\Concerns\LeDadosJson;
use Illuminate\Database\Seeder;

class EditaisSeeder extends Seeder
{
    use LeDadosJson;

    public function run(): void
    {
        foreach ($this->dados('editais') as $e) {
            Edital::updateOrCreate(['titulo' => $e['titulo']], [
                'tipo' => $e['tipo'],
                'publico' => $e['curso'],
                'campus' => $e['campus'],
                'prazo' => $e['prazo'],
                'url' => $e['url'] ?? null,
            ]);
        }
    }
}
