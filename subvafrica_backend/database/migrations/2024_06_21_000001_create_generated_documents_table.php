<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('generated_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['cover_letter', 'cv', 'pitch_deck', 'application_file']);
            $table->string('filename');
            $table->string('file_path');
            $table->enum('format', ['pdf', 'html', 'docx', 'zip']);
            $table->json('metadata')->nullable(); // Pour stocker des métadonnées supplémentaires
            $table->timestamps();
            
            // Index pour améliorer les performances
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_documents');
    }
};

