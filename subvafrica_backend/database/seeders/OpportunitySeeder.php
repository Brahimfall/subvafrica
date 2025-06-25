<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Opportunity;

class OpportunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $opportunities = [
            [
                'title' => 'Programme d\'Accélération Tech4Dev',
                'description' => 'Programme d\'accélération pour les startups technologiques africaines axées sur le développement durable. Accompagnement de 6 mois avec mentorat, financement et accès au marché.',
                'conditions' => 'Startup technologique basée en Afrique, équipe de 2-5 personnes, prototype fonctionnel, impact social ou environnemental mesurable.',
                'deadline' => now()->addDays(45),
                'amount' => '50 000 € + accompagnement',
                'target_audience' => ['Startups', 'Entrepreneurs', 'Développeurs'],
                'country_sector_filter' => ['Afrique', 'Technologie', 'Développement durable'],
                'opportunity_type' => 'Accélérateur',
                'source_url' => 'https://tech4dev.africa/acceleration',
            ],
            [
                'title' => 'Subvention Innovation Agricole Sahel',
                'description' => 'Financement pour des projets d\'innovation dans l\'agriculture durable au Sahel. Focus sur les technologies d\'irrigation, les semences résistantes et l\'agriculture de précision.',
                'conditions' => 'Projet agricole innovant, impact sur la sécurité alimentaire, partenariat avec des agriculteurs locaux, budget détaillé.',
                'deadline' => now()->addDays(30),
                'amount' => '25 000 € - 100 000 €',
                'target_audience' => ['Agriculteurs', 'Coopératives', 'Entrepreneurs agricoles'],
                'country_sector_filter' => ['Sahel', 'Agriculture', 'Innovation'],
                'opportunity_type' => 'Subvention',
                'source_url' => 'https://sahel-innovation.org/agriculture',
            ],
            [
                'title' => 'Concours Santé Digitale Afrique',
                'description' => 'Concours pour les solutions de santé digitale en Afrique. Recherche d\'innovations en télémédecine, diagnostic mobile, gestion des données de santé.',
                'conditions' => 'Solution de santé digitale, validation clinique préliminaire, équipe multidisciplinaire, plan de déploiement en Afrique.',
                'deadline' => now()->addDays(60),
                'amount' => '75 000 € + incubation',
                'target_audience' => ['Professionnels de santé', 'Développeurs', 'Entrepreneurs'],
                'country_sector_filter' => ['Afrique', 'Santé', 'Digital'],
                'opportunity_type' => 'Concours',
                'source_url' => 'https://healthtech-africa.com/competition',
            ],
            [
                'title' => 'Bourse d\'Excellence Entrepreneuriat Féminin',
                'description' => 'Programme de bourses pour les femmes entrepreneures africaines. Formation, mentorat et financement pour développer des entreprises dirigées par des femmes.',
                'conditions' => 'Femme entrepreneur, entreprise en phase de croissance, impact social positif, plan de développement sur 3 ans.',
                'deadline' => now()->addDays(90),
                'amount' => '30 000 € + formation',
                'target_audience' => ['Femmes entrepreneures', 'PME'],
                'country_sector_filter' => ['Afrique', 'Entrepreneuriat', 'Genre'],
                'opportunity_type' => 'Bourse',
                'source_url' => 'https://women-entrepreneurs-africa.org',
            ],
            [
                'title' => 'Fonds d\'Investissement Énergie Renouvelable',
                'description' => 'Investissement pour des projets d\'énergie renouvelable en Afrique de l\'Ouest. Solar, éolien, biomasse et solutions de stockage d\'énergie.',
                'conditions' => 'Projet d\'énergie renouvelable, étude de faisabilité complète, partenariats locaux, impact environnemental positif.',
                'deadline' => now()->addDays(120),
                'amount' => '100 000 € - 500 000 €',
                'target_audience' => ['Développeurs de projets', 'Ingénieurs', 'Investisseurs'],
                'country_sector_filter' => ['Afrique de l\'Ouest', 'Énergie', 'Environnement'],
                'opportunity_type' => 'Investissement',
                'source_url' => 'https://renewable-energy-fund.africa',
            ],
            [
                'title' => 'Programme Éducation Numérique',
                'description' => 'Financement pour des solutions éducatives numériques adaptées au contexte africain. Plateformes d\'apprentissage, contenus pédagogiques, formation des enseignants.',
                'conditions' => 'Solution éducative numérique, test pilote réalisé, partenariat avec institutions éducatives, mesure d\'impact pédagogique.',
                'deadline' => now()->addDays(75),
                'amount' => '40 000 € + accompagnement technique',
                'target_audience' => ['Éducateurs', 'Développeurs EdTech', 'ONG'],
                'country_sector_filter' => ['Afrique', 'Éducation', 'Numérique'],
                'opportunity_type' => 'Subvention',
                'source_url' => 'https://digital-education-africa.org',
            ],
            [
                'title' => 'Incubateur Fintech Afrique Francophone',
                'description' => 'Programme d\'incubation pour les startups fintech en Afrique francophone. Services financiers mobiles, inclusion financière, blockchain.',
                'conditions' => 'Startup fintech, solution pour l\'inclusion financière, équipe technique solide, marché cible défini.',
                'deadline' => now()->addDays(55),
                'amount' => '60 000 € + mentorat',
                'target_audience' => ['Entrepreneurs fintech', 'Développeurs', 'Experts financiers'],
                'country_sector_filter' => ['Afrique francophone', 'Finance', 'Technologie'],
                'opportunity_type' => 'Incubateur',
                'source_url' => 'https://fintech-incubator.africa',
            ],
            [
                'title' => 'Appel à Projets Économie Circulaire',
                'description' => 'Financement pour des projets d\'économie circulaire en Afrique. Recyclage, valorisation des déchets, économie de ressources.',
                'conditions' => 'Projet d\'économie circulaire, impact environnemental mesurable, modèle économique viable, partenariats locaux.',
                'deadline' => now()->addDays(40),
                'amount' => '35 000 € - 80 000 €',
                'target_audience' => ['Entrepreneurs verts', 'Coopératives', 'Innovateurs'],
                'country_sector_filter' => ['Afrique', 'Environnement', 'Économie circulaire'],
                'opportunity_type' => 'Appel à projets',
                'source_url' => 'https://circular-economy-africa.org',
            ]
        ];

        foreach ($opportunities as $opportunity) {
            Opportunity::create($opportunity);
        }
    }
}

