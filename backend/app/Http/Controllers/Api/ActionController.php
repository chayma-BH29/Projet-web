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
}