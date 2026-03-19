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
            'name' => 'El Jefe de Estación',
            'email' => 'admin@viatges.cat',
            'password' => Hash::make('admin1234'),
        ]);

        // Moderator
        User::factory()->moderator()->create([
            'name' => 'El Revisor Fantasma',
            'email' => 'mod@viatges.cat',
            'password' => Hash::make('mod12345'),
        ]);

        // Regular users con nombres de bromas de Renfe
        $users = [
            ['name' => 'Llego Tarde Martínez', 'email' => 'user@viatges.cat'],
            ['name' => 'Retraso Confirmado García', 'email' => 'retraso@viatges.cat'],
            ['name' => 'Avería Técnica López', 'email' => 'averia@viatges.cat'],
            ['name' => 'Vía Alternativa Pérez', 'email' => 'via.alternativa@viatges.cat'],
            ['name' => 'Tren Suprimido Fernández', 'email' => 'suprimido@viatges.cat'],
            ['name' => 'Andén Equivocado Ruiz', 'email' => 'anden@viatges.cat'],
            ['name' => 'Señora del Vagón Bar', 'email' => 'vagonbar@viatges.cat'],
            ['name' => 'Wifi No Funciona Sánchez', 'email' => 'sinwifi@viatges.cat'],
            ['name' => 'Asiento Reservado por Nadie', 'email' => 'reservado@viatges.cat'],
            ['name' => 'Lamentamos las Molestias', 'email' => 'molestias@viatges.cat'],
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
