<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\UserProfile;
use App\Models\Opportunity;
use App\Models\Application;
use App\Services\DocumentGenerationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentGenerationController extends Controller
{
    protected $documentService;

    public function __construct(DocumentGenerationService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Génère une lettre de motivation personnalisée
     */
    public function generateCoverLetter(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'opportunity_id' => 'required|exists:opportunities,id',
            'company_name' => 'required|string|max:255',
            'position_title' => 'required|string|max:255',
            'additional_info' => 'nullable|string|max:1000',
            'format' => 'in:pdf,html,docx|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            $userProfile = UserProfile::where('user_id', $user->id)->first();
            $opportunity = Opportunity::findOrFail($request->opportunity_id);

            $documentData = [
                'user_profile' => $userProfile,
                'opportunity' => $opportunity,
                'company_name' => $request->company_name,
                'position_title' => $request->position_title,
                'additional_info' => $request->additional_info ?? '',
                'format' => $request->format ?? 'pdf'
            ];

            $document = $this->documentService->generateCoverLetter($documentData);

            return response()->json([
                'success' => true,
                'document' => $document,
                'message' => 'Lettre de motivation générée avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération de la lettre de motivation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Génère un CV optimisé par secteur
     */
    public function generateCV(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sector' => 'required|string|max:255',
            'template' => 'in:modern,classic,creative|nullable',
            'format' => 'in:pdf,html,docx|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            $userProfile = UserProfile::where('user_id', $user->id)->first();

            $documentData = [
                'user_profile' => $userProfile,
                'sector' => $request->sector,
                'template' => $request->template ?? 'modern',
                'format' => $request->format ?? 'pdf'
            ];

            $document = $this->documentService->generateCV($documentData);

            return response()->json([
                'success' => true,
                'document' => $document,
                'message' => 'CV généré avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du CV',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Génère un pitch deck automatique
     */
    public function generatePitchDeck(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'project_name' => 'required|string|max:255',
            'project_description' => 'required|string|max:2000',
            'target_audience' => 'required|string|max:500',
            'key_points' => 'required|array|min:3|max:10',
            'key_points.*' => 'string|max:255',
            'format' => 'in:pdf,pptx,html|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            $userProfile = UserProfile::where('user_id', $user->id)->first();

            $documentData = [
                'user_profile' => $userProfile,
                'project_name' => $request->project_name,
                'project_description' => $request->project_description,
                'target_audience' => $request->target_audience,
                'key_points' => $request->key_points,
                'format' => $request->format ?? 'pdf'
            ];

            $document = $this->documentService->generatePitchDeck($documentData);

            return response()->json([
                'success' => true,
                'document' => $document,
                'message' => 'Pitch deck généré avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du pitch deck',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Génère un dossier de candidature complet
     */
    public function generateApplicationFile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'opportunity_id' => 'required|exists:opportunities,id',
            'include_cover_letter' => 'boolean',
            'include_cv' => 'boolean',
            'include_portfolio' => 'boolean',
            'additional_documents' => 'array|nullable',
            'additional_documents.*' => 'string',
            'format' => 'in:zip,pdf|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            $userProfile = UserProfile::where('user_id', $user->id)->first();
            $opportunity = Opportunity::findOrFail($request->opportunity_id);

            $documentData = [
                'user_profile' => $userProfile,
                'opportunity' => $opportunity,
                'include_cover_letter' => $request->include_cover_letter ?? true,
                'include_cv' => $request->include_cv ?? true,
                'include_portfolio' => $request->include_portfolio ?? false,
                'additional_documents' => $request->additional_documents ?? [],
                'format' => $request->format ?? 'zip'
            ];

            $document = $this->documentService->generateApplicationFile($documentData);

            return response()->json([
                'success' => true,
                'document' => $document,
                'message' => 'Dossier de candidature généré avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du dossier de candidature',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupère l'historique des documents générés par l'utilisateur
     */
    public function getDocumentHistory(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $documents = $this->documentService->getUserDocumentHistory($user->id);

            return response()->json([
                'success' => true,
                'documents' => $documents
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'historique',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Télécharge un document généré
     */
    public function downloadDocument(Request $request, $documentId): JsonResponse
    {
        try {
            $user = Auth::user();
            $document = $this->documentService->getDocument($documentId, $user->id);

            if (!$document) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document non trouvé'
                ], 404);
            }

            return response()->download($document['file_path'], $document['filename']);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime un document généré
     */
    public function deleteDocument(Request $request, $documentId): JsonResponse
    {
        try {
            $user = Auth::user();
            $result = $this->documentService->deleteDocument($documentId, $user->id);

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Document supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

