<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private PortefeuilleService $portefeuilles)
    {
    }

    public function inscrire(array $data): array
    {
        // Tout réussit ou rien n'est créé
        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'], // haché par le cast "hashed"
            ]);

            $this->portefeuilles->creerPourUtilisateur($user);

            return $user;
        });

        return $this->reponse($user);
    }

    public function connecter(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        return $this->reponse($user);
    }

    private function reponse(User $user): array
    {
        return [
            'user' => $user->load('portefeuille'),
            'token' => $user->createToken('auth')->plainTextToken,
        ];
    }
}