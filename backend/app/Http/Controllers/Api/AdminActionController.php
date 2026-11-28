<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActionRequest;
use App\Models\Action;
use App\Services\ActionService;
use Illuminate\Http\JsonResponse;

class AdminActionController extends Controller
{
    public function __construct(private ActionService $actions)
    {
    }

    public function store(ActionRequest $request): JsonResponse
    {
        return response()->json($this->actions->creer($request->validated()), 201);
    }

    public function update(ActionRequest $request, Action $action): JsonResponse
    {
        return response()->json($this->actions->modifier($action, $request->validated()));
    }

    public function destroy(Action $action): JsonResponse
    {
        $this->actions->supprimer($action);

        return response()->json(['message' => 'Action supprimée.']);
    }

    public function simuler(): JsonResponse
{
    $nombre = $this->actions->simulerMarche();

    return response()->json([
        'message' => "Marché simulé : {$nombre} prix mis à jour.",
        'actions' => Action::orderBy('symbole')->get(),
    ]);
}
}