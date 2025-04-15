<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('formation_participant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained()->onDelete('cascade');
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');
            $table->string('statut')->default('en attente');
            $table->timestamp('date_inscription')->useCurrent();
            $table->timestamps();
            
            $table->unique(['formation_id', 'participant_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('formation_participant');
    }
}; 