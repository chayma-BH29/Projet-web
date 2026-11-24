<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Compte administrateur (le rôle est assigné explicitement, il n'est pas "fillable")
        $admin = User::firstOrNew(['email' => 'admin@bourse.ma']);
        $admin->name = 'Administrateur';
        $admin->password = Hash::make('admin1234');
        $admin->role = 'admin';
        $admin->save();

        $this->call(ActionSeeder::class);
    }
}
