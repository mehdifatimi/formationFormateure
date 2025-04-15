<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Supprimer les tables dans l'ordre inverse de leur création
        Schema::dropIfExists('formation_participant');
        Schema::dropIfExists('formations');
        Schema::dropIfExists('participants');
        Schema::dropIfExists('formateurs');
        Schema::dropIfExists('animateurs');
        Schema::dropIfExists('filieres');
        Schema::dropIfExists('cdcs');
        Schema::dropIfExists('drifs');
        Schema::dropIfExists('drs');
        Schema::dropIfExists('villes');
        Schema::dropIfExists('regions');
        Schema::dropIfExists('profils');

        // Recréer les tables dans le bon ordre
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('villes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('drs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('drifs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('cdcs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->timestamps();
        });

        Schema::create('filieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cdc_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('formateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->json('specialites');
            $table->text('bio');
            $table->string('photo')->nullable();
            $table->string('linkedin')->nullable();
            $table->boolean('disponible')->default(true);
            $table->timestamps();
        });

        Schema::create('animateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->timestamps();
        });

        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->date('date_naissance');
            $table->string('niveau_etude');
            $table->text('attentes')->nullable();
            $table->string('statut_paiement')->default('en attente');
            $table->timestamps();
        });

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
            $table->string('statut')->default('en attente');
            $table->string('validation_status')->default('en attente');
            $table->foreignId('validated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('validated_at')->nullable();
            $table->foreignId('formateur_id')->constrained()->onDelete('cascade');
            $table->foreignId('ville_id')->constrained()->onDelete('cascade');
            $table->foreignId('filiere_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('profils', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('pays')->nullable();
            $table->string('code_postal')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamps();
        });

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

    public function down(): void
    {
        // Supprimer les tables dans l'ordre inverse de leur création
        Schema::dropIfExists('formation_participant');
        Schema::dropIfExists('profils');
        Schema::dropIfExists('formations');
        Schema::dropIfExists('participants');
        Schema::dropIfExists('formateurs');
        Schema::dropIfExists('animateurs');
        Schema::dropIfExists('filieres');
        Schema::dropIfExists('cdcs');
        Schema::dropIfExists('drifs');
        Schema::dropIfExists('drs');
        Schema::dropIfExists('villes');
        Schema::dropIfExists('regions');
    }
}; 