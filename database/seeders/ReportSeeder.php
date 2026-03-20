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
        $posts = Post::where('status', 'published')->inRandomOrder()->take(3)->get();

        foreach ($posts as $post) {
            $reporter = $users->where('id', '!=', $post->user_id)->random();

            Report::create([
                'user_id' => $reporter->id,
                'post_id' => $post->id,
                'reason' => fake()->randomElement([
                    'Contingut ofensiu o inadequat',
                    'Informació falsa o enganyosa',
                    'Spam o publicitat',
                ]),
                'status' => 'pending',
            ]);
        }
    }
}
