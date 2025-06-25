<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            OpportunitySeeder::class,
        ]);

        // Créer un utilisateur de test
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@subvafrica.com',
        ]);
    }
}
