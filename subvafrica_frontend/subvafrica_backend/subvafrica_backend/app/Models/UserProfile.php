<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'company_name',
        'sectors',
        'experience_level',
        'project_type',
        'funding_amount_range',
        'location',
        'description',
        'website',
        'phone',
        'linkedin_profile',
    ];

    protected $casts = [
        'sectors' => 'array',
    ];

    /**
     * Relation avec le modèle User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec les alertes
     */
    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    /**
     * Relation avec les candidatures
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
