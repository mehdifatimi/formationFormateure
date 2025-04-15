<?php
namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FormationController extends Controller
{
    public function index()
    {
        try {
            $formations = Formation::with(['formateur', 'ville', 'filiere', 'participants'])->get();
            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des formations'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'duree' => 'required|integer|min:1',
                'niveau' => 'required|string|in:débutant,intermédiaire,avancé',
                'prix' => 'required|numeric|min:0',
                'places_disponibles' => 'required|integer|min:1',
                'statut' => 'required|string|in:à venir,en cours,terminé,annulé',
                'formateur_id' => 'required|exists:formateurs,id',
                'ville_id' => 'required|exists:villes,id',
                'filiere_id' => 'required|exists:filieres,id'
            ]);

            $formation = Formation::create($validated);
            return response()->json($formation->load(['formateur', 'ville', 'filiere']), 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création de la formation'], 500);
        }
    }

    public function show(Formation $formation)
    {
        return response()->json($formation->load(['formateur', 'ville', 'filiere', 'participants']));
    }

    public function update(Request $request, Formation $formation)
    {
        try {
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'duree' => 'required|integer|min:1',
                'niveau' => 'required|string|in:débutant,intermédiaire,avancé',
                'prix' => 'required|numeric|min:0',
                'places_disponibles' => 'required|integer|min:1',
                'statut' => 'required|string|in:à venir,en cours,terminé,annulé',
                'formateur_id' => 'required|exists:formateurs,id',
                'ville_id' => 'required|exists:villes,id',
                'filiere_id' => 'required|exists:filieres,id'
            ]);

            $formation->update($validated);
            return response()->json($formation->load(['formateur', 'ville', 'filiere']));
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
} 