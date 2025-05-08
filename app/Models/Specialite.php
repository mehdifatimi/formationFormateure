<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialite extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description'];

    public function formateurs()
    {
        return $this->belongsToMany(User::class, 'formateur_specialite', 'specialite_id', 'formateur_id')
            ->withTimestamps();
    }
} 