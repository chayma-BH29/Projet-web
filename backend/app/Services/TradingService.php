<?php

namespace App\Services;

use App\Models\Action;
use App\Models\Portefeuille;
use App\Models\Position;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TradingService
{
    public function acheter(User $user, int $actionId, int $quantite): Transaction
    {
        return DB::transaction(function () use ($user, $actionId, $quantite) {
            $portefeuille = $this->portefeuilleVerrouille($user);
            $action = Action::findOrFail($actionId);

            $prix = (float) $action->prix_actuel;
            $cout = round($prix * $quantite, 2);

            if ((float) $portefeuille->solde < $cout) {
                throw ValidationException::withMessages([
                    'quantite' => ['Solde insuffisant pour cet achat.'],
                ]);
            }

            $portefeuille->solde = round((float) $portefeuille->solde - $cout, 2);
            $portefeuille->save();

            $position = Position::where('portefeuille_id', $portefeuille->id)
                ->where('action_id', $action->id)
                ->lockForUpdate()
                ->first();

            if ($position) {
                $nouvelleQuantite = $position->quantite + $quantite;
                $prixMoyen = (($position->quantite * (float) $position->prix_moyen) + $cout) / $nouvelleQuantite;

                $position->update([
                    'quantite' => $nouvelleQuantite,
                    'prix_moyen' => round($prixMoyen, 2),
                ]);
            } else {
                Position::create([
                    'portefeuille_id' => $portefeuille->id,
                    'action_id' => $action->id,
                    'quantite' => $quantite,
                    'prix_moyen' => $prix,
                ]);
            }

            return $this->enregistrer($portefeuille, $action, 'achat', $quantite, $prix);
        });
    }

    public function vendre(User $user, int $actionId, int $quantite): Transaction
    {
        return DB::transaction(function () use ($user, $actionId, $quantite) {
            $portefeuille = $this->portefeuilleVerrouille($user);
            $action = Action::findOrFail($actionId);

            $position = Position::where('portefeuille_id', $portefeuille->id)
                ->where('action_id', $action->id)
                ->lockForUpdate()
                ->first();

            if (! $position || $position->quantite < $quantite) {
                throw ValidationException::withMessages([
                    'quantite' => ['Quantité insuffisante : vous ne détenez pas assez de cette action.'],
                ]);
            }

            $prix = (float) $action->prix_actuel;

            $portefeuille->solde = round((float) $portefeuille->solde + $prix * $quantite, 2);
            $portefeuille->save();

            if ($position->quantite === $quantite) {
                $position->delete();
            } else {
                $position->update(['quantite' => $position->quantite - $quantite]);
            }

            return $this->enregistrer($portefeuille, $action, 'vente', $quantite, $prix);
        });
    }

    private function portefeuilleVerrouille(User $user): Portefeuille
    {
        return Portefeuille::where('user_id', $user->id)->lockForUpdate()->firstOrFail();
    }

    private function enregistrer(Portefeuille $portefeuille, Action $action, string $type, int $quantite, float $prix): Transaction
    {
        return Transaction::create([
            'portefeuille_id' => $portefeuille->id,
            'action_id' => $action->id,
            'type' => $type,
            'quantite' => $quantite,
            'prix_unitaire' => $prix,
            'date_transaction' => now(),
        ]);
    }
}