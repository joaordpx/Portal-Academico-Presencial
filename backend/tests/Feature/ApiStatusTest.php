<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiStatusTest extends TestCase
{
    public function test_api_publica_responde(): void
    {
        $this->getJson('/api/status')->assertOk()->assertJson(['status' => 'ok']);
    }
}
