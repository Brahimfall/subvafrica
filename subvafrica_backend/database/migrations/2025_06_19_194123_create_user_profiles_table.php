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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('company_name')->nullable();
            $table->json('sectors')->nullable(); // Secteurs d'intérêt
            $table->enum('experience_level', ['beginner', 'intermediate', 'expert'])->nullable();
            $table->string('project_type')->nullable(); // startup, research, social, etc.
            $table->string('funding_amount_range')->nullable(); // Montant recherché
            $table->string('location')->nullable(); // Pays/région
            $table->text('description')->nullable(); // Description du profil/projet
            $table->string('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('linkedin_profile')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};

