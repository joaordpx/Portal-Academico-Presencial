<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PapeisSeeder::class,
            // Carga inicial com os dados reais de unimontes.br (out/2026)
            CentrosSeeder::class,
            CampiSeeder::class,
            CursosSeeder::class,
            LocaisSeeder::class,
            EditaisSeeder::class,
            EventosSeeder::class,
        ]);

        // Usuário de desenvolvimento — nunca é criado em produção.
        // Senha: a padrão da UserFactory ("password").
        if (app()->environment('local', 'testing')) {
            User::factory()
                ->create(['name' => 'Administrador (dev)', 'email' => 'admin@portal.test'])
                ->assignRole('administrador');
        }
    }
}
