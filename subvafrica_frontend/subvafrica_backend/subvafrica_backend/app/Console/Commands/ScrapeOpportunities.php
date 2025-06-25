<?php

namespace App\Console\Commands;

use App\Models\Opportunity;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ScrapeOpportunities extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:opportunities {--source=all : Source à scraper (all, demo, external)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape des opportunités depuis différentes sources';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $source = $this->option('source');

        $this->info("Début du scraping des opportunités (source: {$source})");

        switch ($source) {
            case 'demo':
                $this->scrapeDemoData();
                break;
            case 'external':
                $this->scrapeExternalSources();
                break;
            case 'all':
            default:
                $this->scrapeDemoData();
                $this->scrapeExternalSources();
                break;
        }

        $this->info('Scraping terminé avec succès !');
    }

    /**
     * Génère des données de démonstration
     */
    private function scrapeDemoData()
    {
        $this->info('Génération de données de démonstration...');

        $demoOpportunities = [
            [
                'title' => 'Concours Innovation Santé Afrique 2025',
                'description' => 'Concours pour les innovations en santé digitale destinées aux populations africaines. Prix de 100 000 euros pour le projet gagnant.',
                'conditions' => 'Startup ou projet en phase de développement, solution digitale pour la santé, équipe basée en Afrique',
                'deadline' => '2025-09-30',
                'amount' => '100 000 €',
                'target_audience' => ['entrepreneurs', 'startups', 'innovateurs'],
                'country_sector_filter' => ['Afrique', 'Santé', 'Technologie'],
                'opportunity_type' => 'Concours',
                'source_url' => 'https://innovationsante-afrique.org/concours2025'
            ],
            [
                'title' => 'Fonds d\'investissement AgriTech Sahel',
                'description' => 'Fonds d\'investissement dédié aux technologies agricoles dans la région du Sahel. Financement de 25 000 à 500 000 euros.',
                'conditions' => 'Entreprise AgriTech, activité dans la région du Sahel, impact social démontrable',
                'deadline' => '2025-12-31',
                'amount' => '25 000 - 500 000 €',
                'target_audience' => ['entrepreneurs', 'PME', 'coopératives'],
                'country_sector_filter' => ['Sahel', 'Agriculture', 'Technologie'],
                'opportunity_type' => 'Investissement',
                'source_url' => 'https://agritech-sahel.com/fonds'
            ],
            [
                'title' => 'Programme de mentorat Women in Tech Africa',
                'description' => 'Programme de mentorat et de financement pour les femmes entrepreneures dans le secteur technologique en Afrique.',
                'conditions' => 'Femme entrepreneure, projet technologique, basée en Afrique',
                'deadline' => '2025-08-01',
                'amount' => '20 000 €',
                'target_audience' => ['femmes entrepreneures', 'startups'],
                'country_sector_filter' => ['Afrique', 'Technologie', 'Genre'],
                'opportunity_type' => 'Programme',
                'source_url' => 'https://womenintech-africa.org/mentorat'
            ],
            [
                'title' => 'Bourse d\'excellence Éducation Numérique',
                'description' => 'Bourse pour les étudiants africains poursuivant des études en éducation numérique et technologies éducatives.',
                'conditions' => 'Étudiant africain, master ou doctorat en éducation numérique, projet de recherche',
                'deadline' => '2025-06-30',
                'amount' => '12 000 €',
                'target_audience' => ['étudiants', 'chercheurs'],
                'country_sector_filter' => ['Afrique', 'Éducation', 'Technologie'],
                'opportunity_type' => 'Bourse',
                'source_url' => 'https://education-numerique-afrique.edu/bourses'
            ],
            [
                'title' => 'Subvention Énergie Renouvelable Rurale',
                'description' => 'Subvention pour les projets d\'énergie renouvelable dans les zones rurales africaines.',
                'conditions' => 'Projet d\'énergie renouvelable, zone rurale, impact communautaire',
                'deadline' => '2025-10-15',
                'amount' => '75 000 €',
                'target_audience' => ['ONG', 'coopératives', 'entrepreneurs sociaux'],
                'country_sector_filter' => ['Afrique', 'Énergie', 'Rural'],
                'opportunity_type' => 'Subvention',
                'source_url' => 'https://energie-rurale-afrique.org/subventions'
            ]
        ];

        foreach ($demoOpportunities as $opportunityData) {
            // Vérifier si l'opportunité existe déjà
            $existing = Opportunity::where('title', $opportunityData['title'])->first();
            
            if (!$existing) {
                Opportunity::create($opportunityData);
                $this->line("✓ Ajouté: {$opportunityData['title']}");
            } else {
                $this->line("- Existe déjà: {$opportunityData['title']}");
            }
        }

        $this->info('Données de démonstration générées !');
    }

    /**
     * Scrape des sources externes (simulation)
     */
    private function scrapeExternalSources()
    {
        $this->info('Scraping des sources externes...');

        // Simulation de scraping de sources externes
        $externalSources = [
            'https://africaarena.com/opportunities',
            'https://enabel.be/fr/calls',
            'https://www.angellist.com/africa'
        ];

        foreach ($externalSources as $source) {
            $this->line("Scraping de {$source}...");
            
            // Simulation d'une requête HTTP
            try {
                // Dans un vrai projet, on utiliserait Http::get($source)
                // et on parserait le HTML avec DOMDocument ou Goutte
                
                $this->simulateExternalScraping($source);
                
                $this->line("✓ Scraping de {$source} terminé");
            } catch (\Exception $e) {
                $this->error("✗ Erreur lors du scraping de {$source}: " . $e->getMessage());
            }
        }

        $this->info('Scraping des sources externes terminé !');
    }

    /**
     * Simulation du scraping externe
     */
    private function simulateExternalScraping($source)
    {
        // Simulation de données scrapées
        $scrapedData = [
            [
                'title' => 'Appel à projets Innovation Sociale ' . date('Y'),
                'description' => 'Appel à projets pour les innovations sociales en Afrique de l\'Ouest (source: ' . $source . ')',
                'conditions' => 'Projet d\'innovation sociale, impact mesurable, équipe locale',
                'deadline' => '2025-11-30',
                'amount' => '30 000 €',
                'target_audience' => ['ONG', 'entrepreneurs sociaux'],
                'country_sector_filter' => ['Afrique de l\'Ouest', 'Social'],
                'opportunity_type' => 'Appel à projets',
                'source_url' => $source
            ]
        ];

        foreach ($scrapedData as $data) {
            // Vérifier si l'opportunité existe déjà
            $existing = Opportunity::where('title', $data['title'])
                                  ->where('source_url', $data['source_url'])
                                  ->first();
            
            if (!$existing) {
                Opportunity::create($data);
                $this->line("  ✓ Nouveau: {$data['title']}");
            }
        }
    }
}

