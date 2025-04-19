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
use App\Http\Controllers\RoleController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

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
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// Route CSRF
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
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
    Route::apiResource('absences', AbsenceController::class);
    Route::apiResource('roles', RoleController::class);

    // Routes supplémentaires
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Participant formation management routes
    Route::post('participants/{participant}/formations', [ParticipantController::class, 'attachFormation']);
    Route::delete('participants/{participant}/formations/{formation}', [ParticipantController::class, 'detachFormation']);
    Route::put('participants/{participant}/formations/{formation}/status', [ParticipantController::class, 'updateFormationStatus']);
    Route::post('/formations/{formation}/participants/{participant}', [FormationController::class, 'addParticipant']);
});

// Profile status update route
Route::put('profiles/{profil}/status', [ProfilController::class, 'updateStatus']);

// Formation validation routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('formations/{formation}/validate', [FormationController::class, 'validate']);
    Route::post('formations/{formation}/reject', [FormationController::class, 'reject']);
    Route::get('formations/pending-validations', [FormationController::class, 'pendingValidations']);
});

// Participant progress tracking route
Route::middleware('auth:sanctum')->get('participants/progress', [ParticipantController::class, 'getProgress']);

// Absence management routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('absences/statistics', [AbsenceController::class, 'statistics']);
    Route::apiResource('absences', AbsenceController::class);
});

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Routes pour les formations
    Route::get('/formations', [FormationController::class, 'index']);
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put('/formations/{formation}', [FormationController::class, 'update']);
    Route::delete('/formations/{formation}', [FormationController::class, 'destroy']);
    Route::post('/formations/{formation}/validate', [FormationController::class, 'validate']);

    // Routes pour les formateurs
    Route::get('/formateurs', [FormateurController::class, 'index']);
    Route::post('/formateurs', [FormateurController::class, 'store']);
    Route::put('/formateurs/{formateur}', [FormateurController::class, 'update']);
    Route::delete('/formateurs/{formateur}', [FormateurController::class, 'destroy']);

    // Routes pour les participants
    Route::get('/participants', [ParticipantController::class, 'index']);
    Route::post('/participants', [ParticipantController::class, 'store']);
    Route::put('/participants/{participant}', [ParticipantController::class, 'update']);
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy']);

    // Routes pour les absences
    Route::get('/absences', [AbsenceController::class, 'index']);
    Route::post('/absences', [AbsenceController::class, 'store']);
    Route::put('/absences/{absence}', [AbsenceController::class, 'update']);
    Route::delete('/absences/{absence}', [AbsenceController::class, 'destroy']);

    // Routes pour les rôles et permissions
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/users/{user}/roles', [RoleController::class, 'assignRole']);
    Route::delete('/users/{user}/roles', [RoleController::class, 'removeRole']);
    Route::put('/users/{user}/roles', [RoleController::class, 'syncRoles']);
});