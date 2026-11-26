<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PortefeuilleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortefeuilleController extends Controller
{
    public function __construct(private PortefeuilleService $portefeuilles)
    {
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json($this->portefeuilles->resume($request->user()));
    }

    public function transactions(Request $request): JsonResponse
    {
        return response()->json($this->portefeuilles->historique($request->user()));
    }
}