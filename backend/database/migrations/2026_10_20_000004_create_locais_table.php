<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * Prédios, setores e serviços de um campus.
         * O vínculo estável é LOCAL → CENTRO (o Prédio 3 é o CCET); não existe
         * local → curso, porque as turmas mudam de sala a cada semestre.
         */
        Schema::create('locais', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('nome'); // Prédio 3
            $table->unsignedSmallInteger('numero')->nullable();
            $table->string('tipo', 30); // App\Enums\LocalTipo
            $table->foreignId('campus_id')->constrained('campi')->cascadeOnDelete();
            $table->foreignId('centro_id')->nullable()->constrained('centros')->nullOnDelete();
            $table->text('descricao')->nullable();
            $table->json('setores')->nullable();
            $table->json('servicos')->nullable();
            $table->string('localizacao')->nullable(); // Prédio 2 (CCH) · Térreo
            $table->string('telefone', 30)->nullable();
            $table->string('email')->nullable();
            $table->json('horarios')->nullable(); // [{dias?, horas, rotulo?}]
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('svg_id')->nullable(); // <path> da futura planta do campus
            $table->json('acessibilidade')->nullable(); // nulo enquanto não for levantada
            $table->boolean('publicado')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locais');
    }
};
