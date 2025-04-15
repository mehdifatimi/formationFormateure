<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear all tables first
        DB::table('participants')->truncate();
        DB::table('animateurs')->truncate();
        DB::table('formations')->truncate();
        DB::table('filieres')->truncate();
        DB::table('cdcs')->truncate();
        DB::table('drifs')->truncate();
        DB::table('drs')->truncate();
        DB::table('villes')->truncate();
        DB::table('regions')->truncate();
        
        $this->call([
            UserSeeder::class,
            RegionSeeder::class,
            VilleSeeder::class,
            DRSeeder::class,
            DRIFSeeder::class,
            CDCSeeder::class,
            FiliereSeeder::class,
            AnimateurSeeder::class,
            FormationSeeder::class,
            ParticipantSeeder::class,
        ]);
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
