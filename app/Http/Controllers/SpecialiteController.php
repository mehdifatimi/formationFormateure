<?php

namespace App\Http\Controllers;

use App\Models\Specialite;
use Illuminate\Http\Request;

class SpecialiteController extends Controller
{
    public function index()
    {
        $specialites = Specialite::all();
        return response()->json($specialites);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $specialite = Specialite::create($request->all());
        return response()->json($specialite, 201);
    }
} 