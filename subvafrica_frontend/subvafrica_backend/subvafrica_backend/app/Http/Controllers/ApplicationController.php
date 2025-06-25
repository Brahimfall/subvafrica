<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\UserProfile;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    /**
     * Afficher toutes les candidatures de l'utilisateur
     */
    public function index()
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $applications = $profile->applications()
            ->with('opportunity')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    /**
     * Créer une nouvelle candidature
     */
    public function store(Request $request)
    {
        $request->validate([
            'opportunity_id' => 'required|exists:opportunities,id',
            'status' => 'nullable|in:draft,in_progress,submitted,under_review,accepted,rejected,withdrawn',
            'documents' => 'nullable|array',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        // Vérifier si une candidature existe déjà pour cette opportunité
        $existingApplication = Application::where('user_profile_id', $profile->id)
            ->where('opportunity_id', $request->opportunity_id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'message' => 'Une candidature existe déjà pour cette opportunité',
                'application' => $existingApplication
            ], 409);
        }

        $application = Application::create([
            'user_profile_id' => $profile->id,
            'opportunity_id' => $request->opportunity_id,
            'status' => $request->status ?? 'draft',
            'documents' => $request->documents ?? [],
            'notes' => $request->notes,
            'follow_up_date' => $request->follow_up_date,
        ]);

        $application->load('opportunity');

        return response()->json($application, 201);
    }

    /**
     * Afficher une candidature spécifique
     */
    public function show(Application $application)
    {
        $user = Auth::user();
        
        if ($application->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $application->load('opportunity');

        return response()->json($application);
    }

    /**
     * Mettre à jour une candidature
     */
    public function update(Request $request, Application $application)
    {
        $user = Auth::user();
        
        if ($application->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'status' => 'sometimes|in:draft,in_progress,submitted,under_review,accepted,rejected,withdrawn',
            'documents' => 'sometimes|array',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        // Si le statut passe à "submitted", enregistrer la date de soumission
        if ($request->status === 'submitted' && $application->status !== 'submitted') {
            $request->merge(['submitted_at' => now()]);
        }

        $application->update($request->all());
        $application->load('opportunity');

        return response()->json($application);
    }

    /**
     * Supprimer une candidature
     */
    public function destroy(Application $application)
    {
        $user = Auth::user();
        
        if ($application->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $application->delete();

        return response()->json(['message' => 'Candidature supprimée avec succès']);
    }

    /**
     * Générer du contenu IA pour une candidature
     */
    public function generateContent(Request $request, Application $application)
    {
        $user = Auth::user();
        
        if ($application->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'content_type' => 'required|in:pitch,motivation_letter,project_summary',
        ]);

        $profile = $application->userProfile;
        $opportunity = $application->opportunity;

        // Utiliser le AIController pour générer le contenu
        $aiController = new AIController();
        $response = $aiController->generateApplicationContent(new Request([
            'opportunity_id' => $opportunity->id,
            'user_profile' => $profile->description ?? "{$profile->first_name} {$profile->last_name} - {$profile->experience_level}",
            'content_type' => $request->content_type,
        ]));

        $responseData = $response->getData(true);

        // Sauvegarder le contenu généré dans la candidature
        $aiContent = $application->ai_generated_content ?? [];
        $aiContent[$request->content_type] = [
            'content' => $responseData['generated_content'],
            'generated_at' => now()->toISOString(),
        ];

        $application->update(['ai_generated_content' => $aiContent]);

        return response()->json([
            'application' => $application,
            'generated_content' => $responseData['generated_content'],
            'content_type' => $request->content_type,
        ]);
    }

    /**
     * Obtenir les statistiques des candidatures
     */
    public function getStats()
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $applications = $profile->applications();

        $stats = [
            'total' => $applications->count(),
            'by_status' => [],
            'recent_activity' => $applications->orderBy('updated_at', 'desc')->take(5)->with('opportunity')->get(),
            'needs_follow_up' => $applications->get()->filter(function ($app) {
                return $app->needsFollowUp();
            })->count(),
        ];

        // Statistiques par statut
        foreach (Application::getStatuses() as $status => $label) {
            $stats['by_status'][$status] = [
                'count' => $applications->where('status', $status)->count(),
                'label' => $label,
            ];
        }

        return response()->json($stats);
    }

    /**
     * Marquer une candidature comme nécessitant un suivi
     */
    public function setFollowUp(Request $request, Application $application)
    {
        $user = Auth::user();
        
        if ($application->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'follow_up_date' => 'required|date|after:today',
            'notes' => 'nullable|string',
        ]);

        $application->update([
            'follow_up_date' => $request->follow_up_date,
            'notes' => $request->notes ?? $application->notes,
        ]);

        return response()->json([
            'message' => 'Rappel de suivi programmé',
            'application' => $application
        ]);
    }
}

