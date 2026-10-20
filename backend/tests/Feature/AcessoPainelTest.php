<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\PapeisSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcessoPainelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PapeisSeeder::class);
    }

    public function test_visitante_e_redirecionado_para_o_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_usuario_sem_papel_nao_acessa_o_painel(): void
    {
        $this->actingAs(User::factory()->create())->get('/admin')->assertForbidden();
    }

    public function test_editor_acessa_o_painel(): void
    {
        $editor = User::factory()->create()->assignRole('editor');

        $this->actingAs($editor)->get('/admin')->assertOk();
    }

    public function test_administrador_acessa_o_painel(): void
    {
        $admin = User::factory()->create()->assignRole('administrador');

        $this->actingAs($admin)->get('/admin')->assertOk();
    }
}
