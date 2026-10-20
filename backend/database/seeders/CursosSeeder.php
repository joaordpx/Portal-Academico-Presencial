<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\Centro;
use App\Models\Curso;
use Database\Seeders\Concerns\LeDadosJson;
use Illuminate\Database\Seeder;

class CursosSeeder extends Seeder
{
    use LeDadosJson;

    public function run(): void
    {
        $centros = Centro::pluck('id', 'sigla');
        $campiPorCidade = Campus::pluck('id', 'cidade');

        foreach ($this->dados('cursos') as $c) {
            $curso = Curso::updateOrCreate(['slug' => $c['slug']], [
                'nome' => $c['nome'],
                'grau' => $c['grau'],
                'modalidade' => $c['modalidade'],
                'centro_id' => $centros[$c['centro']] ?? null,
                'area' => $c['area'],
                'turnos' => $c['turnos'],
                'duracao' => $c['duracao'],
                'imagem' => $c['imagem'],
                'descricao' => $c['descricao'],
                'coordenador' => $c['coordenador'],
                'email_coordenacao' => $c['email'],
                'telefone_coordenacao' => $c['telefone'],
                'localizacao' => $c['localizacao'],
                'matriz_url' => $c['matriz_url'],
                'ppc_url' => $c['ppc_url'],
                'regulamento_tcc_url' => $c['regulamento_tcc_url'],
                'pagina_oficial' => $c['pagina_oficial'],
                'documentos_extras' => $c['documentos_extras'] ?: null,
            ]);

            // Toda cidade em `campi` tem oferta; as vagas vêm de `vagas` quando informadas
            $vagas = collect($c['vagas'])->keyBy('campus');
            foreach ($c['campi'] as $cidade) {
                $curso->ofertas()->updateOrCreate(
                    ['campus_id' => $campiPorCidade[$cidade]],
                    [
                        'vagas' => $vagas[$cidade]['quantidade'] ?? null,
                        'periodicidade' => $vagas[$cidade]['periodicidade'] ?? null,
                    ],
                );
            }
        }
    }
}
