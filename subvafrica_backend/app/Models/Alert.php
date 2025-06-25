<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_profile_id',
        'name',
        'criteria',
        'is_active',
        'frequency',
        'last_sent_at',
    ];

    protected $casts = [
        'criteria' => 'array',
        'is_active' => 'boolean',
        'last_sent_at' => 'datetime',
    ];

    /**
     * Relation avec le profil utilisateur
     */
    public function userProfile()
    {
        return $this->belongsTo(UserProfile::class);
    }

    /**
     * Vérifier si l'alerte doit être envoyée
     */
    public function shouldSend()
    {
        if (!$this->is_active) {
            return false;
        }

        if (!$this->last_sent_at) {
            return true;
        }

        $interval = match($this->frequency) {
            'daily' => 1,
            'weekly' => 7,
            'monthly' => 30,
            default => 7
        };

        return $this->last_sent_at->addDays($interval)->isPast();
    }
}
