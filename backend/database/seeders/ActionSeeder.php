<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Action;

class ActionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $actions = [
            ['symbole' => 'IAM', 'nom' => 'Maroc Telecom',     'prix_actuel' => 95.5],
            ['symbole' => 'ATW', 'nom' => 'Attijariwafa Bank', 'prix_actuel' => 480.00],
            ['symbole' => 'BCP', 'nom' => 'Banque Populaire', 'prix_actuel' => 265.00],
            ['symbole' => 'CIH', 'nom' => 'CIH Bank',       'prix_actuel' => 340.00],
            ['symbole' => 'LHM', 'nom' => 'LafargeHolcim Maroc',           'prix_actuel' => 1750.00],
        ];

        foreach ($actions as $data) {
            $action = Action::updateOrCreate(['symbole' => $data['symbole']], $data);

            // Premier point de l'historique, une seule fois
            if ($action->historiquePrix()->count() === 0) {
                $action->historiquePrix()->create([
                    'prix' => $action->prix_actuel,
                    'date_prix' => now(),
                ]);
            }
        }
    }
}
