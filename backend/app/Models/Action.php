<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Action extends Model
{
    protected $fillable = ['symbole', 'nom', 'prix_actuel'];

    protected $casts = [
        'prix_actuel' => 'decimal:2',
    ];

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function historiquePrix(): HasMany
    {
        return $this->hasMany(HistoriquePrix::class);
    }

}
