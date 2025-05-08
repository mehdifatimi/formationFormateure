<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;
use App\Models\FormationValider;
use App\Models\User;
use Spatie\Permission\Models\Role;

class FormationValiderSeeder extends Seeder
{
    public function run()
    {
        // Récupérer un DRF pour la validation
        $drf = User::whereHas('roles', function ($query) {
            $query->where('name', 'drf');
        })->first();

        if (!$drf) {
            $this->command->info('Aucun DRF trouvé. Création d\'un DRF de test...');
            $drf = User::create([
                'name' => 'DRF Test',
                'email' => 'drf@test.com',
                'password' => bcrypt('password'),
            ]);
            
            // Assigner le rôle DRF
            $role = Role::where('name', 'drf')->first();
            if ($role) {
                $drf->roles()->attach($role->id);
            }
        }

        // Récupérer les formations validées
        $formations = Formation::where('statut', 'validee')->get();

        foreach ($formations as $formation) {
            // Vérifier si la formation n'est pas déjà dans formation_valider
            if (!$formation->formationValider()->exists()) {
                // Créer l'entrée dans formation_valider
                FormationValider::create([
                    'formation_id' => $formation->id,
                    'drf_id' => $drf->id,
                    'commentaire' => 'Validée par le système',
                    'date_validation' => now(),
                ]);

                $this->command->info("Formation {$formation->titre} validée avec succès");
            }
        }

        $this->command->info('Toutes les formations ont été traitées');
    }
} 