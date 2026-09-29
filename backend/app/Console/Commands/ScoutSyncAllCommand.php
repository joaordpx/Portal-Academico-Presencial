<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Course;
use App\Models\Subject;
use App\Models\Event;
use App\Models\Center;
use App\Models\Department;
use App\Models\Document;

class ScoutSyncAllCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scout:sync-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Configura o Meilisearch e importa todos os modelos searchable de uma vez';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Iniciando sincronização total do Meilisearch...');

        // 1. Rodar configuração de índices
        $this->comment('--- 1/2 Configurando índices (Ranking, Sinônimos, Filtros) ---');
        $this->call('scout:meilisearch-config');

        // 2. Rodar imports
        $this->comment('--- 2/2 Importando dados para os índices ---');

        $models = [
            Course::class,
            Subject::class,
            Event::class,
            Center::class,
            Department::class,
            Document::class,
        ];

        foreach ($models as $model) {
            $modelName = class_basename($model);
            $this->info("Importando {$modelName}...");
            $this->call('scout:import', ['model' => $model]);
        }

        $this->info('✅ Sincronização concluída com sucesso!');
    }
}
