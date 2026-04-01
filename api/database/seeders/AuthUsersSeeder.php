<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AuthUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@ressources.local',
                'role' => Role::SUPER_ADMIN,
            ],
            [
                'name' => 'Admin One',
                'email' => 'admin1@ressources.local',
                'role' => Role::ADMIN,
            ],
            [
                'name' => 'Admin Two',
                'email' => 'admin2@ressources.local',
                'role' => Role::ADMIN,
            ],
            [
                'name' => 'Moderator One',
                'email' => 'moderator1@ressources.local',
                'role' => Role::MODERATOR,
            ],
            [
                'name' => 'Moderator Two',
                'email' => 'moderator2@ressources.local',
                'role' => Role::MODERATOR,
            ],
            [
                'name' => 'Citizen One',
                'email' => 'citizen1@ressources.local',
                'role' => Role::CITIZEN,
            ],
            [
                'name' => 'Citizen Two',
                'email' => 'citizen2@ressources.local',
                'role' => Role::CITIZEN,
            ],
            [
                'name' => 'Citizen Three',
                'email' => 'citizen3@ressources.local',
                'role' => Role::CITIZEN,
            ],
            [
                'name' => 'Citizen Four',
                'email' => 'citizen4@ressources.local',
                'role' => Role::CITIZEN,
            ],
            [
                'name' => 'Citizen Five',
                'email' => 'citizen5@ressources.local',
                'role' => Role::CITIZEN,
            ],
        ];

        foreach ($users as $data) {
            User::query()->updateOrCreate(
                ['email_hash' => User::hashEmailValue($data['email'])],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => 'password123',
                    'role' => $data['role'],
                    'is_active' => true,
                ]
            );
        }
    }
}
