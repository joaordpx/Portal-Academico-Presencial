<?php

namespace Database\Seeders;

use App\Models\Campus;
use Database\Seeders\Concerns\LeDadosJson;
use Illuminate\Database\Seeder;

class CampiSeeder extends Seeder
{
    use LeDadosJson;

    public function run(): void
    {
        Campus::updateOrCreate(['slug' => 'montes-claros'], [
            'nome' => 'Campus Montes Claros',
            'cidade' => 'Montes Claros',
            'regiao' => 'Norte de Minas',
            'sede' => true,
            'endereco' => 'Campus Universitário Professor Darcy Ribeiro — Av. Rui Braga, s/nº, Vila Mauricéia, Montes Claros/MG · CEP 39401-089',
            'telefone' => '(38) 3229-8000',
            'email' => 'falecom@unimontes.br',
            'horarios' => [
                ['rotulo' => 'Funcionamento', 'horas' => '08h às 18h'],
                ['rotulo' => 'Atendimento ao público', 'horas' => '08h às 17h'],
            ],
        ]);

        foreach ($this->dados('unidades') as $u) {
            Campus::updateOrCreate(['slug' => $u['slug']], [
                'nome' => $u['nome'],
                'cidade' => str_replace('/MG', '', $u['cidade']),
                'regiao' => $u['regiao'] ?? null,
                'sede' => false,
                'endereco' => $u['endereco'] ?? null,
                'telefone' => $u['contato']['telefone'] ?? null,
                'email' => $u['contato']['email'] ?? null,
                'horarios' => $u['horarios'],
                'servicos' => $u['servicos'],
                'maps_url' => $u['mapsUrl'] ?? null,
            ]);
        }
    }
}
