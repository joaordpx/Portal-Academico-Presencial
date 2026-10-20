<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Papéis do painel administrativo.
 *
 * - administrador: gerencia todo o conteúdo e os usuários;
 * - editor: alimenta o conteúdo (o escopo por centro/setor entra com os recursos do painel).
 */
class PapeisSeeder extends Seeder
{
    public function run(): void
    {
        foreach (User::PAPEIS_DO_PAINEL as $papel) {
            Role::findOrCreate($papel, 'web');
        }
    }
}
