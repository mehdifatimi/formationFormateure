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
        Schema::table('participants', function (Blueprint $table) {
            if (!Schema::hasColumn('participants', 'telephone')) {
                $table->string('telephone')->after('email');
            }
            if (!Schema::hasColumn('participants', 'date_naissance')) {
                $table->date('date_naissance')->after('telephone');
            }
            if (!Schema::hasColumn('participants', 'niveau_etude')) {
                $table->string('niveau_etude')->after('date_naissance');
            }
            if (!Schema::hasColumn('participants', 'attentes')) {
                $table->text('attentes')->nullable()->after('niveau_etude');
            }
            if (!Schema::hasColumn('participants', 'statut_paiement')) {
                $table->string('statut_paiement')->default('en attente')->after('formation_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $columns = [
                'telephone',
                'date_naissance',
                'niveau_etude',
                'attentes',
                'statut_paiement'
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('participants', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
