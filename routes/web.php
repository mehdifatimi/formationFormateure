<?php

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
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Resource Routes
Route::resource('regions', RegionController::class);
Route::resource('villes', VilleController::class);
Route::resource('drs', DRController::class);
Route::resource('drifs', DRIFController::class);
Route::resource('cdcs', CDCController::class);
Route::resource('filieres', FiliereController::class);
Route::resource('formations', FormationController::class);
Route::resource('animateurs', AnimateurController::class);
Route::resource('participants', ParticipantController::class);

Route::get('/run-seeder', function () {
    try {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear all tables first
        DB::table('participants')->truncate();
        DB::table('animateurs')->truncate();
        DB::table('formations')->truncate();
        DB::table('filieres')->truncate();
        DB::table('cdcs')->truncate();
        DB::table('drifs')->truncate();
        DB::table('drs')->truncate();
        DB::table('villes')->truncate();
        DB::table('regions')->truncate();
        
        // Run seeders
        Artisan::call('db:seed', ['--force' => true]);
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        return 'Seeder completed successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});
