<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formateur;
use Illuminate\Support\Facades\Log;

class FormateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formateurs = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@example.com',
                'telephone' => '0612345678',
                'specialites' => ['Développement Web', 'DevOps'],
                'bio' => 'Formateur expérimenté en développement web avec plus de 10 ans d\'expérience.',
                'linkedin' => 'https://www.linkedin.com/in/jean-dupont',
                'disponible' => true,
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Sophie',
                'email' => 'sophie.martin@example.com',
                'telephone' => '0623456789',
                'specialites' => ['Design UX/UI', 'Marketing Digital'],
                'bio' => 'Designer UX/UI passionnée par l\'expérience utilisateur et le design d\'interface.',
                'linkedin' => 'https://www.linkedin.com/in/sophie-martin',
                'disponible' => true,
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'email' => 'pierre.bernard@example.com',
                'telephone' => '0634567890',
                'specialites' => ['Data Science', 'Intelligence Artificielle'],
                'bio' => 'Expert en science des données et intelligence artificielle avec une solide expérience en analyse prédictive.',
                'linkedin' => 'https://www.linkedin.com/in/pierre-bernard',
                'disponible' => true,
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Marie',
                'email' => 'marie.petit@example.com',
                'telephone' => '0645678901',
                'specialites' => ['Gestion de Projet', 'Marketing Digital'],
                'bio' => 'Gestionnaire de projet certifiée PMP avec une expertise en méthodologies agiles.',
                'linkedin' => 'https://www.linkedin.com/in/marie-petit',
                'disponible' => true,
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Thomas',
                'email' => 'thomas.robert@example.com',
                'telephone' => '0656789012',
                'specialites' => ['Cybersécurité', 'DevOps'],
                'bio' => 'Expert en cybersécurité avec une spécialisation en sécurité des applications web.',
                'linkedin' => 'https://www.linkedin.com/in/thomas-robert',
                'disponible' => true,
            ],
        ];

        foreach ($formateurs as $formateur) {
            try {
                Formateur::create($formateur);
                Log::info('Formateur créé avec succès: ' . $formateur['prenom'] . ' ' . $formateur['nom']);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la création du formateur: ' . $e->getMessage(), [
                    'formateur' => $formateur,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
    }
} 