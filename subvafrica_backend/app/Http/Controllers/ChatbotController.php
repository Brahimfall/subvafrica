<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use App\Models\UserProfile;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    /**
     * Traiter une question du chatbot
     */
    public function processMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'user_profile_id' => 'nullable|exists:user_profiles,id',
            'context' => 'nullable|array'
        ]);

        $message = $request->input('message');
        $userProfileId = $request->input('user_profile_id');
        $context = $request->input('context', []);

        // Analyser l'intention du message
        $intent = $this->analyzeIntent($message);
        
        // Générer une réponse basée sur l'intention
        $response = $this->generateResponse($intent, $message, $userProfileId, $context);

        return response()->json([
            'message' => $message,
            'intent' => $intent,
            'response' => $response,
            'suggestions' => $this->getSuggestions($intent),
            'timestamp' => now()
        ]);
    }

    /**
     * Analyser l'intention du message
     */
    private function analyzeIntent($message)
    {
        $message = strtolower($message);

        // Intentions liées à l'éligibilité
        if (preg_match('/\b(éligible|éligibilité|critères|conditions|puis-je|suis-je)\b/', $message)) {
            return 'eligibility_check';
        }

        // Intentions liées aux candidatures
        if (preg_match('/\b(comment|postuler|candidature|dossier|application)\b/', $message)) {
            return 'application_help';
        }

        // Intentions liées à la recherche
        if (preg_match('/\b(trouver|chercher|recherche|opportunités|subventions)\b/', $message)) {
            return 'search_help';
        }

        // Intentions liées aux deadlines
        if (preg_match('/\b(deadline|échéance|date limite|quand|délai)\b/', $message)) {
            return 'deadline_info';
        }

        // Intentions liées aux montants
        if (preg_match('/\b(montant|financement|argent|euros|budget)\b/', $message)) {
            return 'funding_info';
        }

        // Intentions liées aux secteurs
        if (preg_match('/\b(secteur|domaine|technologie|agriculture|santé|éducation)\b/', $message)) {
            return 'sector_info';
        }

        // Salutations
        if (preg_match('/\b(bonjour|salut|hello|bonsoir)\b/', $message)) {
            return 'greeting';
        }

        // Remerciements
        if (preg_match('/\b(merci|thanks|remercie)\b/', $message)) {
            return 'thanks';
        }

        return 'general_question';
    }

    /**
     * Générer une réponse basée sur l'intention
     */
    private function generateResponse($intent, $message, $userProfileId, $context)
    {
        switch ($intent) {
            case 'greeting':
                return "Bonjour ! Je suis votre assistant IA pour SubvAfrica. Je peux vous aider à trouver des opportunités de financement, vérifier votre éligibilité, et vous guider dans vos candidatures. Comment puis-je vous aider aujourd'hui ?";

            case 'eligibility_check':
                return $this->handleEligibilityCheck($message, $userProfileId);

            case 'application_help':
                return $this->handleApplicationHelp($message);

            case 'search_help':
                return $this->handleSearchHelp($message);

            case 'deadline_info':
                return $this->handleDeadlineInfo($message);

            case 'funding_info':
                return $this->handleFundingInfo($message);

            case 'sector_info':
                return $this->handleSectorInfo($message);

            case 'thanks':
                return "De rien ! Je suis là pour vous aider. N'hésitez pas si vous avez d'autres questions sur les opportunités de financement ou les candidatures.";

            default:
                return $this->handleGeneralQuestion($message);
        }
    }

    /**
     * Gérer les questions d'éligibilité
     */
    private function handleEligibilityCheck($message, $userProfileId)
    {
        $response = "Pour vérifier votre éligibilité, j'ai besoin de connaître :\n\n";
        $response .= "• Votre secteur d'activité\n";
        $response .= "• Votre localisation (pays/région)\n";
        $response .= "• Le type de projet (startup, recherche, social, etc.)\n";
        $response .= "• Votre niveau d'expérience\n\n";

        if ($userProfileId) {
            $profile = UserProfile::find($userProfileId);
            if ($profile) {
                $response .= "Basé sur votre profil, voici les opportunités qui pourraient vous correspondre :\n\n";
                $opportunities = $this->getMatchingOpportunities($profile);
                foreach ($opportunities->take(3) as $opportunity) {
                    $response .= "• {$opportunity->title} (Échéance: " . 
                               $opportunity->deadline?->format('d/m/Y') . ")\n";
                }
            }
        } else {
            $response .= "Créez votre profil pour obtenir des recommandations personnalisées !";
        }

        return $response;
    }

    /**
     * Gérer les questions sur les candidatures
     */
    private function handleApplicationHelp($message)
    {
        return "Pour postuler à une opportunité, voici les étapes typiques :\n\n" .
               "1. **Vérifiez votre éligibilité** - Assurez-vous de répondre aux critères\n" .
               "2. **Préparez vos documents** - CV, lettre de motivation, description du projet\n" .
               "3. **Utilisez notre générateur IA** - Pour créer des pitch decks et lettres personnalisées\n" .
               "4. **Respectez la deadline** - Soumettez avant la date limite\n" .
               "5. **Suivez votre candidature** - Utilisez notre tableau de bord\n\n" .
               "Notre IA peut vous aider à rédiger automatiquement vos documents de candidature. Voulez-vous que je vous montre comment ?";
    }

    /**
     * Gérer les questions sur la recherche
     */
    private function handleSearchHelp($message)
    {
        return "Notre moteur de recherche IA vous aide à trouver les meilleures opportunités :\n\n" .
               "• **Recherche intelligente** - Décrivez votre projet en quelques mots\n" .
               "• **Filtres avancés** - Par secteur, montant, type d'audience\n" .
               "• **Score de pertinence** - Les résultats sont classés selon votre profil\n" .
               "• **Alertes personnalisées** - Soyez notifié des nouvelles opportunités\n\n" .
               "Astuce : Plus votre profil est complet, plus nos recommandations sont précises !";
    }

    /**
     * Gérer les questions sur les deadlines
     */
    private function handleDeadlineInfo($message)
    {
        $upcomingOpportunities = Opportunity::where('deadline', '>=', now())
                                           ->where('deadline', '<=', now()->addDays(30))
                                           ->orderBy('deadline')
                                           ->take(5)
                                           ->get();

        $response = "Voici les opportunités avec des échéances dans les 30 prochains jours :\n\n";

        foreach ($upcomingOpportunities as $opportunity) {
            $daysLeft = now()->diffInDays($opportunity->deadline, false);
            $response .= "• **{$opportunity->title}**\n";
            $response .= "  Échéance: {$opportunity->deadline->format('d/m/Y')} ({$daysLeft} jours restants)\n";
            $response .= "  Montant: {$opportunity->amount}\n\n";
        }

        $response .= "💡 Conseil : Activez les alertes pour ne jamais manquer une deadline !";

        return $response;
    }

    /**
     * Gérer les questions sur les montants
     */
    private function handleFundingInfo($message)
    {
        $opportunities = Opportunity::whereNotNull('amount')->get();
        
        $response = "Voici un aperçu des montants de financement disponibles :\n\n";
        
        // Grouper par type d'opportunité
        $byType = $opportunities->groupBy('opportunity_type');
        
        foreach ($byType as $type => $opps) {
            $response .= "**{$type}** :\n";
            foreach ($opps->take(3) as $opp) {
                $response .= "• {$opp->title}: {$opp->amount}\n";
            }
            $response .= "\n";
        }

        $response .= "💰 Les montants varient de 12 000 € à 500 000 € selon le type d'opportunité et le secteur.";

        return $response;
    }

    /**
     * Gérer les questions sur les secteurs
     */
    private function handleSectorInfo($message)
    {
        $sectors = Opportunity::whereNotNull('country_sector_filter')
                             ->get()
                             ->pluck('country_sector_filter')
                             ->flatten()
                             ->unique()
                             ->filter(function($item) {
                                 return !in_array($item, ['Afrique', 'Sahel', 'Afrique de l\'Ouest']);
                             })
                             ->values();

        $response = "Nous couvrons de nombreux secteurs d'activité :\n\n";
        
        foreach ($sectors as $sector) {
            $count = Opportunity::whereJsonContains('country_sector_filter', $sector)->count();
            $response .= "• **{$sector}** ({$count} opportunités)\n";
        }

        $response .= "\n🎯 Chaque secteur a ses spécificités. Précisez votre domaine pour des recommandations ciblées !";

        return $response;
    }

    /**
     * Gérer les questions générales
     */
    private function handleGeneralQuestion($message)
    {
        return "Je comprends votre question, mais j'ai besoin de plus de précisions pour vous aider au mieux.\n\n" .
               "Je peux vous aider avec :\n" .
               "• Vérifier votre éligibilité pour des opportunités\n" .
               "• Vous guider dans le processus de candidature\n" .
               "• Trouver des opportunités selon vos critères\n" .
               "• Vous informer sur les deadlines importantes\n" .
               "• Expliquer les montants de financement disponibles\n\n" .
               "Pouvez-vous reformuler votre question ou choisir un de ces sujets ?";
    }

    /**
     * Obtenir des suggestions de questions
     */
    private function getSuggestions($intent)
    {
        $suggestions = [
            'greeting' => [
                "Comment vérifier mon éligibilité ?",
                "Quelles sont les opportunités disponibles ?",
                "Comment postuler à une subvention ?"
            ],
            'eligibility_check' => [
                "Montrez-moi les opportunités pour mon secteur",
                "Comment améliorer mon profil ?",
                "Quels documents sont nécessaires ?"
            ],
            'application_help' => [
                "Générer une lettre de motivation",
                "Créer un pitch deck",
                "Suivre mes candidatures"
            ],
            'search_help' => [
                "Opportunités en technologie",
                "Subventions pour l'agriculture",
                "Bourses d'études disponibles"
            ]
        ];

        return $suggestions[$intent] ?? [
            "Comment puis-je vous aider ?",
            "Parlez-moi de votre projet",
            "Quels sont vos objectifs de financement ?"
        ];
    }

    /**
     * Obtenir les opportunités correspondant au profil
     */
    private function getMatchingOpportunities($profile)
    {
        $query = Opportunity::query();

        if ($profile->sectors) {
            $query->where(function ($q) use ($profile) {
                foreach ($profile->sectors as $sector) {
                    $q->orWhereJsonContains('country_sector_filter', $sector);
                }
            });
        }

        if ($profile->location) {
            $query->whereJsonContains('country_sector_filter', $profile->location);
        }

        return $query->limit(5)->get();
    }
}

