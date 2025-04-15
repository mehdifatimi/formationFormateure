<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Filiere;
use App\Models\Ville;
use App\Models\Animateur;

class FormationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'date_debut' => fake()->dateTimeBetween('now', '+1 month'),
            'date_fin' => fake()->dateTimeBetween('+1 month', '+2 months'),
            'filiere_id' => Filiere::factory(),
            'ville_id' => Ville::factory(),
            'animateur_id' => function () {
                return Animateur::inRandomOrder()->first()->id ?? Animateur::factory()->create()->id;
            },
        ];
    }
} 