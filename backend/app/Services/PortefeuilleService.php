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

    public function resume(User $user): array
{
    $portefeuille = $user->portefeuille()->with('positions.action')->firstOrFail();

    $positions = $portefeuille->positions->map(function ($p) {
        $prixActuel = (float) $p->action->prix_actuel;
        $prixMoyen = (float) $p->prix_moyen;

        $valeur = round($prixActuel * $p->quantite, 2);
        $investi = round($prixMoyen * $p->quantite, 2);
        $gain = round($valeur - $investi, 2);

        return [
            'action_id' => $p->action_id,
            'symbole' => $p->action->symbole,
            'nom' => $p->action->nom,
            'quantite' => $p->quantite,
            'prix_moyen' => $prixMoyen,
            'prix_actuel' => $prixActuel,
            'valeur_actuelle' => $valeur,
            'gain' => $gain,
            'gain_pourcentage' => $investi > 0 ? round($gain / $investi * 100, 2) : 0,
        ];
    })->values();

    $solde = (float) $portefeuille->solde;
    $valeurPositions = round($positions->sum('valeur_actuelle'), 2);
    $valeurTotale = round($solde + $valeurPositions, 2);

    return [
        'solde' => $solde,
        'valeur_positions' => $valeurPositions,
        'valeur_totale' => $valeurTotale,
        'gain_global' => round($valeurTotale - self::SOLDE_INITIAL, 2),
        'positions' => $positions,
    ];
}

    public function historique(User $user)
{
    return $user->portefeuille()->firstOrFail()
        ->transactions()
        ->with('action:id,symbole,nom')
        ->orderByDesc('date_transaction')
        ->orderByDesc('id')
        ->get();
}
}