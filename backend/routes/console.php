<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Apaga registros vencidos (ex.: buscas com mais de 90 dias, ver App\Models\Busca)
Schedule::command('model:prune')->daily();
