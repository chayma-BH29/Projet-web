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
}