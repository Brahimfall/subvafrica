<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\ApplicationController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes publiques
Route::apiResource("opportunities", OpportunityController::class)->only(['index', 'show']);

// Routes pour les fonctionnalités IA (publiques pour l'instant)
Route::post('/ai/search', [AIController::class, 'searchOpportunities']);
Route::post('/ai/generate-content', [AIController::class, 'generateApplicationContent']);
Route::post('/ai/analyze-profile', [AIController::class, 'analyzeUserProfile']);

// Routes pour le chatbot (publiques pour l'instant)
Route::post('/chatbot/message', [ChatbotController::class, 'processMessage']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Gestion des opportunités (création, modification, suppression)
    Route::apiResource("opportunities", OpportunityController::class)->except(['index', 'show']);
    
    // Gestion du profil utilisateur
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::post('/profile', [UserProfileController::class, 'store']);
    Route::put('/profile', [UserProfileController::class, 'update']);
    Route::delete('/profile', [UserProfileController::class, 'destroy']);
    Route::get('/profile/recommendations', [UserProfileController::class, 'getRecommendations']);
    
    // Gestion des alertes
    Route::apiResource('alerts', AlertController::class);
    Route::post('/alerts/{alert}/toggle', [AlertController::class, 'toggle']);
    Route::post('/alerts/{alert}/test', [AlertController::class, 'test']);
    Route::post('/alerts/send-pending', [AlertController::class, 'sendPendingAlerts']);
    
    // Gestion des candidatures
    Route::apiResource('applications', ApplicationController::class);
    Route::post('/applications/{application}/generate-content', [ApplicationController::class, 'generateContent']);
    Route::get('/applications-stats', [ApplicationController::class, 'getStats']);
    Route::post('/applications/{application}/follow-up', [ApplicationController::class, 'setFollowUp']);
});

