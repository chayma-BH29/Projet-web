<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Position extends Model
{
    protected $fillable = ['portefeuille_id', 'action_id', 'quantite', 'prix_moyen'];

    protected $casts = [
        'prix_moyen' => 'decimal:2',
    ];

    public function portefeuille(): BelongsTo
    {
        return $this->belongsTo(Portefeuille::class);
    }

    public function action(): BelongsTo
    {
        return $this->belongsTo(Action::class);
    }

}
