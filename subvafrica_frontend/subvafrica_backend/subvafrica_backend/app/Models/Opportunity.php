<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'conditions',
        'deadline',
        'amount',
        'target_audience',
        'country_sector_filter',
        'opportunity_type',
        'source_url',
    ];

    protected $casts = [
        'target_audience' => 'array',
        'country_sector_filter' => 'array',
        'deadline' => 'date',
    ];
}


