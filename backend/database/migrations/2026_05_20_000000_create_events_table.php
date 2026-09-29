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
        Schema::create('events', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->foreignId('center_id')->nullable()->constrained('centers')->nullOnDelete();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->date('registration_ends_at')->nullable();
            $table->string('workload_hours', 32)->nullable();
            $table->unsignedInteger('available_spots')->nullable();
            $table->boolean('is_sold_out')->default(false);
            $table->string('campus_name')->nullable();
            $table->string('event_type')->nullable();
            $table->string('image_url')->nullable();
            $table->string('details_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['center_id', 'is_published']);
            $table->index(['campus_name', 'event_type']);
            $table->index('starts_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
