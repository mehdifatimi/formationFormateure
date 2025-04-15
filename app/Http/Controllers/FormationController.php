<?php
namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\User;
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
            Log::info('Début du chargement des formations');
            
            // Vérifier si les tables existent
            if (!Schema::hasTable('formations')) {
                Log::error('La table formations n\'existe pas');
                return response()->json(['message' => 'La table formations n\'existe pas'], 500);
            }

            // Charger les formations avec leurs relations
            $formations = Formation::query()
                ->with([
                    'formateur' => function($query) {
                        $query->select('id', 'nom', 'prenom');
                    },
                    'ville' => function($query) {
                        $query->select('id', 'nom');
                    },
                    'filiere' => function($query) {
                        $query->select('id', 'nom');
                    }
                ])
                ->get();

            Log::info('Formations chargées avec succès', [
                'count' => $formations->count(),
                'first_formation' => $formations->first() ? $formations->first()->toArray() : null
            ]);

            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors du chargement des formations',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Début de la création d\'une formation', ['request_data' => $request->all()]);
            
            DB::beginTransaction();

            // Nettoyer le prix si nécessaire
            $prix = $request->input('prix');
            if (is_string($prix)) {
                $prix = str_replace(['€', ' ', ','], ['', '', '.'], $prix);
            }
            $request->merge(['prix' => $prix]);

            // Valider les données
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'duree' => 'required|integer|min:1',
                'niveau' => 'required|string|in:débutant,intermédiaire,avancé',
                'prix' => 'required|numeric|min:0',
                'places_disponibles' => 'required|integer|min:0',
                'statut' => 'required|string|in:en attente,en cours,terminée,annulée,à venir',
                'formateur_id' => 'required|exists:formateurs,id',
                'ville_id' => 'required|exists:villes,id',
                'filiere_id' => 'required|exists:filieres,id'
            ], [
                'titre.required' => 'Le titre est requis',
                'description.required' => 'La description est requise',
                'date_debut.required' => 'La date de début est requise',
                'date_fin.required' => 'La date de fin est requise',
                'date_fin.after' => 'La date de fin doit être postérieure à la date de début',
                'duree.required' => 'La durée est requise',
                'duree.min' => 'La durée doit être d\'au moins 1 heure',
                'niveau.required' => 'Le niveau est requis',
                'niveau.in' => 'Le niveau doit être débutant, intermédiaire ou avancé',
                'prix.required' => 'Le prix est requis',
                'prix.numeric' => 'Le prix doit être un nombre valide',
                'prix.min' => 'Le prix doit être supérieur ou égal à 0',
                'places_disponibles.required' => 'Le nombre de places disponibles est requis',
                'places_disponibles.min' => 'Le nombre de places disponibles doit être d\'au moins 0',
                'statut.required' => 'Le statut est requis',
                'statut.in' => 'Le statut doit être en attente, en cours, terminée, annulée ou à venir',
                'formateur_id.required' => 'Le formateur est requis',
                'formateur_id.exists' => 'Le formateur sélectionné n\'existe pas',
                'ville_id.required' => 'La ville est requise',
                'ville_id.exists' => 'La ville sélectionnée n\'existe pas',
                'filiere_id.required' => 'La filière est requise',
                'filiere_id.exists' => 'La filière sélectionnée n\'existe pas'
            ]);

            // Ajouter le statut de validation par défaut
            $validated['validation_status'] = 'en attente';

            Log::info('Données validées avec succès', ['validated_data' => $validated]);

            // Vérifier si les relations existent
            if (!Schema::hasTable('formateurs') || !Schema::hasTable('villes') || !Schema::hasTable('filieres')) {
                throw new \Exception('Une ou plusieurs tables de relations n\'existent pas');
            }

            // Vérifier les clés étrangères
            $formateurExists = DB::table('formateurs')->where('id', $validated['formateur_id'])->exists();
            $villeExists = DB::table('villes')->where('id', $validated['ville_id'])->exists();
            $filiereExists = DB::table('filieres')->where('id', $validated['filiere_id'])->exists();

            if (!$formateurExists || !$villeExists || !$filiereExists) {
                throw new \Exception('Une ou plusieurs relations n\'existent pas');
            }

            // Créer la formation
            $formation = Formation::create($validated);

            Log::info('Formation créée avec succès', ['formation' => $formation->toArray()]);

            DB::commit();
            return response()->json($formation, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Erreur de validation lors de la création de la formation', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création de la formation', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Erreur lors de la création de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Formation $formation)
    {
        try {
            return response()->json($formation);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération de la formation'], 500);
        }
    }

    public function update(Request $request, Formation $formation)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'duree' => 'required|integer|min:1',
                'niveau' => 'required|string|in:débutant,intermédiaire,avancé',
                'prix' => 'required|numeric|min:0',
                'places_disponibles' => 'required|integer|min:0',
                'statut' => 'required|string|in:en attente,en cours,terminée,annulée',
                'formateur_id' => 'required|exists:formateurs,id',
                'ville_id' => 'required|exists:villes,id',
                'filiere_id' => 'required|exists:filieres,id'
            ]);

            $formation->update($validated);

            DB::commit();
            return response()->json($formation);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour de la formation: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la mise à jour de la formation'], 500);
        }
    }

    public function destroy(Formation $formation)
    {
        try {
            DB::beginTransaction();
            
            $formation->delete();
            
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression de la formation: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la suppression de la formation'], 500);
        }
    }

    public function validate(Formation $formation)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $formation->validate($user);
            return response()->json($formation->load(['formateur', 'ville', 'filiere', 'validator']));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la validation de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la validation de la formation'], 500);
        }
    }

    public function reject(Request $request, Formation $formation)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $validated = $request->validate([
                'reason' => 'required|string'
            ]);

            $formation->reject($user, $validated['reason']);
            return response()->json($formation->load(['formateur', 'ville', 'filiere', 'validator']));
        } catch (\Exception $e) {
            Log::error('Erreur lors du rejet de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du rejet de la formation'], 500);
        }
    }

    public function pendingValidations()
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $formations = Formation::pendingValidation()
                ->with(['formateur', 'ville', 'filiere'])
                ->get();

            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations en attente: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des formations en attente'], 500);
        }
    }
} 