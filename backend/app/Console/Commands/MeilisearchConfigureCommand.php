<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class MeilisearchConfigureCommand extends Command
{
    protected $signature = 'scout:meilisearch-config';
    protected $description = 'Configura searchableAttributes e outras settings do Meilisearch para os índices usados pelo Scout';

    public function handle()
    {
        $host = config('scout.meilisearch.host');
        $key = config('scout.meilisearch.key');

        $indices = [
            'courses' => [
                'searchable' => ['name', 'center_name', 'department_name', 'description', 'area', 'type'],
                'filterable' => ['type', 'shift'],
            ],
            'subjects' => [
                'searchable' => ['name', 'course_name', 'description'],
                'filterable' => ['period'],
            ],
            'departments' => [
                'searchable' => ['name', 'center_name', 'description'],
                'filterable' => ['center_id'],
            ],
            'centers' => [
                'searchable' => ['name', 'description'],
                'filterable' => [],
            ],
            'documents' => [
                'searchable' => ['title', 'description', 'searchable_text', 'original_name', 'document_type', 'context_type'],
                'filterable' => ['document_type', 'context_type', 'extension', 'is_public'],
            ],
            'events' => [
                'searchable' => ['title', 'description', 'campus_name', 'event_type'],
                'filterable' => ['event_type', 'center_id', 'is_published', 'is_sold_out'],
            ],
        ];

        foreach ($indices as $index => $config) {
            // Configure Searchable Attributes
            $this->updateSettings($host, $key, $index, 'searchable-attributes', $config['searchable']);

            // Configure Filterable Attributes
            $this->updateSettings($host, $key, $index, 'filterable-attributes', $config['filterable']);

            // Configure Ranking Rules
            $rankingRules = [
                'words',
                'typo',
                'proximity',
                'attribute',
                'sort',
                'exactness',
            ];
            $this->updateSettings($host, $key, $index, 'ranking-rules', $rankingRules);

            // Configure Synonyms (Common academic terms)
            $synonyms = [
                'ppc' => ['projeto pedagogico', 'projeto pedagogico de curso'],
                'disciplina' => ['materia', 'grade', 'unidade curricular'],
                'centro' => ['predio', 'unidade', 'campus'],
                'ead' => ['ensino a distancia', 'distancia', 'online'],
                'pos' => ['pos-graduacao', 'pos graduacao', 'especializacao', 'mestrado', 'doutorado'],
                'graduacao' => ['curso superior', 'bacharelado', 'licenciatura'],
                'vestibular' => ['processo seletivo', 'paes', 'concurso'],
                'paes' => ['programa de avaliacao seriada'],
                'unimontes' => ['universidade', 'instituicao'],
                'edital' => ['chamada', 'concurso', 'normas'],
            ];
            $this->updateSettings($host, $key, $index, 'synonyms', $synonyms);

            $this->info("[OK] Configurações aplicadas para o índice: {$index}");
        }
    }

    private function updateSettings($host, $key, $index, $setting, $value)
    {
        $url = rtrim($host, '/') . "/indexes/{$index}/settings/{$setting}";
        $response = Http::withToken($key)->put($url, $value);

        if (!$response->successful()) {
            $this->error("[ERRO] Falha ao configurar {$setting} para {$index}: " . $response->body());
        }
    }
}
