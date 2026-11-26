<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActionController;
use App\Http\Controllers\Api\TradeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/actions', [ActionController::class, 'index']);
    Route::post('/trades/acheter', [TradeController::class, 'acheter']);
    Route::post('/trades/vendre', [TradeController::class, 'vendre']);
});
