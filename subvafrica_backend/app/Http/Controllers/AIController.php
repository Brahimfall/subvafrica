<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    /**
     * Recherche intelligente d'opportunités basée sur le profil utilisateur
     */
    public function searchOpportunities(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:500',
            'sectors' => 'nullable|array',
            'target_audience' => 'nullable|array',
            'country' => 'nullable|string',
        ]);

        $query = $request->input('query');
        $sectors = $request->input('sectors', []);
        $targetAudience = $request->input('target_audience', []);
        $country = $request->input('country');

        // Recherche de base dans la base de données
        $opportunities = Opportunity::query();

        // Filtrage par secteurs
        if (!empty($sectors)) {
            $opportunities->where(function ($q) use ($sectors) {
                foreach ($sectors as $sector) {
                    $q->orWhereJsonContains('country_sector_filter', $sector);
                }
            });
        }

        // Filtrage par audience cible
        if (!empty($targetAudience)) {
            $opportunities->where(function ($q) use ($targetAudience) {
                foreach ($targetAudience as $audience) {
                    $q->orWhereJsonContains('target_audience', $audience);
                }
            });
        }

        // Filtrage par pays
        if ($country) {
            $opportunities->whereJsonContains('country_sector_filter', $country);
        }

        // Recherche textuelle simple
        if ($query) {
            $opportunities->where(function ($q) use ($query) {
                $q->where('title', 'ILIKE', "%{$query}%")
                  ->orWhere('description', 'ILIKE', "%{$query}%")
                  ->orWhere('conditions', 'ILIKE', "%{$query}%");
            });
        }

        $results = $opportunities->get();

        // Simulation d'un score de pertinence IA
        $scoredResults = $results->map(function ($opportunity) use ($query) {
            $score = $this->calculateRelevanceScore($opportunity, $query);
            $opportunity->relevance_score = $score;
            return $opportunity;
        })->sortByDesc('relevance_score')->values();

        return response()->json([
            'query' => $query,
            'total_results' => $scoredResults->count(),
            'opportunities' => $scoredResults
        ]);
    }

    /**
     * Génération de contenu IA pour les candidatures
     */
    public function generateApplicationContent(Request $request)
    {
        $request->validate([
            'opportunity_id' => 'required|exists:opportunities,id',
            'user_profile' => 'required|string',
            'content_type' => 'required|in:pitch,motivation_letter,project_summary',
        ]);

        $opportunity = Opportunity::findOrFail($request->opportunity_id);
        $userProfile = $request->user_profile;
        $contentType = $request->content_type;

        // Simulation de génération de contenu IA
        $generatedContent = $this->simulateAIContentGeneration($opportunity, $userProfile, $contentType);

        return response()->json([
            'opportunity' => $opportunity,
            'content_type' => $contentType,
            'generated_content' => $generatedContent,
            'generated_at' => now()
        ]);
    }

    /**
     * Analyse de profil utilisateur pour recommandations
     */
    public function analyzeUserProfile(Request $request)
    {
        $request->validate([
            'profile_data' => 'required|array',
            'profile_data.sectors' => 'nullable|array',
            'profile_data.experience_level' => 'nullable|string',
            'profile_data.project_type' => 'nullable|string',
            'profile_data.funding_amount' => 'nullable|string',
            'profile_data.location' => 'nullable|string',
        ]);

        $profileData = $request->profile_data;

        // Analyse du profil et génération de recommandations
        $recommendations = $this->generateProfileRecommendations($profileData);

        return response()->json([
            'profile_analysis' => $recommendations,
            'recommended_opportunities' => $this->getRecommendedOpportunities($profileData),
            'analysis_date' => now()
        ]);
    }

    /**
     * Calcul du score de pertinence (simulation)
     */
    private function calculateRelevanceScore($opportunity, $query)
    {
        $score = 0;

        // Score basé sur la correspondance du titre
        if (stripos($opportunity->title, $query) !== false) {
            $score += 50;
        }

        // Score basé sur la correspondance de la description
        if (stripos($opportunity->description, $query) !== false) {
            $score += 30;
        }

        // Score basé sur la correspondance des conditions
        if (stripos($opportunity->conditions, $query) !== false) {
            $score += 20;
        }

        // Bonus pour les opportunités récentes
        $daysSinceCreation = now()->diffInDays($opportunity->created_at);
        if ($daysSinceCreation <= 7) {
            $score += 10;
        }

        // Bonus pour les opportunités avec deadline proche
        if ($opportunity->deadline) {
            $daysUntilDeadline = now()->diffInDays($opportunity->deadline, false);
            if ($daysUntilDeadline > 0 && $daysUntilDeadline <= 30) {
                $score += 15;
            }
        }

        return min($score, 100); // Score maximum de 100
    }

    /**
     * Simulation de génération de contenu IA
     */
    private function simulateAIContentGeneration($opportunity, $userProfile, $contentType)
    {
        $templates = [
            'pitch' => "Pitch Deck pour {$opportunity->title}\n\n" .
                      "Présentation du projet :\n" .
                      "Notre projet s'aligne parfaitement avec les objectifs de {$opportunity->title}. " .
                      "Basé sur le profil : {$userProfile}\n\n" .
                      "Objectifs :\n" .
                      "- Innovation dans le secteur ciblé\n" .
                      "- Impact social et économique en Afrique\n" .
                      "- Développement durable\n\n" .
                      "Équipe :\n" .
                      "Notre équipe possède l'expertise nécessaire pour mener à bien ce projet.\n\n" .
                      "Financement demandé : {$opportunity->amount}",

            'motivation_letter' => "Lettre de motivation pour {$opportunity->title}\n\n" .
                                  "Madame, Monsieur,\n\n" .
                                  "Je me permets de vous adresser ma candidature pour {$opportunity->title}. " .
                                  "Mon profil ({$userProfile}) correspond parfaitement aux critères recherchés.\n\n" .
                                  "Mes motivations :\n" .
                                  "- Passion pour l'innovation en Afrique\n" .
                                  "- Expérience dans le domaine\n" .
                                  "- Vision claire du projet\n\n" .
                                  "Je suis convaincu(e) que cette opportunité me permettra de contribuer " .
                                  "significativement au développement de l'écosystème entrepreneurial africain.\n\n" .
                                  "Cordialement,",

            'project_summary' => "Résumé de projet pour {$opportunity->title}\n\n" .
                               "Titre du projet : [À personnaliser]\n\n" .
                               "Contexte :\n" .
                               "Le projet s'inscrit dans le cadre de {$opportunity->title} et vise à " .
                               "répondre aux besoins identifiés dans le secteur.\n\n" .
                               "Objectifs :\n" .
                               "- Objectif principal : [À définir]\n" .
                               "- Objectifs secondaires : [À définir]\n\n" .
                               "Méthodologie :\n" .
                               "Approche innovante basée sur {$userProfile}\n\n" .
                               "Impact attendu :\n" .
                               "- Impact social\n" .
                               "- Impact économique\n" .
                               "- Impact environnemental\n\n" .
                               "Budget : {$opportunity->amount}"
        ];

        return $templates[$contentType] ?? "Contenu généré pour {$contentType}";
    }

    /**
     * Génération de recommandations basées sur le profil
     */
    private function generateProfileRecommendations($profileData)
    {
        $recommendations = [
            'strengths' => [],
            'improvement_areas' => [],
            'suggested_sectors' => [],
            'funding_strategy' => ''
        ];

        // Analyse des forces
        if (isset($profileData['experience_level'])) {
            switch ($profileData['experience_level']) {
                case 'beginner':
                    $recommendations['strengths'][] = 'Potentiel d\'innovation élevé';
                    $recommendations['improvement_areas'][] = 'Développer l\'expérience opérationnelle';
                    break;
                case 'intermediate':
                    $recommendations['strengths'][] = 'Équilibre entre innovation et expérience';
                    break;
                case 'expert':
                    $recommendations['strengths'][] = 'Expertise approfondie du domaine';
                    $recommendations['strengths'][] = 'Capacité de mentorat';
                    break;
            }
        }

        // Suggestions de secteurs
        if (isset($profileData['sectors']) && is_array($profileData['sectors'])) {
            $recommendations['suggested_sectors'] = array_merge(
                $profileData['sectors'],
                ['Technologie', 'Agriculture durable', 'Santé digitale']
            );
        }

        // Stratégie de financement
        $recommendations['funding_strategy'] = 'Diversifier les sources de financement : ' .
                                             'subventions publiques, investisseurs privés, crowdfunding';

        return $recommendations;
    }

    /**
     * Obtenir les opportunités recommandées
     */
    private function getRecommendedOpportunities($profileData)
    {
        $query = Opportunity::query();

        // Filtrage basé sur les secteurs du profil
        if (isset($profileData['sectors']) && is_array($profileData['sectors'])) {
            $query->where(function ($q) use ($profileData) {
                foreach ($profileData['sectors'] as $sector) {
                    $q->orWhereJsonContains('country_sector_filter', $sector);
                }
            });
        }

        // Filtrage basé sur la localisation
        if (isset($profileData['location'])) {
            $query->whereJsonContains('country_sector_filter', $profileData['location']);
        }

        return $query->limit(5)->get();
    }
}

