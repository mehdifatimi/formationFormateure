<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialites', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Table pivot pour la relation many-to-many entre formateurs et spécialités
        Schema::create('formateur_specialite', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formateur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('specialite_id')->constrained('specialites')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formateur_specialite');
        Schema::dropIfExists('specialites');
    }
}; 