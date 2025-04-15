<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'duree',
        'niveau',
        'prix',
        'places_disponibles',
        'statut',
        'formateur_id'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'prix' => 'decimal:2'
    ];

    /**
     * Get the formateur that owns the formation.
     */
    public function formateur(): BelongsTo
    {
        return $this->belongsTo(Formateur::class);
    }

    /**
     * Get the participants for the formation.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }
}
