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
use App\Http\Controllers\FormateurController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\AbsenceController;

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
Route::apiResource('formateurs', FormateurController::class);
Route::apiResource('profiles', ProfilController::class);

// Profile status update route
Route::put('profiles/{profil}/status', [ProfilController::class, 'updateStatus']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/refresh-token', [AuthController::class, 'refreshToken'])->middleware('auth:sanctum');

// Formation validation routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('formations/{formation}/validate', [FormationController::class, 'validate']);
    Route::post('formations/{formation}/reject', [FormationController::class, 'reject']);
    Route::get('formations/pending-validations', [FormationController::class, 'pendingValidations']);
});

// Participant formation management routes
Route::post('participants/{participant}/formations', [ParticipantController::class, 'attachFormation']);
Route::delete('participants/{participant}/formations/{formation}', [ParticipantController::class, 'detachFormation']);
Route::put('participants/{participant}/formations/{formation}/status', [ParticipantController::class, 'updateFormationStatus']);

// Participant progress tracking route
Route::middleware('auth:sanctum')->get('participants/progress', [ParticipantController::class, 'getProgress']);

// Absence management routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('absences/statistics', [AbsenceController::class, 'statistics']);
    Route::apiResource('absences', AbsenceController::class);
}); 