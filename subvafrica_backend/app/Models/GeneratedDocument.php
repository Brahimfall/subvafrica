<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'filename',
        'file_path',
        'format',
        'metadata',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Relation avec le modèle User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope pour filtrer par type de document
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour filtrer par format
     */
    public function scopeOfFormat($query, $format)
    {
        return $query->where('format', $format);
    }

    /**
     * Accessor pour obtenir l'URL publique du document
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Accessor pour obtenir la taille du fichier
     */
    public function getFileSizeAttribute()
    {
        if (file_exists($this->file_path)) {
            return filesize($this->file_path);
        }
        return 0;
    }

    /**
     * Accessor pour obtenir la taille du fichier formatée
     */
    public function getFormattedFileSizeAttribute()
    {
        $size = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, 2) . ' ' . $units[$i];
    }

    /**
     * Vérifie si le fichier existe physiquement
     */
    public function fileExists(): bool
    {
        return file_exists($this->file_path);
    }

    /**
     * Supprime le fichier physique
     */
    public function deleteFile(): bool
    {
        if ($this->fileExists()) {
            return unlink($this->file_path);
        }
        return true;
    }

    /**
     * Types de documents disponibles
     */
    public static function getAvailableTypes(): array
    {
        return [
            'cover_letter' => 'Lettre de motivation',
            'cv' => 'CV',
            'pitch_deck' => 'Pitch deck',
            'application_file' => 'Dossier de candidature'
        ];
    }

    /**
     * Formats de documents disponibles
     */
    public static function getAvailableFormats(): array
    {
        return [
            'pdf' => 'PDF',
            'html' => 'HTML',
            'docx' => 'Word',
            'zip' => 'Archive ZIP'
        ];
    }
}

