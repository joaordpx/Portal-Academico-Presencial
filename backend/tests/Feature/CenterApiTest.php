<?php

namespace Tests\Feature;

use App\Models\Center;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CenterApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_center_list_includes_acronym(): void
    {
        Center::factory()->create(['name' => 'Centro de Ciencias Exatas', 'acronym' => 'CCET']);

        $response = $this->getJson('/api/centers');

        $response->assertStatus(200);
        $response->assertJsonPath('data.0.acronym', 'CCET');
    }

    public function test_center_detail_includes_acronym(): void
    {
        $center = Center::factory()->create(['acronym' => 'CCBS']);

        $response = $this->getJson('/api/centers/' . $center->id);

        $response->assertStatus(200);
        $response->assertJsonPath('data.acronym', 'CCBS');
    }
}
