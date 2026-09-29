<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('document_type', 50);
            $table->string('context_type', 50)->nullable();
            $table->unsignedBigInteger('context_id')->nullable();
            $table->string('original_name');
            $table->string('extension', 20)->nullable();
            $table->string('mime_type', 150);
            $table->unsignedBigInteger('size_bytes');
            $table->string('disk', 50)->default('local');
            $table->string('path');
            $table->longText('searchable_text')->nullable();
            $table->boolean('is_public')->default(false);
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['context_type', 'context_id']);
            $table->index(['context_type', 'context_id', 'created_at']);
            $table->index(['document_type', 'created_at']);
            $table->index('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
