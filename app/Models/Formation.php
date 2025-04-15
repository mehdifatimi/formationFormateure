<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'formateur_id',
        'ville_id',
        'filiere_id'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'duree' => 'integer',
        'prix' => 'decimal:2',
        'places_disponibles' => 'integer'
    ];

    /**
     * Get the formateur that owns the formation.
     */
    public function formateur(): BelongsTo
    {
        return $this->belongsTo(Formateur::class);
    }

    /**
     * Get the ville that owns the formation.
     */
    public function ville(): BelongsTo
    {
        return $this->belongsTo(Ville::class);
    }

    /**
     * Get the filiere that owns the formation.
     */
    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    /**
     * Get the participants for the formation.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'formation_participant')
            ->withPivot('statut', 'date_inscription')
            ->withTimestamps();
    }
}
