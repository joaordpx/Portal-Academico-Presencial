<?php

namespace App\Http\Controllers;

use App\Services\HealthCheckService;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function __construct(private HealthCheckService $healthCheckService)
    {
    }

    /**
     * Get system health status.
     */
    public function __invoke(): JsonResponse
    {
        $health = $this->healthCheckService->check();
        
        // Se algum serviço crítico estiver fora, retornamos 503 (Service Unavailable)
        $isHealthy = collect($health['services'])->every(fn($s) => $s['status'] === 'up');
        
        if (!$isHealthy) {
            $health['status'] = 'error';
        }

        return response()->json($health, $isHealthy ? 200 : 503);
    }
}
