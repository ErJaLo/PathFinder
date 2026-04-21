<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::factory()->admin()->create([
            'name' => 'Marta Puig',
            'email' => 'admin@viatges.cat',
            'password' => Hash::make('admin1234'),
        ]);

        // Moderator
        User::factory()->moderator()->create([
            'name' => 'Jordi Carreras',
            'email' => 'mod@viatges.cat',
            'password' => Hash::make('mod12345'),
        ]);

        // Regular users with realistic names
        $users = [
            ['name' => 'Laura Vidal', 'email' => 'user@viatges.cat'],
            ['name' => 'Pau Bosch', 'email' => 'pau.bosch@viatges.cat'],
            ['name' => 'Clara Sala', 'email' => 'clara.sala@viatges.cat'],
            ['name' => 'Marc Ferrer', 'email' => 'marc.ferrer@viatges.cat'],
            ['name' => 'Nuria Molina', 'email' => 'nuria.molina@viatges.cat'],
            ['name' => 'Adria Castells', 'email' => 'adria.castells@viatges.cat'],
            ['name' => 'Helena Roig', 'email' => 'helena.roig@viatges.cat'],
            ['name' => 'Guillem Torres', 'email' => 'guillem.torres@viatges.cat'],
            ['name' => 'Ines Mas', 'email' => 'ines.mas@viatges.cat'],
            ['name' => 'Oriol Serra', 'email' => 'oriol.serra@viatges.cat'],
        ];

        foreach ($users as $i => $userData) {
            User::factory()->create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($i === 0 ? 'user1234' : 'password'),
            ]);
        }
    }
}
