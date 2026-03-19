<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Country;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $categories = Category::all();
        $countryCodes = Country::pluck('code')->toArray();

        if ($users->isEmpty() || $categories->isEmpty()) {
            return;
        }

        // Experiències predefinides
        $experiences = [
            [
                'title' => 'Ruta pel Camí de Ronda',
                'content' => "Una experiència increïble caminant pel Camí de Ronda, des de Tossa de Mar fins a Sant Feliu de Guíxols.\n\nEl paisatge és espectacular, amb vistes al mar Mediterrani i cales escondides. Recomanem portar aigua i protecció solar.\n\nLa ruta dura unes 4 hores i és de dificultat moderada.",
                'country_code' => 'ES',
                'latitude' => 41.7225,
                'longitude' => 2.9336,
            ],
            [
                'title' => 'Descobrint Kyoto al tardor',
                'content' => "Kyoto al novembre és màgic. Els temples envoltat de fulles vermelles i daurades creen un ambient únic.\n\nVam visitar el Fushimi Inari, el Kinkaku-ji i el bosc de bambú d'Arashiyama. Recomanem el JR Pass per moure's fàcilment.\n\nEl menjar al Nishiki Market és imprescindible.",
                'country_code' => 'JP',
                'latitude' => 35.0116,
                'longitude' => 135.7681,
            ],
            [
                'title' => 'Road trip per Islàndia',
                'content' => "10 dies recorrent la Ring Road d'Islàndia en autocaravana.\n\nVam veure aurores boreals, glaceres, cascades impressionants com Gullfoss i Skógafoss, i ens vam banyar a la Blue Lagoon.\n\nEl pressupost és alt però val cada cèntim. Juliol és el millor mes per anar.",
                'country_code' => 'IS',
                'latitude' => 64.1466,
                'longitude' => -21.9426,
            ],
            [
                'title' => 'Marrakech: colors i sabors',
                'content' => "Tres dies a Marrakech van ser suficients per enamorar-nos de la ciutat.\n\nEl souk és un laberint de colors, olors i sons. La plaça Jemaa el-Fna al vespre és un espectacle.\n\nRecomanem regatejar sempre i provar el tagine de pollastre amb llimona confitada.",
                'country_code' => 'MA',
                'latitude' => 31.6295,
                'longitude' => -7.9811,
            ],
            [
                'title' => 'Senderisme als Dolomites',
                'content' => "Una setmana de senderisme als Dolomites italians, al voltant de Cortina d'Ampezzo.\n\nLes Tre Cime di Lavaredo són el punt culminant. Les rifugios ofereixen menjar casolà excel·lent.\n\nNivell moderat-alt. Millor època: juliol-setembre.",
                'country_code' => 'IT',
                'latitude' => 46.5404,
                'longitude' => 12.1357,
            ],
        ];

        foreach ($experiences as $i => $exp) {
            $post = Post::factory()->create([
                'user_id' => $users->random()->id,
                'title' => $exp['title'],
                'content' => $exp['content'],
                'country_code' => $exp['country_code'],
                'latitude' => $exp['latitude'],
                'longitude' => $exp['longitude'],
                'status' => 'published',
                'experience_date' => now()->subDays(rand(5, 180)),
            ]);

            // Assign 1-3 random categories
            $post->categories()->attach(
                $categories->random(rand(1, 3))->pluck('id')->toArray()
            );

            // Assign countries
            if ($exp['country_code']) {
                $post->countries()->attach($exp['country_code']);
            }
        }

        // Additional random posts (some drafts)
        foreach ($users as $user) {
            $numPosts = rand(1, 3);
            for ($i = 0; $i < $numPosts; $i++) {
                $countryCode = $countryCodes[array_rand($countryCodes)];
                $post = Post::factory()->create([
                    'user_id' => $user->id,
                    'country_code' => $countryCode,
                    'status' => fake()->randomElement(['published', 'published', 'published', 'draft']),
                ]);

                $post->categories()->attach(
                    $categories->random(rand(1, 2))->pluck('id')->toArray()
                );
                $post->countries()->attach($countryCode);
            }
        }
    }
}
