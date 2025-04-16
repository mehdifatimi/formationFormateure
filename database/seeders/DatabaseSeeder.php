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
            UserSeeder::class,
            RegionSeeder::class,
            VilleSeeder::class,
            CDCSeeder::class,
            FiliereSeeder::class,
        ]);

        // Create formateurs
        Formateur::factory(10)->create();
    }
}
