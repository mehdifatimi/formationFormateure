<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'specialites',
        'bio',
        'photo',
        'linkedin',
        'disponible'
    ];

    protected $casts = [
        'disponible' => 'boolean',
        'specialites' => 'array'
    ];

    public function formations()
    {
        return $this->hasMany(Formation::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->prenom} {$this->nom}";
    }
}
