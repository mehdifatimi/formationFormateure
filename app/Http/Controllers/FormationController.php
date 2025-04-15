<?php
namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index()
    {
        $formations = Formation::with(['formateur', 'participants'])->get();
        return response()->json($formations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'duree' => 'required|integer|min:1',
            'niveau' => 'required|string|in:débutant,intermédiaire,avancé',
            'prix' => 'required|numeric|min:0',
            'places_disponibles' => 'required|integer|min:1',
            'statut' => 'required|string|in:à venir,en cours,terminé,annulé',
            'formateur_id' => 'required|exists:formateurs,id'
        ]);

        $formation = Formation::create($request->all());
        return response()->json($formation, 201);
    }

    public function show(Formation $formation)
    {
        return response()->json($formation->load(['ville', 'animateur', 'participants']));
    }

    public function update(Request $request, Formation $formation)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after:dateDebut',
            'idAnimateur' => 'required|exists:animateurs,idAnimateur',
            'idVille' => 'required|exists:villes,idVille',
            'status' => 'required'
        ]);

        $formation->update($request->all());
        return response()->json($formation);
    }

    public function destroy(Formation $formation)
    {
        $formation->delete();
        return response()->json(null, 204);
    }
} 