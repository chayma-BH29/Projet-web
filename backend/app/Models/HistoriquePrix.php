<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriquePrix extends Model
{
    protected $table = 'historique_prix';

    protected $fillable = ['action_id', 'prix', 'date_prix'];

    protected $casts = [
        'prix' => 'decimal:2',
        'date_prix' => 'datetime',
    ];

    public function action(): BelongsTo
    {
        return $this->belongsTo(Action::class);
    }
}
