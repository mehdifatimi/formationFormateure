<?php
namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function index()
    {
        $participants = Participant::with(['user', 'formation'])->get();
        return response()->json($participants);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idParticipant' => 'required|unique:participants',
            'idFormation' => 'required|exists:formations,id',
            'idIsta' => 'required',
            'dateFin' => 'required|date',
            'idUser' => 'required|exists:users,idUser'
        ]);

        $participant = Participant::create($request->all());
        return response()->json($participant, 201);
    }

    public function show(Participant $participant)
    {
        return response()->json($participant->load(['user', 'formation']));
    }

    public function update(Request $request, Participant $participant)
    {
        $request->validate([
            'idParticipant' => 'required|unique:participants,idParticipant,' . $participant->id,
            'idFormation' => 'required|exists:formations,id',
            'idIsta' => 'required',
            'dateFin' => 'required|date',
            'idUser' => 'required|exists:users,idUser'
        ]);

        $participant->update($request->all());
        return response()->json($participant);
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();
        return response()->json(null, 204);
    }
} 