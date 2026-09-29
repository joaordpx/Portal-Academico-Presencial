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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->nullable();
            $table->foreignId('center_id')->nullable();
            $table->foreignId('department_id')->nullable();
            $table->string('area');
            $table->string('shift');
            $table->integer('min_duration');
            $table->text('market_description');
            $table->string('coordinator_email');
            $table->timestamps();

            $table->index('name');
            $table->index('type');
            $table->index('center_id');
            $table->index('department_id');
            $table->index('area');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
