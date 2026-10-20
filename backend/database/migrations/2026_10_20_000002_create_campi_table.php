<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campi', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('nome'); // Campus Januária
            $table->string('cidade'); // Januária
            $table->string('regiao')->nullable(); // Norte de Minas
            $table->boolean('sede')->default(false); // campus-sede, em Montes Claros
            $table->string('endereco')->nullable();
            $table->string('telefone', 30)->nullable();
            $table->string('email')->nullable();
            $table->json('horarios')->nullable(); // [{dias?, horas, rotulo?}]
            $table->json('servicos')->nullable(); // estrutura do campus
            $table->string('maps_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campi');
    }
};
