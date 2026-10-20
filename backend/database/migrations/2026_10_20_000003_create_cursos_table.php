<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cursos', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // rota /cursos/:slug
            $table->string('nome');
            $table->string('grau', 30); // App\Enums\Grau
            $table->string('modalidade', 30)->default('Presencial');
            $table->foreignId('centro_id')->nullable()->constrained('centros')->nullOnDelete();
            $table->string('area');
            $table->json('turnos'); // App\Enums\Turno[] — turnos das entradas de ingressantes
            $table->unsignedTinyInteger('duracao')->nullable(); // nº de semestres
            $table->string('imagem')->nullable();
            $table->text('descricao')->nullable(); // parágrafos separados por linha em branco
            $table->json('perfil_egresso')->nullable();
            $table->json('mercado_trabalho')->nullable(); // [{titulo, descricao}]

            // Coordenação
            $table->string('coordenador')->nullable();
            $table->string('email_coordenacao')->nullable();
            $table->string('telefone_coordenacao', 30)->nullable();
            $table->string('localizacao')->nullable();

            // Documentos publicados no site oficial (upload próprio virá com a entidade de documentos)
            $table->string('matriz_url')->nullable();
            $table->string('ppc_url')->nullable();
            $table->string('regulamento_tcc_url')->nullable();
            $table->string('pagina_oficial')->nullable();
            $table->json('documentos_extras')->nullable(); // [{label, url}]

            $table->boolean('publicado')->default(true);
            $table->timestamps();

            $table->index(['publicado', 'nome']);
        });

        /** Oferta de um curso em um campus, com as vagas de ingresso */
        Schema::create('curso_ofertas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curso_id')->constrained('cursos')->cascadeOnDelete();
            $table->foreignId('campus_id')->constrained('campi')->cascadeOnDelete();
            $table->unsignedSmallInteger('vagas')->nullable();
            $table->string('periodicidade', 20)->nullable(); // semestrais | anuais
            $table->timestamps();

            $table->unique(['curso_id', 'campus_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curso_ofertas');
        Schema::dropIfExists('cursos');
    }
};
