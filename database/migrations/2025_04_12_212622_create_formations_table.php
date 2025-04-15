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
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->integer('duree');
            $table->string('niveau');
            $table->decimal('prix', 10, 2);
            $table->integer('places_disponibles');
            $table->string('statut')->default('en cours');
            $table->foreignId('formateur_id')->constrained()->onDelete('cascade');
            $table->foreignId('ville_id')->constrained()->onDelete('cascade');
            $table->foreignId('filiere_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
}; 