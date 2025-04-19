<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            ProfilSeeder::class,
            FormationSeeder::class,
            FormationParticipantSeeder::class,
            AbsenceSeeder::class,
            FormateurSeeder::class,
            ParticipantSeeder::class,
        ]);
    }
}
