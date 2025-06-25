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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('opportunity_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['draft', 'in_progress', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->json('documents')->nullable(); // Documents joints
            $table->text('notes')->nullable(); // Notes de l'utilisateur
            $table->json('ai_generated_content')->nullable(); // Contenu généré par l'IA
            $table->timestamp('follow_up_date')->nullable(); // Date de rappel de suivi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};

