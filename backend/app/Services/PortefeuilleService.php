<?php

namespace App\Services;

use App\Models\Portefeuille;
use App\Models\User;

class PortefeuilleService
{
    public const SOLDE_INITIAL = 100000;

    public function creerPourUtilisateur(User $user): Portefeuille
    {
        return $user->portefeuille()->create([
            'solde' => self::SOLDE_INITIAL,
        ]);
    }
}