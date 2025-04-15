<?php

namespace Database\Seeders;

use App\Models\Formateur;
use App\Models\Profil;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        // Create admin profile
        Profil::factory()->create([
            'user_id' => $admin->id
        ]);

        // Create formateurs
        Formateur::factory(10)->create();

        // Create regular users with profiles
        User::factory(20)
            ->has(Profil::factory())
            ->create();

        // Run additional seeders in the correct order
        $this->call([
            RegionSeeder::class,
            VilleSeeder::class,
            CDCSeeder::class,
            FiliereSeeder::class,
        ]);
    }
}
