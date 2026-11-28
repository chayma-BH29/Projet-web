<?php

namespace App\Services;

use App\Models\Action;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ActionService
{
    public function creer(array $data): Action
    {
        return DB::transaction(function () use ($data) {
            $action = Action::create($data);
            $this->enregistrerPrix($action);

            return $action;
        });
    }

    public function modifier(Action $action, array $data): Action
    {
        return DB::transaction(function () use ($action, $data) {
            $ancienPrix = (float) $action->prix_actuel;

            $action->update($data);

            // On n'historise que si le prix a réellement changé
            if ((float) $action->prix_actuel !== $ancienPrix) {
                $this->enregistrerPrix($action);
            }

            return $action;
        });
    }

    public function supprimer(Action $action): void
    {
        if ($action->positions()->exists() || $action->transactions()->exists()) {
            throw ValidationException::withMessages([
                'action' => ['Suppression impossible : cette action est détenue ou a déjà été échangée.'],
            ]);
        }

        $action->delete();
    }

    private function enregistrerPrix(Action $action): void
    {
        $action->historiquePrix()->create([
            'prix' => $action->prix_actuel,
            'date_prix' => now(),
        ]);
    }

    public function simulerMarche(float $amplitude = 0.03): int
{
    return DB::transaction(function () use ($amplitude) {
        $actions = Action::lockForUpdate()->get();

        foreach ($actions as $action) {
            // variation aléatoire entre -3 % et +3 %
            $variation = (mt_rand() / mt_getrandmax() * 2 - 1) * $amplitude;
            $nouveauPrix = max(1, round((float) $action->prix_actuel * (1 + $variation), 2));

            $action->update(['prix_actuel' => $nouveauPrix]);
            $this->enregistrerPrix($action);
        }

        return $actions->count();
    });
}

}