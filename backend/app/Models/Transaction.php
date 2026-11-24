<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    
    protected $fillable = [
        'portefeuille_id', 'action_id', 'type',
        'quantite', 'prix_unitaire', 'date_transaction',
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
        'date_transaction' => 'datetime',
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
