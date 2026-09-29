<?php

namespace App\Services;

use App\Models\Center;
use App\Models\Course;
use App\Models\Department;
use App\Models\Document;
use App\Models\Event;
use App\Models\Subject;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SearchService
{
    private string $host;
    private string $key;

    public function __construct()
    {
        $this->host = config('scout.meilisearch.host');
        $this->key = config('scout.meilisearch.key');
    }

    /**
     * Search across multiple indexes using Meilisearch Multi-Search.
     *
     * @param array<string, mixed> $filters
     */
    public function search(array $filters): LengthAwarePaginator
    {
        $query = isset($filters['q']) ? trim((string) $filters['q']) : '';
        $entityType = $filters['entity_type'] ?? 'all';
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page = max(1, (int) ($filters['page'] ?? 1));

        if ($query === '') {
            return new LengthAwarePaginator([], 0, $perPage, $page, [
                'path' => Paginator::resolveCurrentPath(),
                'query' => ['q' => $query, 'entity_type' => $entityType, 'per_page' => $perPage],
            ]);
        }

        if (config('scout.driver') !== 'meilisearch') {
            return $this->performSequentialSqlFallback($query, $entityType, $perPage, $page);
        }

        $searchConfigs = [
            'course' => 'courses',
            'subject' => 'subjects',
            'center' => 'centers',
            'department' => 'departments',
            'document' => 'documents',
            'event' => 'events',
        ];

        $queries = [];
        foreach ($searchConfigs as $type => $index) {
            if ($entityType !== 'all' && $entityType !== $type) {
                continue;
            }

            $queryConfig = [
                'indexUid' => $index,
                'q' => $query,
                'limit' => 20,
                'attributesToHighlight' => ['*'],
                'attributesToCrop' => ['description:30', 'searchable_text:30'],
                'cropMarker' => '...',
                'highlightPreTag' => '<mark>',
                'highlightPostTag' => '</mark>',
                'showRankingScore' => true,
            ];

            // Security: Only return public documents via global search
            if ($type === 'document') {
                $queryConfig['filter'] = 'is_public = true';
            }

            $queries[] = $queryConfig;
        }

        try {
            $response = Http::withToken($this->key)
                ->post(rtrim($this->host, '/') . '/multi-search', ['queries' => $queries]);

            if (!$response->successful()) {
                throw new \RuntimeException("Meilisearch multi-search failed: " . $response->body());
            }

            $results = [];
            $multiResults = $response->json()['results'];

            foreach ($multiResults as $indexResult) {
                $type = array_search($indexResult['indexUid'], $searchConfigs);
                foreach ($indexResult['hits'] as $hit) {
                    $formatted = $hit['_formatted'] ?? [];

                    // Prioritize the field that actually has a match highlight
                    $description = null;
                    if (isset($formatted['searchable_text']) && str_contains($formatted['searchable_text'], '<mark>')) {
                        $description = $formatted['searchable_text'];
                    } elseif (isset($formatted['description']) && str_contains($formatted['description'], '<mark>')) {
                        $description = $formatted['description'];
                    } else {
                        // Fallback to whatever is available
                        $description = $formatted['description'] ?? $formatted['searchable_text'] ?? null;
                    }

                    $results[] = [
                        'id' => $hit['id'],
                        'entity_type' => $type,
                        'title' => $formatted['name'] ?? $formatted['title'] ?? 'N/A',
                        'description' => $description,
                        'score' => $hit['_rankingScore'] ?? 0,
                        'highlights' => $formatted,
                        'data' => array_diff_key($hit, array_flip(['_formatted', '_rankingScore'])),
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Meilisearch multi-search failed. Falling back to sequential SQL.", [
                'error' => $e->getMessage(),
            ]);
            return $this->performSequentialSqlFallback($query, $entityType, $perPage, $page);
        }

        // Sort by Meilisearch ranking score
        usort($results, fn($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));

        $total = count($results);
        $offset = ($page - 1) * $perPage;
        $items = array_slice($results, $offset, $perPage);

        return new LengthAwarePaginator($items, $total, $perPage, $page, [
            'path' => Paginator::resolveCurrentPath(),
            'query' => ['q' => $query, 'entity_type' => $entityType, 'per_page' => $perPage],
        ]);
    }

    /**
     * Fallback search using standard SQL LIKE queries across entities.
     */
    private function performSequentialSqlFallback(string $query, string $entityType, int $perPage, int $page): LengthAwarePaginator
    {
        $results = [];
        $models = [
            'course' => Course::class,
            'subject' => Subject::class,
            'center' => Center::class,
            'department' => Department::class,
            'document' => Document::class,
            'event' => Event::class,
        ];

        foreach ($models as $type => $modelClass) {
            if ($entityType !== 'all' && $entityType !== $type) {
                continue;
            }

            $searchFields = match ($type) {
                'course' => ['name', 'market_description'],
                'subject' => ['name'],
                'center' => ['name'],
                'department' => ['name'],
                'document' => ['title', 'description', 'original_name'],
                'event' => ['title', 'description', 'campus_name'],
                default => ['name'],
            };

            $builder = $modelClass::query();

            // Security: Only return public documents in fallback
            if ($type === 'document') {
                $builder->where('is_public', true);
            }

            $builder->where(function ($searchQuery) use ($searchFields, $query) {
                foreach ($searchFields as $field) {
                    $searchQuery->orWhere($field, 'like', "%{$query}%");
                }
            });

            $records = $builder->take(10)->get();

            foreach ($records as $record) {
                $title = $record->name ?? $record->title ?? 'N/A';
                $results[] = [
                    'id' => $record->id,
                    'entity_type' => $type,
                    'title' => $title,
                    'description' => $record->description ?? $record->market_description ?? null,
                    'score' => str_contains(strtolower($title), strtolower($query)) ? 1 : 0.5,
                    'highlights' => [],
                    'data' => $record->toArray(),
                ];
            }
        }

        usort($results, fn($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));

        $total = count($results);
        $offset = ($page - 1) * $perPage;
        $items = array_slice($results, $offset, $perPage);

        return new LengthAwarePaginator($items, $total, $perPage, $page, [
            'path' => Paginator::resolveCurrentPath(),
            'query' => ['q' => $query, 'entity_type' => $entityType, 'per_page' => $perPage],
        ]);
    }

    /**
     * Get search suggestions (autocomplete) using multi-search.
     */
    public function suggest(string $query): array
    {
        if (strlen($query) < 2) return [];

        $cacheKey = 'search_suggest_multi_' . md5(strtolower($query));

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($query) {
            $searchConfigs = [
                'course' => 'courses',
                'subject' => 'subjects',
                'document' => 'documents',
                'event' => 'events',
            ];

            $queries = [];
            foreach ($searchConfigs as $index) {
                $queries[] = [
                    'indexUid' => $index,
                    'q' => $query,
                    'limit' => 2,
                    'attributesToRetrieve' => ['name', 'title'],
                ];
            }

            try {
                $response = Http::withToken($this->key)
                    ->post(rtrim($this->host, '/') . '/multi-search', ['queries' => $queries]);

                if (!$response->successful()) return [];

                $suggestions = [];
                foreach ($response->json()['results'] as $indexResult) {
                    $type = array_search($indexResult['indexUid'], $searchConfigs);
                    foreach ($indexResult['hits'] as $hit) {
                        $suggestions[] = [
                            'text' => $hit['name'] ?? $hit['title'],
                            'type' => $type,
                        ];
                    }
                }

                return array_slice($suggestions, 0, 5);
            } catch (\Throwable) {
                return [];
            }
        });
    }
}
