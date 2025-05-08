<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Specialite;

class SpecialiteSeeder extends Seeder
{
    public function run(): void
    {
        $specialites = [
            [
                'nom' => 'Développement Web',
                'description' => 'Formation en développement web (HTML, CSS, JavaScript, PHP, etc.)'
            ],
            [
                'nom' => 'Développement Mobile',
                'description' => 'Formation en développement d\'applications mobiles (Android, iOS)'
            ],
            [
                'nom' => 'Base de données',
                'description' => 'Formation en gestion et administration de bases de données'
            ],
            [
                'nom' => 'Réseaux et Sécurité',
                'description' => 'Formation en réseaux informatiques et sécurité des systèmes'
            ],
            [
                'nom' => 'Intelligence Artificielle',
                'description' => 'Formation en IA, Machine Learning et Deep Learning'
            ],
            [
                'nom' => 'Cloud Computing',
                'description' => 'Formation en services cloud (AWS, Azure, GCP)'
            ],
            [
                'nom' => 'DevOps',
                'description' => 'Formation en pratiques DevOps et outils d\'automatisation'
            ],
            [
                'nom' => 'UI/UX Design',
                'description' => 'Formation en design d\'interface et expérience utilisateur'
            ],
            [
                'nom' => 'Gestion de Projet',
                'description' => 'Formation en méthodologies de gestion de projet (Agile, Scrum)'
            ],
            [
                'nom' => 'Big Data',
                'description' => 'Formation en traitement et analyse de données massives'
            ],
            [
                'nom' => 'Cybersécurité',
                'description' => 'Formation en sécurité informatique et protection des données'
            ],
            [
                'nom' => 'Blockchain',
                'description' => 'Formation en technologies blockchain et crypto-monnaies'
            ]
        ];

        foreach ($specialites as $specialite) {
            Specialite::create($specialite);
        }
    }
} 