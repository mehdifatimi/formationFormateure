<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationValider extends Model
{
    use HasFactory;

    protected $table = 'formation_valider';

    protected $fillable = [
        'formation_id',
        'drf_id',
        'commentaire',
        'date_validation'
    ];

    protected $casts = [
        'date_validation' => 'datetime'
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function drf()
    {
        return $this->belongsTo(User::class, 'drf_id');
    }
} 