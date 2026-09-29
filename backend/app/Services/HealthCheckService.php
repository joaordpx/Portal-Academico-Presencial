<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class HealthCheckService
{
    /**
     * Check health of all system components.
     *
     * @return array<string, mixed>
     */
    public function check(): array
    {
        return [
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'database' => $this->checkDatabase(),
                'redis' => $this->checkRedis(),
                'meilisearch' => $this->checkMeilisearch(),
                'storage' => $this->checkStorage(),
            ],
            'system' => [
                'php_version' => PHP_VERSION,
                'environment' => config('app.env'),
            ]
        ];
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'up'];
        } catch (\Exception $e) {
            Log::error('Health Check: Database down', ['error' => $e->getMessage()]);
            return ['status' => 'down', 'message' => 'Connection failed'];
        }
    }

    private function checkRedis(): array
    {
        try {
            Cache::store('redis')->get('health_check');
            return ['status' => 'up'];
        } catch (\Exception $e) {
            Log::error('Health Check: Redis down', ['error' => $e->getMessage()]);
            return ['status' => 'down', 'message' => 'Connection failed'];
        }
    }

    private function checkMeilisearch(): array
    {
        $host = config('scout.meilisearch.host');
        $key = config('scout.meilisearch.key');

        try {
            $response = Http::withToken($key)
                ->timeout(2)
                ->get(rtrim($host, '/') . '/health');

            if ($response->successful() && ($response->json()['status'] ?? '') === 'available') {
                return ['status' => 'up'];
            }

            return ['status' => 'down', 'message' => 'Service unavailable'];
        } catch (\Exception $e) {
            Log::error('Health Check: Meilisearch down', ['error' => $e->getMessage()]);
            return ['status' => 'down', 'message' => 'Connection timed out'];
        }
    }

    private function checkStorage(): array
    {
        try {
            $disk = Storage::disk('local');
            $filename = 'health-check.txt';
            $disk->put($filename, 'ok');
            $disk->delete($filename);
            
            return ['status' => 'up'];
        } catch (\Exception $e) {
            Log::error('Health Check: Storage failing', ['error' => $e->getMessage()]);
            return ['status' => 'down', 'message' => 'Write permission issue'];
        }
    }
}
