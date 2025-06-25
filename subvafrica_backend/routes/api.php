<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DocumentGenerationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;

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

// Routes d'authentification (publiques)
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Vérification d'email
Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['signed'])
    ->name('verification.verify');

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/user', [AuthenticatedSessionController::class, 'user']);
    Route::post('/email/verification-notification', [VerifyEmailController::class, 'resend']);
    
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
    
    // === NOUVELLES ROUTES : Génération Automatique de Documents ===
    
    // Génération de documents
    Route::prefix('documents')->group(function () {
        // Génération de lettres de motivation
        Route::post('/generate/cover-letter', [DocumentGenerationController::class, 'generateCoverLetter']);
        
        // Génération de CV optimisés
        Route::post('/generate/cv', [DocumentGenerationController::class, 'generateCV']);
        
        // Génération de pitch decks
        Route::post('/generate/pitch-deck', [DocumentGenerationController::class, 'generatePitchDeck']);
        
        // Génération de dossiers de candidature complets
        Route::post('/generate/application-file', [DocumentGenerationController::class, 'generateApplicationFile']);
        
        // Gestion des documents générés
        Route::get('/history', [DocumentGenerationController::class, 'getDocumentHistory']);
        Route::get('/{documentId}/download', [DocumentGenerationController::class, 'downloadDocument']);
        Route::delete('/{documentId}', [DocumentGenerationController::class, 'deleteDocument']);
    });
});

// Routes publiques
Route::apiResource("opportunities", OpportunityController::class)->only(['index', 'show']);

// Routes pour les fonctionnalités IA (publiques pour l'instant)
Route::post('/ai/search', [AIController::class, 'searchOpportunities']);
Route::post('/ai/generate-content', [AIController::class, 'generateApplicationContent']);
Route::post('/ai/analyze-profile', [AIController::class, 'analyzeUserProfile']);

// Routes pour le chatbot (publiques pour l'instant)
Route::post('/chatbot/message', [ChatbotController::class, 'processMessage']);

