<?php
namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index()
    {
        $formations = Formation::with(['ville', 'animateur', 'participants'])->get();
        return response()->json($formations);
    }

    public function store(Request $request)
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