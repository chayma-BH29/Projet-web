<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActionController;
use App\Http\Controllers\Api\TradeController;
use App\Http\Controllers\Api\PortefeuilleController;
use App\Http\Controllers\Api\AdminActionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/actions', [ActionController::class, 'index']);
    Route::post('/trades/acheter', [TradeController::class, 'acheter']);
    Route::post('/trades/vendre', [TradeController::class, 'vendre']);
    Route::get('/portefeuille', [PortefeuilleController::class, 'show']);
    Route::get('/transactions', [PortefeuilleController::class, 'transactions']);
    Route::get('/actions/{action}/historique', [ActionController::class, 'historique']);
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::post('/actions', [AdminActionController::class, 'store']);
        Route::put('/actions/{action}', [AdminActionController::class, 'update']);
        Route::delete('/actions/{action}', [AdminActionController::class, 'destroy']);
    });
});
