<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /* O status (aberto/encerrado) não é guardado: é derivado do prazo. */
        Schema::create('editais', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo', 30); // App\Enums\EditalTipo
            $table->string('publico'); // "Todos os cursos", "Graduados", "Odontologia"
            $table->string('campus'); // "Montes Claros", "Todos os campi"
            $table->date('prazo');
            $table->string('url')->nullable();
            $table->boolean('publicado')->default(true);
            $table->timestamps();

            $table->index(['publicado', 'prazo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('editais');
    }
};
