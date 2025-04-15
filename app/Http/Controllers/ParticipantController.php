<?php
namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function index()
    {
        $participants = Participant::with('formation')->get();
        return response()->json($participants);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:participants',
            'telephone' => 'required|string|max:20',
            'date_naissance' => 'required|date',
            'niveau_etude' => 'required|string',
            'formation_id' => 'required|exists:formations,id',
            'attentes' => 'nullable|string',
            'statut_paiement' => 'required|string|in:en attente,payé,annulé,remboursé'
        ]);

        $participant = Participant::create($request->all());
        return response()->json($participant->load('formation'), 201);
    }

    public function show(Participant $participant)
    {
        return response()->json($participant->load('formation'));
    }

    public function update(Request $request, Participant $participant)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:participants,email,' . $participant->id,
            'telephone' => 'required|string|max:20',
            'date_naissance' => 'required|date',
            'niveau_etude' => 'required|string',
            'formation_id' => 'required|exists:formations,id',
            'attentes' => 'nullable|string',
            'statut_paiement' => 'required|string|in:en attente,payé,annulé,remboursé'
        ]);

        $participant->update($request->all());
        return response()->json($participant->load('formation'));
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();
        return response()->json(null, 204);
    }
} 