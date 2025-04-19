<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FormationParticipantSeeder extends Seeder
{
    public function run()
    {
        // Récupérer toutes les formations
        $formations = Formation::all();
        
        if ($formations->isEmpty()) {
            $this->command->info('Aucune formation trouvée. Veuillez exécuter FormationSeeder d\'abord.');
            return;
        }
        
        // Récupérer tous les participants
        $participants = User::where('role', 'participant')->get();
        
        if ($participants->isEmpty()) {
            $this->command->info('Aucun participant trouvé. Veuillez exécuter UserSeeder d\'abord.');
            return;
        }
        
        // Associer des participants aux formations
        foreach ($formations as $formation) {
            // Sélectionner aléatoirement 2 à 4 participants pour chaque formation
            $nombreParticipants = rand(2, 4);
            $participantsSelectionnes = $participants->random(min($nombreParticipants, $participants->count()));
            
            foreach ($participantsSelectionnes as $participant) {
                // Vérifier si l'association existe déjà
                $existe = DB::table('formation_participant')
                    ->where('formation_id', $formation->id)
                    ->where('participant_id', $participant->id)
                    ->exists();
                
                if (!$existe) {
                    // Créer l'association avec un statut aléatoire
                    $statuts = ['en_attente', 'inscrit', 'termine', 'annule'];
                    $statut = $statuts[array_rand($statuts)];
                    
                    DB::table('formation_participant')->insert([
                        'formation_id' => $formation->id,
                        'participant_id' => $participant->id,
                        'statut' => $statut,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
} 