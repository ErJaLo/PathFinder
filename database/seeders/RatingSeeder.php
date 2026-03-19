<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Seeder;

class RatingSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $posts = Post::where('status', 'published')->get();

        foreach ($posts as $post) {
            // Each post gets voted by 2-6 random users
            $voters = $users->where('id', '!=', $post->user_id)->random(min(rand(2, 6), $users->count() - 1));

            foreach ($voters as $voter) {
                Rating::create([
                    'user_id' => $voter->id,
                    'post_id' => $post->id,
                    'value' => fake()->randomElement([1, 1, 1, -1]), // 75% positive
                ]);
            }
        }
    }
}
