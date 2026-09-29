<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_only_published_events_and_filters_by_center(): void
    {
        $centerA = Center::factory()->create(['name' => 'Centro de Computacao']);
        $centerB = Center::factory()->create(['name' => 'Centro de Saude']);

        Event::factory()->published()->create([
            'id' => 101,
            'title' => 'Semana de Software',
            'center_id' => $centerA->id,
        ]);

        Event::factory()->published()->create([
            'id' => 102,
            'title' => 'Feira de Saude',
            'center_id' => $centerB->id,
        ]);

        Event::factory()->create([
            'id' => 103,
            'title' => 'Evento nao publicado',
            'center_id' => $centerA->id,
            'is_published' => false,
        ]);

        $response = $this->getJson('/api/events?center_id=' . $centerA->id);

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.nome', 'Semana de Software');
        $response->assertJsonPath('data.0.center.id', $centerA->id);
    }

    public function test_it_filters_events_by_search_term(): void
    {
        Event::factory()->published()->create([
            'id' => 104,
            'title' => 'Ciclo de Palestras em Engenharia',
            'description' => '<p>Encontro aberto ao <strong>publico</strong></p>',
        ]);

        Event::factory()->published()->create([
            'id' => 105,
            'title' => 'Mostra Cultural',
            'description' => 'Arte e cultura',
        ]);

        $response = $this->getJson('/api/events?search=engenharia');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.nome', 'Ciclo de Palestras em Engenharia');
        $response->assertJsonPath('data.0.descricao', 'Encontro aberto ao publico');
    }

    public function test_it_returns_event_by_id(): void
    {
        $event = Event::factory()->published()->create([
            'id' => 106,
            'title' => 'Workshop de Inovacao',
            'details_url' => 'https://externo.test/acoes/123',
        ]);

        $response = $this->getJson('/api/events/' . $event->id);

        $response->assertStatus(200);
        $response->assertJsonPath('data.nome', 'Workshop de Inovacao');
        $response->assertJsonPath('data.url_detalhes', 'https://externo.test/acoes/123');
    }
}
