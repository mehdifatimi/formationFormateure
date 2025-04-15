<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cdcs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drif_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->timestamps();

            // Add indexes for better performance
            $table->index('nom');
            $table->index('prenom');
            $table->index('email');
            $table->index('telephone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cdcs');
    }
}; 
