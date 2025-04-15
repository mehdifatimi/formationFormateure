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
        Schema::table('formations', function (Blueprint $table) {
            // Supprimer les anciennes colonnes
            $table->dropForeign(['ville_id']);
            $table->dropForeign(['filiere_id']);
            $table->dropForeign(['animateur_id']);
            $table->dropColumn(['ville_id', 'filiere_id', 'animateur_id']);

            // Ajouter les nouvelles colonnes
            $table->string('titre')->after('id');
            $table->text('description')->after('titre');
            $table->integer('duree')->after('date_fin');
            $table->string('niveau')->after('duree');
            $table->decimal('prix', 10, 2)->after('niveau');
            $table->integer('places_disponibles')->after('prix');
            $table->string('statut')->default('à venir')->after('places_disponibles');
            $table->foreignId('formateur_id')->after('statut')->constrained('formateurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            // Supprimer les nouvelles colonnes
            $table->dropForeign(['formateur_id']);
            $table->dropColumn([
                'titre',
                'description',
                'duree',
                'niveau',
                'prix',
                'places_disponibles',
                'statut',
                'formateur_id'
            ]);

            // Restaurer les anciennes colonnes
            $table->foreignId('ville_id')->constrained('villes')->onDelete('cascade');
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->foreignId('animateur_id')->constrained('animateurs')->onDelete('cascade');
        });
    }
};
