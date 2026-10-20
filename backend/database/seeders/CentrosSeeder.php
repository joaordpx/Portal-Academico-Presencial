<?php

namespace Database\Seeders;

use App\Models\Centro;
use Illuminate\Database\Seeder;

class CentrosSeeder extends Seeder
{
    public function run(): void
    {
        $centros = [
            'CCBS' => 'Centro de Ciências Biológicas e da Saúde',
            'CCET' => 'Centro de Ciências Exatas e Tecnológicas',
            'CCH' => 'Centro de Ciências Humanas',
            'CCSA' => 'Centro de Ciências Sociais Aplicadas',
        ];

        foreach ($centros as $sigla => $nome) {
            Centro::updateOrCreate(['sigla' => $sigla], ['nome' => $nome]);
        }
    }
}
