<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\FormationValider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FormationValiderController extends Controller
{
    public function store(Request $request, Formation $formation)
    {
        $request->validate([
            'commentaire' => 'nullable|string',
        ]);

        $formationValider = FormationValider::create([
            'formation_id' => $formation->id,
            'drf_id' => Auth::id(),
            'commentaire' => $request->commentaire,
            'date_validation' => now(),
        ]);

        return response()->json($formationValider, 201);
    }

    public function destroy(Formation $formation)
    {
        $formation->formationValider()->delete();
        return response()->json(null, 204);
    }
} 