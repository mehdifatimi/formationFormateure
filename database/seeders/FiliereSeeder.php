<?php

namespace Database\Seeders;

use App\Models\Filiere;
use App\Models\CDC;
use Illuminate\Database\Seeder;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        $filieres = [
            'Développement Web' => [
                'description' => 'Formation complète en développement web front-end et back-end',
                'cdc_id' => 1
            ],
            'Intelligence Artificielle' => [
                'description' => 'Formation en IA, machine learning et deep learning',
                'cdc_id' => 1
            ],
            'Cybersécurité' => [
                'description' => 'Formation en sécurité informatique et protection des données',
                'cdc_id' => 1
            ],
            'Cloud Computing' => [
                'description' => 'Formation en services cloud et infrastructure as a service',
                'cdc_id' => 1
            ],
            'DevOps' => [
                'description' => 'Formation en intégration continue et déploiement continu',
                'cdc_id' => 1
            ],
            'Data Science' => [
                'description' => 'Formation en analyse de données et visualisation',
                'cdc_id' => 1
            ],
            'Réseaux' => [
                'description' => 'Formation en administration système et réseaux',
                'cdc_id' => 1
            ],
            'Systèmes Embarqués' => [
                'description' => 'Formation en développement de systèmes embarqués',
                'cdc_id' => 1
            ],
            'Design UX/UI' => [
                'description' => 'Formation en design d\'interface utilisateur et expérience utilisateur',
                'cdc_id' => 1
            ],
            'Marketing Digital' => [
                'description' => 'Formation en stratégies de marketing digital et réseaux sociaux',
                'cdc_id' => 1
            ]
        ];

        foreach ($filieres as $nom => $details) {
            Filiere::create([
                'nom' => $nom,
                'description' => $details['description'],
                'cdc_id' => $details['cdc_id']
            ]);
        }
    }
} 