<?php
namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ParticipantController extends Controller
{
    public function index()
    {
        try {
            $participants = Participant::all();
            return response()->json($participants);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des participants: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des participants'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::info('Données reçues pour la création du participant:', $request->all());

            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:participants',
                'telephone' => 'required|string|max:20',
                'date_naissance' => 'required|date',
                'niveau_etude' => 'required|string',
                'attentes' => 'nullable|string',
                'statut_paiement' => 'required|string|in:en attente,payé,annulé,remboursé'
            ]);

            Log::info('Données validées:', $validated);

            // Convertir la date au format Y-m-d
            $validated['date_naissance'] = date('Y-m-d', strtotime($validated['date_naissance']));

            $participant = Participant::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'],
                'date_naissance' => $validated['date_naissance'],
                'niveau_etude' => $validated['niveau_etude'],
                'attentes' => $validated['attentes'] ?? null,
                'statut_paiement' => $validated['statut_paiement']
            ]);

            Log::info('Participant créé:', ['id' => $participant->id]);

            DB::commit();
            return response()->json($participant, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Erreur de validation:', $e->errors());
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du participant: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la création du participant: ' . $e->getMessage()], 500);
        }
    }

    public function show(Participant $participant)
    {
        try {
            return response()->json($participant);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du participant: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération du participant'], 500);
        }
    }

    public function update(Request $request, Participant $participant)
    {
        try {
            DB::beginTransaction();

            Log::info('Données reçues pour la mise à jour du participant:', $request->all());

            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:participants,email,' . $participant->id,
                'telephone' => 'required|string|max:20',
                'date_naissance' => 'required|date',
                'niveau_etude' => 'required|string',
                'attentes' => 'nullable|string',
                'statut_paiement' => 'required|string|in:en attente,payé,annulé,remboursé'
            ]);

            Log::info('Données validées:', $validated);

            // Convertir la date au format Y-m-d
            $validated['date_naissance'] = date('Y-m-d', strtotime($validated['date_naissance']));

            $participant->update([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'],
                'date_naissance' => $validated['date_naissance'],
                'niveau_etude' => $validated['niveau_etude'],
                'attentes' => $validated['attentes'] ?? null,
                'statut_paiement' => $validated['statut_paiement']
            ]);

            Log::info('Participant mis à jour:', ['id' => $participant->id]);

            DB::commit();
            return response()->json($participant);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Erreur de validation:', $e->errors());
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour du participant: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la mise à jour du participant: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Participant $participant)
    {
        try {
            DB::beginTransaction();
            
            Log::info('Suppression du participant:', ['id' => $participant->id]);
            
            $participant->delete();
            
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression du participant: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la suppression du participant'], 500);
        }
    }

    public function attachFormation(Request $request, Participant $participant)
    {
        try {
            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id',
                'statut' => 'required|string|in:en attente,inscrit,annulé'
            ]);

            $participant->formations()->attach($validated['formation_id'], [
                'statut' => $validated['statut'],
                'date_inscription' => now()
            ]);

            return response()->json($participant->load('formations'));
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'inscription à la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'inscription à la formation'], 500);
        }
    }

    public function detachFormation(Request $request, Participant $participant)
    {
        try {
            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id'
            ]);

            $participant->formations()->detach($validated['formation_id']);

            return response()->json($participant->load('formations'));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la désinscription de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la désinscription de la formation'], 500);
        }
    }

    public function updateFormationStatus(Request $request, Participant $participant)
    {
        try {
            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id',
                'statut' => 'required|string|in:en attente,inscrit,annulé'
            ]);

            $participant->formations()->updateExistingPivot($validated['formation_id'], [
                'statut' => $validated['statut']
            ]);

            return response()->json($participant->load('formations'));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du statut: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la mise à jour du statut'], 500);
        }
    }
} 