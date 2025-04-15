<?php

namespace Database\Seeders;

use App\Models\Ville;
use App\Models\Region;
use Illuminate\Database\Seeder;

class VilleSeeder extends Seeder
{
    public function run(): void
    {
        $villes = [
            'Casablanca-Settat' => [
                'Casablanca',
                'Settat',
                'Mohammedia',
                'El Jadida',
                'Benslimane'
            ],
            'Rabat-Salé-Kénitra' => [
                'Rabat',
                'Salé',
                'Kénitra',
                'Témara',
                'Skhirat'
            ],
            'Marrakech-Safi' => [
                'Marrakech',
                'Safi',
                'El Kelaa des Sraghna',
                'Essaouira',
                'Youssoufia'
            ],
            'Tanger-Tétouan-Al Hoceïma' => [
                'Tanger',
                'Tétouan',
                'Larache',
                'Al Hoceïma',
                'Fès'
            ],
            'Fès-Meknès' => [
                'Fès',
                'Meknès',
                'Taza',
                'Sefrou',
                'Moulay Yacoub'
            ],
            'Béni Mellal-Khénifra' => [
                'Béni Mellal',
                'Khénifra',
                'Fquih Ben Salah',
                'Azilal',
                'Khouribga'
            ],
            'Souss-Massa' => [
                'Agadir',
                'Inezgane-Aït Melloul',
                'Tiznit',
                'Taroudant',
                'Oulad Teima'
            ],
            'Oriental' => [
                'Oujda',
                'Nador',
                'Berkane',
                'Taourirt',
                'Jerada'
            ]
        ];

        foreach ($villes as $regionName => $villeNames) {
            $region = Region::where('nom', $regionName)->first();
            if ($region) {
                foreach ($villeNames as $villeName) {
                    Ville::create([
                        'region_id' => $region->id,
                        'nom' => $villeName
                    ]);
                }
            }
        }
    }
} 