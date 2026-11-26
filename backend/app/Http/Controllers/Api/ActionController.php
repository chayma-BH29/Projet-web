<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Action;
use Illuminate\Http\JsonResponse;

class ActionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Action::orderBy('symbole')->get());
    }
    public function historique(Action $action): JsonResponse
    {
    return response()->json(
        $action->historiquePrix()->orderBy('date_prix')->orderBy('id')->get(['prix', 'date_prix'])
    );
    }
}