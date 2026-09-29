<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class EventPollingCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_syncs_remote_actions_into_local_events(): void
    {
        config([
            'services.sigex.base_url' => 'https://remote.test',
            'services.sigex.api_key' => 'sigex-test-key',
            'services.sigex.cache_minutes' => 10,
        ]);

        Event::factory()->published()->create([
            'id' => 999,
            'title' => 'Evento Antigo',
            'details_url' => 'https://remote.test/old',
        ]);

        Http::fake([
            'https://remote.test/api/v1/public/acoes' => Http::response([
                'data' => [
                    [
                        'id' => 123,
                        'nome' => 'Semana de Pesquisa',
                        'descricao' => '<p>Inscricoes <strong>abertas</strong></p>',
                        'data_inicio' => '2026-06-10',
                        'data_fim' => '2026-06-12',
                        'data_limite_inscricao' => '2026-06-08',
                        'carga_horaria' => '12',
                        'vagas_disponiveis' => 5,
                        'esgotado' => false,
                        'campus' => 'Campus Central',
                        'tipo' => 'Curso',
                        'imagem' => 'https://externo.test/img/123.jpg',
                        'url_detalhes' => 'https://externo.test/acoes/123',
                    ],
                ],
            ], 200),
        ]);

        $this->artisan('events:sync-external')->assertExitCode(0);

        $center = Center::where('name', 'Campus Central')->first();
        $this->assertNotNull($center);

        $this->assertDatabaseHas('events', [
            'id' => 123,
            'title' => 'Semana de Pesquisa',
            'center_id' => $center->id,
            'details_url' => 'https://externo.test/acoes/123',
            'available_spots' => 5,
            'is_sold_out' => 0,
            'is_published' => 1,
        ]);

        $this->assertDatabaseHas('events', [
            'id' => 999,
            'is_published' => 0,
        ]);
    }

    public function test_it_uses_the_configured_remote_url_and_api_key(): void
    {
        config([
            'services.sigex.base_url' => 'https://remote.test',
            'services.sigex.api_key' => 'sigex-test-key',
            'services.sigex.cache_minutes' => 10,
        ]);

        Http::fake([
            'https://remote.test/api/v1/public/acoes' => Http::response(['data' => []], 200),
        ]);

        $this->artisan('events:sync-external')->assertExitCode(0);

        Http::assertSent(function ($request): bool {
            return $request->url() === 'https://remote.test/api/v1/public/acoes'
                && $request->hasHeader('X-API-KEY', 'sigex-test-key');
        });
    }

    public function test_it_fails_on_unauthorized_sigex_response(): void
    {
        config([
            'services.sigex.base_url' => 'https://remote.test',
            'services.sigex.api_key' => 'sigex-test-key',
            'services.sigex.cache_minutes' => 10,
        ]);

        Http::fake([
            'https://remote.test/api/v1/public/acoes' => Http::response(['message' => 'Unauthenticated.'], 401),
        ]);

        $this->artisan('events:sync-external')->assertExitCode(1);
    }

    public function test_it_fails_on_throttled_sigex_response(): void
    {
        config([
            'services.sigex.base_url' => 'https://remote.test',
            'services.sigex.api_key' => 'sigex-test-key',
            'services.sigex.cache_minutes' => 10,
        ]);

        Http::fake([
            'https://remote.test/api/v1/public/acoes' => Http::response(['message' => 'Too Many Requests'], 429),
        ]);

        $this->artisan('events:sync-external')->assertExitCode(1);
    }
}
