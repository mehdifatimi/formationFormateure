<?php

namespace Database\Seeders;

use App\Models\Formateur;
use App\Models\Profil;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in the correct order
        $this->call([
            RegionSeeder::class,
            VilleSeeder::class,
            FiliereSeeder::class,
            RegionVilleFiliereSeeder::class,
            UserSeeder::class,
            AdminUserSeeder::class,
            CDCSeeder::class,
            ParticipantSeeder::class,
            AnimateurSeeder::class,
            FormationSeeder::class,
            DRIFSeeder::class,
            DRSeeder::class,
            AbsenceSeeder::class,
        ]);

        // Create formateurs
        Formateur::factory(10)->create();
    }
}
