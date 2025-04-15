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
        'filiere_id',
        'validation_status',
        'validated_by',
        'validated_at'
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
        'prix' => 'float',
        'places_disponibles' => 'integer',
        'validated_at' => 'datetime'
    ];

    protected $attributes = [
        'statut' => 'en attente'
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
     * Get the validator that owns the formation.
     */
    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
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

    public function scopePendingValidation($query)
    {
        return $query->where('validation_status', 'en attente');
    }

    public function scopeValidated($query)
    {
        return $query->where('validation_status', 'validé');
    }

    public function scopeRejected($query)
    {
        return $query->where('validation_status', 'rejeté');
    }

    public function validate(User $validator)
    {
        if ($validator->role !== 'admin') {
            throw new \Exception('Seuls les administrateurs peuvent valider les formations');
        }

        $this->update([
            'validation_status' => 'validé',
            'validated_by' => $validator->id,
            'validated_at' => now()
        ]);
    }

    public function reject(User $validator, string $reason = null)
    {
        if ($validator->role !== 'admin') {
            throw new \Exception('Seuls les administrateurs peuvent rejeter les formations');
        }

        $this->update([
            'validation_status' => 'rejeté',
            'validated_by' => $validator->id,
            'validated_at' => now()
        ]);
    }
}
