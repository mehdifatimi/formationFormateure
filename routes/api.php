<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\DRController;
use App\Http\Controllers\DRIFController;
use App\Http\Controllers\CDCController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\AnimateurController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// CORS preflight requests
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// API Resource Routes
Route::apiResource('regions', RegionController::class);
Route::apiResource('villes', VilleController::class);
Route::apiResource('drs', DRController::class);
Route::apiResource('drifs', DRIFController::class);
Route::apiResource('cdcs', CDCController::class);
Route::apiResource('filieres', FiliereController::class);
Route::apiResource('formations', FormationController::class);
Route::apiResource('animateurs', AnimateurController::class);
Route::apiResource('participants', ParticipantController::class);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); 