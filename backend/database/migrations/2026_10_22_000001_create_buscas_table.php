<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * Buscas feitas no portal, para as estatísticas do painel.
         * De propósito NÃO há IP, usuário, sessão nem navegador: ninguém
         * consegue saber quem buscou o quê. Registros somem após 90 dias.
         */
        Schema::create('buscas', function (Blueprint $table) {
            $table->id();
            $table->string('termo', 100); // normalizado: minúsculas, sem acentos
            $table->unsignedSmallInteger('resultados');
            $table->string('tipo_clicado', 20)->nullable(); // App\Enums\TipoResultadoBusca
            $table->unsignedTinyInteger('posicao_clicada')->nullable(); // 1 = primeiro resultado
            $table->timestamp('created_at')->useCurrent();

            $table->index('created_at');
            $table->index(['termo', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buscas');
    }
};
