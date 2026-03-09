<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class PingEndpointTest extends TestCase
{
    public function test_ping_endpoint_returns_json(): void
    {
        $response = $this->getJson('/api/ping');

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'ok',
            ]);
    }
}
