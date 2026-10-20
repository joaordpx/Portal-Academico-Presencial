<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // `php artisan serve` limpa o ambiente do servidor e só repassa nomes como PATH e
        // SYSTEMROOT; no Windows eles se chamam Path e SystemRoot, e sem eles o PHP não abre
        // a porta ("Failed to listen ... reason: ?").
        if (PHP_OS_FAMILY === 'Windows') {
            ServeCommand::$passthroughVariables = [
                ...ServeCommand::$passthroughVariables,
                'Path', 'SystemRoot', 'WINDIR', 'TEMP', 'TMP',
            ];
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // O frontend consome os recursos direto (array/objeto), sem o envelope `data`
        JsonResource::withoutWrapping();

        // Em desenvolvimento, acusa consultas N+1 e atributos inexistentes
        Model::shouldBeStrict(! $this->app->isProduction());
    }
}
