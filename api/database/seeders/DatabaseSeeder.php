<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\RelationType;
use App\Models\ResourceType;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Types de relations
        $relationTypes = [
            'famille',
            'amicale',
            'professionnelle',
            'intergenerationnelle',
        ];

        foreach ($relationTypes as $type) {
            RelationType::firstOrCreate(['name' => $type]);
        }

        // Types de ressources
        $resourceTypes = [
            'article',
            'video',
            'guide',
            'activite',
        ];

        foreach ($resourceTypes as $type) {
            ResourceType::firstOrCreate(['name' => $type]);
        }

        // Quelques catégories par défaut
        $categories = [
            'Communication',
            'Conflits',
            'Développement personnel',
            'Loisirs',
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
        }

        // Créer un utilisateur de test
        if (User::count() === 0) {
            User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'role' => \App\Enums\Role::SUPER_ADMIN,
            ]);
        }
    }
}
