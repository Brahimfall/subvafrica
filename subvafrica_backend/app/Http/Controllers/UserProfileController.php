<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProfileController extends Controller
{
    /**
     * Afficher le profil de l'utilisateur connecté
     */
    public function show()
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Créer ou mettre à jour le profil utilisateur
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'sectors' => 'nullable|array',
            'experience_level' => 'nullable|in:beginner,intermediate,expert',
            'project_type' => 'nullable|string|max:255',
            'funding_amount_range' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|string|max:20',
            'linkedin_profile' => 'nullable|url',
        ]);

        $user = Auth::user();
        
        $profile = UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            $request->all()
        );

        return response()->json($profile, 201);
    }

    /**
     * Mettre à jour le profil utilisateur
     */
    public function update(Request $request)
    {
        $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'sectors' => 'nullable|array',
            'experience_level' => 'nullable|in:beginner,intermediate,expert',
            'project_type' => 'nullable|string|max:255',
            'funding_amount_range' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url',
            'phone' => 'nullable|string|max:20',
            'linkedin_profile' => 'nullable|url',
        ]);

        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $profile->update($request->all());

        return response()->json($profile);
    }

    /**
     * Supprimer le profil utilisateur
     */
    public function destroy()
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $profile->delete();

        return response()->json(['message' => 'Profil supprimé avec succès']);
    }

    /**
     * Obtenir les recommandations basées sur le profil
     */
    public function getRecommendations()
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        // Utiliser la logique du AIController pour les recommandations
        $aiController = new AIController();
        $recommendations = $aiController->analyzeUserProfile(new Request([
            'profile_data' => [
                'sectors' => $profile->sectors,
                'experience_level' => $profile->experience_level,
                'project_type' => $profile->project_type,
                'funding_amount' => $profile->funding_amount_range,
                'location' => $profile->location,
            ]
        ]));

        return $recommendations;
    }
}

