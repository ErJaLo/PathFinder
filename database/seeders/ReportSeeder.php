<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $posts = Post::where('status', 'published')->inRandomOrder()->take(20)->get();

        foreach ($posts as $post) {
            // Busquem un usuari que no sigui l'autor del post
            $reporters = $users->where('id', '!=', $post->user_id);

            if ($reporters->isEmpty()) {
                continue;
            }

            $reporter = $reporters->random();

            Report::create([
                'user_id' => $reporter->id,
                'post_id' => $post->id,
                'reason' => fake()->randomElement([
                    'Contingut ofensiu o inadequat',
                    'Informació falsa o enganyosa',
                    'Spam o publicitat',
                    'Odi corporatiu / discriminació',
                    'Falta de respecte o assetjament',
                ]),
                'status' => fake()->randomElement(['pending', 'dismissed', "accepted"]),
            ]);
        }
    }
}
