<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('formation_valider', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')
                  ->constrained('formations')
                  ->onDelete('cascade');
            $table->foreignId('drf_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->text('commentaire')->nullable();
            $table->timestamp('date_validation');
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index('formation_id');
            $table->index('drf_id');
            $table->index('date_validation');
        });
    }

    public function down()
    {
        Schema::dropIfExists('formation_valider');
    }
}; 