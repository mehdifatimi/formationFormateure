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
        // Supprimer d'abord la table si elle existe
        Schema::dropIfExists('formation_participant');

        // Recréer la table avec les bonnes relations
        Schema::create('formation_participant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained()->onDelete('cascade');
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');
            $table->string('statut')->default('en attente');
            $table->timestamp('date_inscription')->nullable();
            $table->timestamps();

            $table->unique(['formation_id', 'participant_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formation_participant');
    }
};
