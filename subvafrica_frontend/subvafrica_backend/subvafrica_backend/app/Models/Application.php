<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_profile_id',
        'opportunity_id',
        'status',
        'submitted_at',
        'documents',
        'notes',
        'ai_generated_content',
        'follow_up_date',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'follow_up_date' => 'datetime',
        'documents' => 'array',
        'ai_generated_content' => 'array',
    ];

    /**
     * Relation avec le profil utilisateur
     */
    public function userProfile()
    {
        return $this->belongsTo(UserProfile::class);
    }

    /**
     * Relation avec l'opportunité
     */
    public function opportunity()
    {
        return $this->belongsTo(Opportunity::class);
    }

    /**
     * Statuts possibles
     */
    public static function getStatuses()
    {
        return [
            'draft' => 'Brouillon',
            'in_progress' => 'En cours',
            'submitted' => 'Soumise',
            'under_review' => 'En cours d\'examen',
            'accepted' => 'Acceptée',
            'rejected' => 'Refusée',
            'withdrawn' => 'Retirée',
        ];
    }

    /**
     * Vérifier si la candidature nécessite un suivi
     */
    public function needsFollowUp()
    {
        return $this->follow_up_date && $this->follow_up_date->isPast() && 
               in_array($this->status, ['submitted', 'under_review']);
    }
}
