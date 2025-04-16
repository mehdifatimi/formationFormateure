<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Absence;
use App\Models\Participant;
use App\Models\Formation;
use Carbon\Carbon;

class AbsenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer quelques participants et formations existants
        $participants = Participant::take(3)->get();
        $formations = Formation::take(3)->get();

        if ($participants->isEmpty() || $formations->isEmpty()) {
            $this->command->info('Veuillez d\'abord créer des participants et des formations.');
            return;
        }

        // Créer des absences de test
        $reasons = [
            'Maladie',
            'Rendez-vous médical',
            'Problème de transport',
            'Raison familiale',
            'Autre'
        ];

        $statuses = ['justified', 'unjustified'];

        foreach ($participants as $participant) {
            foreach ($formations as $formation) {
                // Créer 1-3 absences par participant/formation
                $numberOfAbsences = rand(1, 3);
                
                for ($i = 0; $i < $numberOfAbsences; $i++) {
                    $date = Carbon::now()->subDays(rand(1, 30));
                    
                    Absence::create([
                        'participant_id' => $participant->id,
                        'formation_id' => $formation->id,
                        'date' => $date,
                        'reason' => $reasons[array_rand($reasons)],
                        'status' => $statuses[array_rand($statuses)]
                    ]);
                }
            }
        }
    }
}
