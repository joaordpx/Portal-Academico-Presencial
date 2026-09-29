<?php

namespace App\Services;

use App\Models\Center;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class EventPollingService
{
    private ?array $syncResult = null;

    /**
     * Fetch remote actions and sync them into local events.
     *
     * @return array<string, int>
     */
    public function syncFromRemote(): array
    {
        $baseUrl = (string) config('services.sigex.base_url');
        $apiKey = (string) config('services.sigex.api_key');
        $cacheMinutes = (int) config('services.sigex.cache_minutes', 10);

        if ($baseUrl === '') {
            throw new RuntimeException('SIGEX_BASE_URL is not configured.');
        }

        if ($apiKey === '') {
            throw new RuntimeException('SIGEX_API_KEY is not configured.');
        }

        $url = rtrim($baseUrl, '/') . '/api/v1/public/acoes';
        $cacheKey = 'sigex.public.acoes.' . md5($url);

        $payload = Cache::remember($cacheKey, now()->addMinutes($cacheMinutes), function () use ($url, $apiKey): array {
            $response = Http::acceptJson()
                ->withHeaders(['X-API-KEY' => $apiKey])
                ->timeout(30)
                ->retry(1, 500)
                ->get($url);

            if ($response->status() === 401) {
                throw new RuntimeException('SigEx returned 401 Unauthorized. Check X-API-KEY.');
            }

            if ($response->status() === 429) {
                throw new RuntimeException('SigEx returned 429 Too Many Requests. Reduce polling frequency or adjust cache.');
            }

            $response->throw();

            $decoded = $response->json();

            return is_array($decoded) ? $decoded : [];
        });

        return $this->syncActions($this->extractActions($payload));
    }

    /**
     * @param array<int, array<string, mixed>> $actions
     * @return array<string, int>
     */
    public function syncActions(array $actions): array
    {
        $syncedIds = [];
        $created = 0;
        $updated = 0;

        DB::transaction(function () use ($actions, &$syncedIds, &$created, &$updated): void {
            foreach ($actions as $action) {
                if (!is_array($action)) {
                    continue;
                }

                $eventId = (int) ($action['id'] ?? 0);
                if ($eventId <= 0) {
                    continue;
                }

                $attributes = $this->mapActionToEventAttributes($action, $eventId);

                $event = Event::updateOrCreate(
                    ['id' => $eventId],
                    $attributes
                );

                $syncedIds[] = $eventId;

                if ($event->wasRecentlyCreated) {
                    $created++;
                } else {
                    $updated++;
                }
            }

            $deactivated = 0;
            if ($syncedIds !== []) {
                $deactivated = Event::query()
                    ->whereNotIn('id', $syncedIds)
                    ->update(['is_published' => false]);
            }

            $this->syncResult = [
                'created' => $created,
                'updated' => $updated,
                'deactivated' => $deactivated,
                'total' => count($syncedIds),
            ];
        });

        return $this->syncResult ?? [
            'created' => 0,
            'updated' => 0,
            'deactivated' => 0,
            'total' => 0,
        ];
    }

    /**
     * @param mixed $payload
     * @return array<int, array<string, mixed>>
     */
    private function extractActions(mixed $payload): array
    {
        if (is_array($payload) && array_is_list($payload)) {
            return $payload;
        }

        if (is_array($payload)) {
            $candidate = $payload['data'] ?? $payload['results'] ?? $payload['items'] ?? null;

            if (is_array($candidate)) {
                return $candidate;
            }
        }

        return [];
    }

    /**
     * @param array<string, mixed> $action
     * @return array<string, mixed>
     */
    private function mapActionToEventAttributes(array $action, int $eventId): array
    {
        $centerName = $this->extractCenterName($action);
        $centerId = null;

        if ($centerName !== null) {
            $center = Center::firstOrCreate(['name' => $centerName]);
            $centerId = $center->id;
        }

        return [
            'id' => $eventId,
            'title' => (string) ($action['nome'] ?? $action['name'] ?? $action['title'] ?? 'Evento'),
            'description' => $this->sanitizeDescription($action['descricao'] ?? $action['description'] ?? null),
            'center_id' => $centerId,
            'starts_at' => $this->toDate($action['data_inicio'] ?? $action['dt_inicio'] ?? $action['starts_at'] ?? null),
            'ends_at' => $this->toDate($action['data_fim'] ?? $action['dt_fim'] ?? $action['ends_at'] ?? null),
            'registration_ends_at' => $this->toDate($action['data_limite_inscricao'] ?? $action['dt_limite_inscricao'] ?? $action['registration_ends_at'] ?? null),
            'workload_hours' => $this->stringValue($action['carga_horaria'] ?? $action['workload_hours'] ?? null),
            'available_spots' => $this->intValue($action['vagas_disponiveis'] ?? $action['available_spots'] ?? null),
            'is_sold_out' => (bool) ($action['esgotado'] ?? $action['is_sold_out'] ?? false),
            'campus_name' => $this->stringValue($action['campus'] ?? $action['campus_name'] ?? null),
            'event_type' => $this->stringValue($action['tipo'] ?? $action['event_type'] ?? null),
            'image_url' => $this->stringValue($action['imagem'] ?? $action['image_url'] ?? null),
            'details_url' => $this->stringValue($action['url_detalhes'] ?? $action['details_url'] ?? null),
            'is_published' => true,
            'published_at' => now(),
        ];
    }

    /**
     * @param array<string, mixed> $action
     */
    private function extractCenterName(array $action): ?string
    {
        $center = $action['centro'] ?? $action['campus'] ?? $action['center'] ?? null;

        if (is_array($center)) {
            return $this->stringValue($center['name'] ?? $center['nome'] ?? null);
        }

        return $this->stringValue($center);
    }

    /**
     * @param mixed $value
     */
    private function sanitizeDescription(mixed $value): ?string
    {
        $description = $this->stringValue($value);

        if ($description === null) {
            return null;
        }

        return trim(strip_tags($description));
    }

    /**
     * @param mixed $value
     */
    private function stringValue(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    /**
     * @param mixed $value
     */
    private function intValue(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    /**
     * @param mixed $value
     */
    private function toDate(mixed $value): ?\DateTimeInterface
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            $stringValue = (string) $value;

            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $stringValue) === 1) {
                return Carbon::createFromFormat('Y-m-d', $stringValue);
            }

            return Carbon::parse($stringValue);
        } catch (\Throwable) {
            return null;
        }
    }
}
