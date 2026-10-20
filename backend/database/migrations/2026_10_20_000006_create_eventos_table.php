<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // rota /eventos/:slug
            $table->string('titulo');
            $table->text('descricao'); // resumo do card
            $table->text('conteudo')->nullable(); // parágrafos separados por linha em branco
            $table->string('tipo', 30); // App\Enums\EventoTipo
            $table->date('data');
            $table->date('data_fim')->nullable();
            $table->string('horario')->nullable();
            $table->string('local')->nullable();
            $table->string('campus')->nullable();
            $table->string('imagem')->nullable();
            $table->string('origem', 20)->default('manual'); // manual | sigex
            $table->string('id_externo')->nullable()->unique(); // id da ação no SiGex
            $table->string('organizador')->nullable();
            $table->string('link_oficial')->nullable();
            $table->boolean('inscricoes_abertas')->default(false);
            $table->boolean('publicado')->default(true);
            $table->timestamps();

            $table->index(['publicado', 'data']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
