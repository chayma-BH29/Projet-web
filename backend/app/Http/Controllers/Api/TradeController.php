<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TradeRequest;
use App\Services\TradingService;
use Illuminate\Http\JsonResponse;

class TradeController extends Controller
{
    public function __construct(private TradingService $trading)
    {
    }

    public function acheter(TradeRequest $request): JsonResponse
    {
        $transaction = $this->trading->acheter(
            $request->user(),
            $request->validated('action_id'),
            $request->validated('quantite')
        );

        return $this->reponse($transaction, $request->user());
    }

    public function vendre(TradeRequest $request): JsonResponse
    {
        $transaction = $this->trading->vendre(
            $request->user(),
            $request->validated('action_id'),
            $request->validated('quantite')
        );

        return $this->reponse($transaction, $request->user());
    }

    private function reponse($transaction, $user): JsonResponse
    {
        return response()->json([
            'transaction' => $transaction,
            'solde' => $user->portefeuille()->first()->solde,
        ], 201);
    }
}