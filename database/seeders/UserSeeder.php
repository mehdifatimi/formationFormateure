<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    public function run()
    {
        try {
            // Récupérer les rôles existants
            $adminRole = Role::where('slug', 'admin')->firstOrFail();
            $formateurRole = Role::where('slug', 'formateur_animateur')->firstOrFail();
            $participantRole = Role::where('slug', 'formateur_participant')->firstOrFail();

            // Vérifier si la table est vide
            if (User::count() === 0) {
                // Create admin user
                $admin = User::create([
                    'name' => 'Admin User',
                    'email' => 'admin@example.com',
                    'password' => Hash::make('admin123'),
                    'role' => 'admin'
                ]);
                $admin->syncRoles([$adminRole]);
                Log::info('Admin user created', ['email' => $admin->email]);

                // Create formateurs
                $formateurs = [
                    [
                        'name' => 'Jean Dupont',
                        'email' => 'jean.dupont@example.com',
                        'password' => Hash::make('password123'),
                        'role' => 'formateur',
                        'specialite' => 'Développement Web',
                    ],
                    [
                        'name' => 'Marie Martin',
                        'email' => 'marie.martin@example.com',
                        'password' => Hash::make('password123'),
                        'role' => 'formateur',
                        'specialite' => 'Design UI/UX',
                    ],
                ];

                foreach ($formateurs as $formateurData) {
                    $formateur = User::create($formateurData);
                    $formateur->syncRoles([$formateurRole]);
                }

                // Create participants
                $participants = [
                    [
                        'name' => 'Lucas Petit',
                        'email' => 'lucas.petit@example.com',
                        'password' => Hash::make('password123'),
                        'role' => 'participant',
                    ],
                    [
                        'name' => 'Emma Robert',
                        'email' => 'emma.robert@example.com',
                        'password' => Hash::make('password123'),
                        'role' => 'participant',
                    ],
                ];

                foreach ($participants as $participantData) {
                    $participant = User::create($participantData);
                    $participant->syncRoles([$participantRole]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in UserSeeder: ' . $e->getMessage());
            throw $e;
        }
    }
} 