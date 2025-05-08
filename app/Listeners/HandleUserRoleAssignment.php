<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Models\Formation;
use Illuminate\Support\Facades\Log;

class HandleUserRoleAssignment
{
    public function handle(UserCreated $event): void
    {
        $user = $event->user;

        try {
            switch ($user->role) {
                case 'participant':
                    // Récupérer toutes les formations actives
                    $formations = Formation::where('statut', 'active')->get();
                    
                    // Attacher le participant à toutes les formations actives
                    foreach ($formations as $formation) {
                        $user->formations()->attach($formation->id, [
                            'statut' => 'en_attente',
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                    break;

                case 'formateur':
                    // Récupérer toutes les formations actives
                    $formations = Formation::where('statut', 'active')->get();
                    
                    // Attacher le formateur à toutes les formations actives
                    foreach ($formations as $formation) {
                        $user->formations_animees()->attach($formation->id, [
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                    break;
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'attribution automatique des formations : ' . $e->getMessage());
        }
    }
} 