<?php
namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\User;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FormationController extends Controller
{
    public function index()
    {
        try {
            $formations = Formation::with([
                'formateur',
                'participants' => function($query) {
                    $query->select('participants.id', 'nom', 'prenom', 'email');
                },
                'absences' => function($query) {
                    $query->with('participant:id,nom,prenom');
                }
            ])->get();
            
            Log::info('Formations chargées avec succès', ['count' => $formations->count()]);
            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des formations'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'formateur_id' => 'required|exists:users,id',
                'places_disponibles' => 'required|integer|min:1',
            ]);

            $formation = Formation::create([
                ...$request->all(),
                'created_by' => auth()->id(),
                'statut' => 'en_attente'
            ]);

            return response()->json($formation->load(['formateur', 'participants']), 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création de la formation'], 500);
        }
    }

    public function show(Formation $formation)
    {
        try {
            return response()->json($formation->load(['formateur', 'participants']));
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement de la formation'], 500);
        }
    }

    public function update(Request $request, Formation $formation)
    {
        try {
            $request->validate([
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'date_debut' => 'sometimes|required|date',
                'date_fin' => 'sometimes|required|date|after:date_debut',
                'formateur_id' => 'sometimes|required|exists:users,id',
                'places_disponibles' => 'sometimes|required|integer|min:1',
            ]);

            $formation->update($request->all());
            return response()->json($formation->load(['formateur', 'participants']));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la mise à jour de la formation'], 500);
        }
    }

    public function destroy(Formation $formation)
    {
        try {
            $formation->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression de la formation'], 500);
        }
    }

    public function validate(Formation $formation)
    {
        try {
            $formation->update(['statut' => 'validee']);
            return response()->json($formation);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la validation de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la validation de la formation'], 500);
        }
    }

    public function reject(Request $request, Formation $formation)
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string'
            ]);

            $formation->update([
                'statut' => 'rejetee',
                'rejection_reason' => $validated['reason']
            ]);
            return response()->json($formation->load(['formateur', 'participants']));
        } catch (\Exception $e) {
            Log::error('Erreur lors du rejet de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du rejet de la formation'], 500);
        }
    }

    public function pendingValidations()
    {
        try {
            $formations = Formation::where('statut', 'en_attente')
                ->with(['formateur', 'participants'])
                ->get();

            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations en attente: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des formations en attente'], 500);
        }
    }

    public function addParticipant(Formation $formation, $participantId)
    {
        try {
            DB::beginTransaction();
            
            // Vérifier si le participant existe
            $participant = Participant::find($participantId);
            
            if (!$participant) {
                return response()->json([
                    'message' => 'Participant non trouvé'
                ], 404);
            }

            // Vérifier si le participant n'est pas déjà inscrit
            if ($formation->participants()->where('participant_id', $participantId)->exists()) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Le participant est déjà inscrit à cette formation'
                ], 422);
            }

            // Vérifier les places disponibles
            if ($formation->participants()->count() >= $formation->places_disponibles) {
                DB::rollBack();
                return response()->json([
                    'message' => 'La formation est complète'
                ], 422);
            }

            // Ajouter le participant
            $formation->participants()->attach($participantId, [
                'statut' => 'en_attente',
                'date_inscription' => now()
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Participant ajouté avec succès',
                'formation' => $formation->load(['formateur', 'participants'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'ajout du participant: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'ajout du participant',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}