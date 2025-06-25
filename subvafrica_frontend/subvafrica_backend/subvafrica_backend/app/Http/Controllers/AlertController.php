<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\UserProfile;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlertController extends Controller
{
    /**
     * Afficher toutes les alertes de l'utilisateur
     */
    public function index()
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $alerts = $profile->alerts()->get();

        return response()->json($alerts);
    }

    /**
     * Créer une nouvelle alerte
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'criteria' => 'required|array',
            'criteria.sectors' => 'nullable|array',
            'criteria.location' => 'nullable|string',
            'criteria.opportunity_type' => 'nullable|string',
            'criteria.keywords' => 'nullable|string',
            'frequency' => 'required|in:daily,weekly,monthly',
        ]);

        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $alert = Alert::create([
            'user_profile_id' => $profile->id,
            'name' => $request->name,
            'criteria' => $request->criteria,
            'frequency' => $request->frequency,
            'is_active' => true,
        ]);

        return response()->json($alert, 201);
    }

    /**
     * Afficher une alerte spécifique
     */
    public function show(Alert $alert)
    {
        $user = Auth::user();
        
        if ($alert->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json($alert);
    }

    /**
     * Mettre à jour une alerte
     */
    public function update(Request $request, Alert $alert)
    {
        $user = Auth::user();
        
        if ($alert->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'criteria' => 'sometimes|required|array',
            'frequency' => 'sometimes|required|in:daily,weekly,monthly',
            'is_active' => 'sometimes|boolean',
        ]);

        $alert->update($request->all());

        return response()->json($alert);
    }

    /**
     * Supprimer une alerte
     */
    public function destroy(Alert $alert)
    {
        $user = Auth::user();
        
        if ($alert->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $alert->delete();

        return response()->json(['message' => 'Alerte supprimée avec succès']);
    }

    /**
     * Activer/désactiver une alerte
     */
    public function toggle(Alert $alert)
    {
        $user = Auth::user();
        
        if ($alert->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $alert->update(['is_active' => !$alert->is_active]);

        return response()->json([
            'message' => $alert->is_active ? 'Alerte activée' : 'Alerte désactivée',
            'alert' => $alert
        ]);
    }

    /**
     * Tester une alerte et retourner les opportunités correspondantes
     */
    public function test(Alert $alert)
    {
        $user = Auth::user();
        
        if ($alert->userProfile->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $opportunities = $this->findMatchingOpportunities($alert->criteria);

        return response()->json([
            'alert' => $alert,
            'matching_opportunities' => $opportunities,
            'count' => $opportunities->count()
        ]);
    }

    /**
     * Trouver les opportunités correspondant aux critères d'alerte
     */
    private function findMatchingOpportunities($criteria)
    {
        $query = Opportunity::query();

        // Filtrage par secteurs
        if (isset($criteria['sectors']) && !empty($criteria['sectors'])) {
            $query->where(function ($q) use ($criteria) {
                foreach ($criteria['sectors'] as $sector) {
                    $q->orWhereJsonContains('country_sector_filter', $sector);
                }
            });
        }

        // Filtrage par localisation
        if (isset($criteria['location']) && !empty($criteria['location'])) {
            $query->whereJsonContains('country_sector_filter', $criteria['location']);
        }

        // Filtrage par type d'opportunité
        if (isset($criteria['opportunity_type']) && !empty($criteria['opportunity_type'])) {
            $query->where('opportunity_type', $criteria['opportunity_type']);
        }

        // Filtrage par mots-clés
        if (isset($criteria['keywords']) && !empty($criteria['keywords'])) {
            $keywords = $criteria['keywords'];
            $query->where(function ($q) use ($keywords) {
                $q->where('title', 'ILIKE', "%{$keywords}%")
                  ->orWhere('description', 'ILIKE', "%{$keywords}%")
                  ->orWhere('conditions', 'ILIKE', "%{$keywords}%");
            });
        }

        // Opportunités récentes (derniers 30 jours)
        $query->where('created_at', '>=', now()->subDays(30));

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Envoyer les alertes en attente (pour les tâches cron)
     */
    public function sendPendingAlerts()
    {
        $alerts = Alert::where('is_active', true)->get();
        $sentCount = 0;

        foreach ($alerts as $alert) {
            if ($alert->shouldSend()) {
                $opportunities = $this->findMatchingOpportunities($alert->criteria);
                
                if ($opportunities->count() > 0) {
                    // Ici, vous pourriez envoyer un email ou une notification
                    // Pour l'instant, on met juste à jour la date d'envoi
                    $alert->update(['last_sent_at' => now()]);
                    $sentCount++;
                }
            }
        }

        return response()->json([
            'message' => "Alertes traitées avec succès",
            'sent_count' => $sentCount,
            'total_alerts' => $alerts->count()
        ]);
    }
}

