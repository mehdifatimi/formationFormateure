<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profil;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participants = [
            [
                'nom' => 'Leroy',
                'prenom' => 'Emma',
                'email' => 'emma.leroy@example.com',
                'telephone' => '0678901234',
                'entreprise' => 'Tech Solutions',
                'poste' => 'Développeur Junior',
                'linkedin' => 'https://www.linkedin.com/in/emma-leroy',
                'password' => Hash::make('password123'),
            ],
            [
                'nom' => 'Moreau',
                'prenom' => 'Lucas',
                'email' => 'lucas.moreau@example.com',
                'telephone' => '0689012345',
                'entreprise' => 'Digital Agency',
                'poste' => 'Designer UI',
                'linkedin' => 'https://www.linkedin.com/in/lucas-moreau',
                'password' => Hash::make('password123'),
            ],
            [
                'nom' => 'Simon',
                'prenom' => 'Chloé',
                'email' => 'chloe.simon@example.com',
                'telephone' => '0690123456',
                'entreprise' => 'Data Corp',
                'poste' => 'Analyste de données',
                'linkedin' => 'https://www.linkedin.com/in/chloe-simon',
                'password' => Hash::make('password123'),
            ],
            [
                'nom' => 'Laurent',
                'prenom' => 'Antoine',
                'email' => 'antoine.laurent@example.com',
                'telephone' => '0601234567',
                'entreprise' => 'Project Management Inc',
                'poste' => 'Chef de projet',
                'linkedin' => 'https://www.linkedin.com/in/antoine-laurent',
                'password' => Hash::make('password123'),
            ],
            [
                'nom' => 'Dubois',
                'prenom' => 'Julie',
                'email' => 'julie.dubois@example.com',
                'telephone' => '0612345678',
                'entreprise' => 'Security Systems',
                'poste' => 'Analyste sécurité',
                'linkedin' => 'https://www.linkedin.com/in/julie-dubois',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($participants as $participant) {
            try {
                // Créer l'utilisateur
                $user = User::create([
                    'name' => $participant['prenom'] . ' ' . $participant['nom'],
                    'email' => $participant['email'],
                    'password' => $participant['password'],
                ]);

                // Créer le profil
                Profil::create([
                    'user_id' => $user->id,
                    'nom' => $participant['nom'],
                    'prenom' => $participant['prenom'],
                    'telephone' => $participant['telephone'],
                    'entreprise' => $participant['entreprise'],
                    'poste' => $participant['poste'],
                    'linkedin' => $participant['linkedin'],
                ]);

                Log::info('Participant créé avec succès: ' . $participant['prenom'] . ' ' . $participant['nom']);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la création du participant: ' . $e->getMessage(), [
                    'participant' => $participant,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
    }
} 