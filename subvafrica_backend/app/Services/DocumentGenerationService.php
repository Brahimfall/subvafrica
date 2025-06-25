<?php

namespace App\Services;

use App\Models\UserProfile;
use App\Models\Opportunity;
use App\Models\GeneratedDocument;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentGenerationService
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Génère une lettre de motivation personnalisée
     */
    public function generateCoverLetter(array $data): array
    {
        $userProfile = $data['user_profile'];
        $opportunity = $data['opportunity'];
        
        // Préparer le prompt pour l'IA
        $prompt = $this->buildCoverLetterPrompt($userProfile, $opportunity, $data);
        
        // Générer le contenu avec l'IA
        $content = $this->aiService->generateContent($prompt);
        
        // Créer le document HTML
        $html = $this->buildCoverLetterHTML($content, $data);
        
        // Générer le fichier selon le format demandé
        $document = $this->generateDocumentFile($html, 'cover_letter', $data['format']);
        
        // Sauvegarder en base de données
        $this->saveDocumentRecord($userProfile->user_id, 'cover_letter', $document);
        
        return $document;
    }

    /**
     * Génère un CV optimisé par secteur
     */
    public function generateCV(array $data): array
    {
        $userProfile = $data['user_profile'];
        
        // Préparer le prompt pour l'IA
        $prompt = $this->buildCVPrompt($userProfile, $data['sector']);
        
        // Générer le contenu avec l'IA
        $content = $this->aiService->generateContent($prompt);
        
        // Créer le document HTML avec le template choisi
        $html = $this->buildCVHTML($content, $userProfile, $data);
        
        // Générer le fichier selon le format demandé
        $document = $this->generateDocumentFile($html, 'cv', $data['format']);
        
        // Sauvegarder en base de données
        $this->saveDocumentRecord($userProfile->user_id, 'cv', $document);
        
        return $document;
    }

    /**
     * Génère un pitch deck automatique
     */
    public function generatePitchDeck(array $data): array
    {
        $userProfile = $data['user_profile'];
        
        // Préparer le prompt pour l'IA
        $prompt = $this->buildPitchDeckPrompt($data);
        
        // Générer le contenu avec l'IA
        $content = $this->aiService->generateContent($prompt);
        
        // Créer le document HTML pour le pitch deck
        $html = $this->buildPitchDeckHTML($content, $data);
        
        // Générer le fichier selon le format demandé
        $document = $this->generateDocumentFile($html, 'pitch_deck', $data['format']);
        
        // Sauvegarder en base de données
        $this->saveDocumentRecord($userProfile->user_id, 'pitch_deck', $document);
        
        return $document;
    }

    /**
     * Génère un dossier de candidature complet
     */
    public function generateApplicationFile(array $data): array
    {
        $documents = [];
        $userProfile = $data['user_profile'];
        $opportunity = $data['opportunity'];
        
        // Générer la lettre de motivation si demandée
        if ($data['include_cover_letter']) {
            $coverLetterData = [
                'user_profile' => $userProfile,
                'opportunity' => $opportunity,
                'company_name' => $opportunity->company_name ?? 'Entreprise',
                'position_title' => $opportunity->title,
                'additional_info' => '',
                'format' => 'pdf'
            ];
            $documents['cover_letter'] = $this->generateCoverLetter($coverLetterData);
        }
        
        // Générer le CV si demandé
        if ($data['include_cv']) {
            $cvData = [
                'user_profile' => $userProfile,
                'sector' => $opportunity->sector ?? 'Général',
                'template' => 'modern',
                'format' => 'pdf'
            ];
            $documents['cv'] = $this->generateCV($cvData);
        }
        
        // Créer une archive ZIP avec tous les documents
        $zipPath = $this->createApplicationZip($documents, $data);
        
        $document = [
            'filename' => 'dossier_candidature_' . Str::slug($opportunity->title) . '.zip',
            'file_path' => $zipPath,
            'url' => Storage::url($zipPath),
            'type' => 'application_file',
            'format' => 'zip'
        ];
        
        // Sauvegarder en base de données
        $this->saveDocumentRecord($userProfile->user_id, 'application_file', $document);
        
        return $document;
    }

    /**
     * Construit le prompt pour la génération de lettre de motivation
     */
    private function buildCoverLetterPrompt($userProfile, $opportunity, $data): string
    {
        return "Génère une lettre de motivation professionnelle en français pour :
        
        Candidat :
        - Nom : {$userProfile->first_name} {$userProfile->last_name}
        - Email : {$userProfile->email}
        - Téléphone : {$userProfile->phone}
        - Compétences : {$userProfile->skills}
        - Expérience : {$userProfile->experience}
        
        Opportunité :
        - Entreprise : {$data['company_name']}
        - Poste : {$data['position_title']}
        - Description : {$opportunity->description}
        - Secteur : {$opportunity->sector}
        
        Informations supplémentaires : {$data['additional_info']}
        
        La lettre doit être personnalisée, professionnelle et mettre en avant les compétences pertinentes du candidat par rapport au poste.";
    }

    /**
     * Construit le prompt pour la génération de CV
     */
    private function buildCVPrompt($userProfile, $sector): string
    {
        return "Génère un CV professionnel optimisé pour le secteur '{$sector}' en français pour :
        
        Candidat :
        - Nom : {$userProfile->first_name} {$userProfile->last_name}
        - Email : {$userProfile->email}
        - Téléphone : {$userProfile->phone}
        - Adresse : {$userProfile->address}
        - Compétences : {$userProfile->skills}
        - Expérience : {$userProfile->experience}
        - Formation : {$userProfile->education}
        - Langues : {$userProfile->languages}
        
        Le CV doit être structuré, professionnel et mettre en avant les éléments les plus pertinents pour le secteur '{$sector}'.";
    }

    /**
     * Construit le prompt pour la génération de pitch deck
     */
    private function buildPitchDeckPrompt($data): string
    {
        $keyPointsText = implode(', ', $data['key_points']);
        
        return "Génère le contenu d'un pitch deck professionnel en français pour :
        
        Projet : {$data['project_name']}
        Description : {$data['project_description']}
        Public cible : {$data['target_audience']}
        Points clés : {$keyPointsText}
        
        Le pitch deck doit contenir environ 10-12 slides avec :
        1. Titre et accroche
        2. Problème identifié
        3. Solution proposée
        4. Marché cible
        5. Modèle économique
        6. Concurrence
        7. Équipe
        8. Roadmap
        9. Financement
        10. Contact
        
        Chaque slide doit avoir un titre et un contenu concis et percutant.";
    }

    /**
     * Construit le HTML pour la lettre de motivation
     */
    private function buildCoverLetterHTML($content, $data): string
    {
        return view('documents.cover_letter', [
            'content' => $content,
            'data' => $data
        ])->render();
    }

    /**
     * Construit le HTML pour le CV
     */
    private function buildCVHTML($content, $userProfile, $data): string
    {
        return view('documents.cv', [
            'content' => $content,
            'userProfile' => $userProfile,
            'template' => $data['template']
        ])->render();
    }

    /**
     * Construit le HTML pour le pitch deck
     */
    private function buildPitchDeckHTML($content, $data): string
    {
        return view('documents.pitch_deck', [
            'content' => $content,
            'data' => $data
        ])->render();
    }

    /**
     * Génère le fichier document selon le format demandé
     */
    private function generateDocumentFile($html, $type, $format): array
    {
        $filename = $type . '_' . time() . '_' . Str::random(8);
        
        switch ($format) {
            case 'pdf':
                $pdf = Pdf::loadHTML($html);
                $path = "documents/{$filename}.pdf";
                Storage::put($path, $pdf->output());
                break;
                
            case 'html':
                $path = "documents/{$filename}.html";
                Storage::put($path, $html);
                break;
                
            case 'docx':
                // Implémentation pour DOCX si nécessaire
                $path = "documents/{$filename}.html";
                Storage::put($path, $html);
                break;
                
            default:
                $path = "documents/{$filename}.pdf";
                $pdf = Pdf::loadHTML($html);
                Storage::put($path, $pdf->output());
        }
        
        return [
            'filename' => basename($path),
            'file_path' => storage_path('app/' . $path),
            'url' => Storage::url($path),
            'type' => $type,
            'format' => $format
        ];
    }

    /**
     * Crée une archive ZIP pour le dossier de candidature
     */
    private function createApplicationZip($documents, $data): string
    {
        $zip = new \ZipArchive();
        $zipFilename = 'application_' . time() . '_' . Str::random(8) . '.zip';
        $zipPath = storage_path('app/documents/' . $zipFilename);
        
        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
            foreach ($documents as $type => $document) {
                $zip->addFile($document['file_path'], $document['filename']);
            }
            $zip->close();
        }
        
        return 'documents/' . $zipFilename;
    }

    /**
     * Sauvegarde l'enregistrement du document en base de données
     */
    private function saveDocumentRecord($userId, $type, $document): void
    {
        GeneratedDocument::create([
            'user_id' => $userId,
            'type' => $type,
            'filename' => $document['filename'],
            'file_path' => $document['file_path'],
            'format' => $document['format'],
            'created_at' => now()
        ]);
    }

    /**
     * Récupère l'historique des documents d'un utilisateur
     */
    public function getUserDocumentHistory($userId): array
    {
        return GeneratedDocument::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Récupère un document spécifique
     */
    public function getDocument($documentId, $userId): ?array
    {
        $document = GeneratedDocument::where('id', $documentId)
            ->where('user_id', $userId)
            ->first();
            
        return $document ? $document->toArray() : null;
    }

    /**
     * Supprime un document
     */
    public function deleteDocument($documentId, $userId): bool
    {
        $document = GeneratedDocument::where('id', $documentId)
            ->where('user_id', $userId)
            ->first();
            
        if ($document) {
            // Supprimer le fichier physique
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }
            
            // Supprimer l'enregistrement en base
            $document->delete();
            
            return true;
        }
        
        return false;
    }
}

