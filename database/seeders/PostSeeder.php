<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Country;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Services\ImageOptimizer;

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

        // Ensure storage directory exists for local fallback
        Storage::disk('public')->makeDirectory('experiences');

        // Experiences with real bundled images
        $withImages = [
            [
                'title' => 'Champion Burger a Westfield la Maquinista',
                'content' => "Un grup d'estudiants i imbécils han anat a probar hamburgueses al event internacional de The Champions Burger.",
                'image' => 'ChampionBurger1.jpeg',
                'country_code' => 'ES',
                'latitude' => 41.4462,
                'longitude' => 2.1987,
            ],
            [
                'title' => 'Tast de hamburgueses a Champion Burger',
                'content' => "La primera hamburguesa que vam provar el Roger i jo va ser espectacular, la carn de wagyu del stand de 'El surtidor on fire' es la millor que hem provat.",
                'image' => 'ChampionBurger2.jpeg',
                'country_code' => 'ES',
                'latitude' => 41.4462,
                'longitude' => 2.1987,
            ],
            [
                'title' => 'Voley i tirar pedres a la platja de Mataró',
                'content' => "Tres individus van anar a passar el dia a la platja de Mataró, on a un li van fotre un cop amb la pilota de voley i després van anar a tirar pedres al mar. El dia va ser molt divertit i relaxant, amb molta sorra, poc sol i aigua molt freda.",
                'image' => 'UsAtTheBeach.jpeg',
                'country_code' => 'ES',
                'latitude' => 41.5343,
                'longitude' => 2.4476,
            ],
        ];

        // Experiences without images
        $withoutImages = [
            [
                'title' => 'Trekking al camp base de l\'Annapurna',
                'content' => "Deu dies a peu entre pobles gurung i terrasses d'arros, amb les altes muntanyes sempre al fons.\n\nEl dia del camp base la sortida del sol va ser un espectacle que val tot el viatge. A tenir en compte: porta roba d'abric real, les nits son glacials.\n\nRecomanem teahouses al llarg del cami, mes autentic que agencies organitzades.",
                'country_code' => 'NP',
                'latitude' => 28.5310,
                'longitude' => 83.8777,
            ],
            [
                'title' => 'Ruta pel Cami de Ronda',
                'content' => "Des de Tossa de Mar fins a Sant Feliu de Guixols a peu. Paisatge espectacular, mar cristallina, cales amagades.\n\nQuatre hores de ruta de dificultat moderada. Porteu aigua, protector solar i calcat comode.\n\nLa parada a mig cami a Canyelles val molt la pena per un bany.",
                'country_code' => 'ES',
                'latitude' => 41.7225,
                'longitude' => 2.9336,
            ],
            [
                'title' => 'Descobrint Kyoto al tardor',
                'content' => "Kyoto al novembre es puro color: temples envoltats de fulles vermelles i daurades. Magic.\n\nImprescindibles: Fushimi Inari, Kinkaku-ji, bosc de bambu d'Arashiyama. JR Pass molt recomanat per moure's rapid entre ciutats.\n\nA Nishiki Market, menjar de mercat a bon preu.",
                'country_code' => 'JP',
                'latitude' => 35.0116,
                'longitude' => 135.7681,
            ],
            [
                'title' => 'Road trip per Islandia',
                'content' => "Deu dies recorrent la Ring Road en autocaravana. Auroras boreals, glaceres, cascades (Gullfoss, Skogafoss) i banys a la Blue Lagoon.\n\nPressupost alt pero experiencia unica. Juliol es el millor mes si busques dies llargs i temps mes estable.",
                'country_code' => 'IS',
                'latitude' => 64.1466,
                'longitude' => -21.9426,
            ],
            [
                'title' => 'Marrakech: colors i sabors',
                'content' => "Tres dies al medina de Marrakech. Un laberint de colors, olors i sons. La placa Jemaa el-Fna al vespre es espectacular.\n\nRegateja sempre al souk. Prova el tagine de pollastre amb llimona confitada.\n\nDorm en un riad per viure l'experiencia completa.",
                'country_code' => 'MA',
                'latitude' => 31.6295,
                'longitude' => -7.9811,
            ],
            [
                'title' => 'Senderisme als Dolomites',
                'content' => "Una setmana entre cims i refugis al voltant de Cortina d'Ampezzo.\n\nTre Cime di Lavaredo es el punt culminant: classic, exigent, inoblidable. Menjar casolà als rifugios a bon preu.\n\nMillor epoca: juliol-setembre. Reserva refugis amb antel·lacio.",
                'country_code' => 'IT',
                'latitude' => 46.5404,
                'longitude' => 12.1357,
            ],
            [
                'title' => 'Cap de setmana a Lisboa',
                'content' => "Dos dies recorrent Alfama, Belem i el Chiado. Pastel de nata a Manteigaria i tramvia 28 al vespre quan ja no hi ha cua.\n\nCruise pel Tejo en caiac si fa bon temps: vista inhabitual de Lisboa des de l'aigua.",
                'country_code' => 'PT',
                'latitude' => 38.7223,
                'longitude' => -9.1393,
            ],
        ];

        foreach ($withoutImages as $exp) {
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

            $post->categories()->attach(
                $categories->random(rand(1, 3))->pluck('id')->toArray()
            );

            if ($exp['country_code']) {
                $post->countries()->attach($exp['country_code']);
            }
        }

        // Random drafts for variety
        foreach ($users as $user) {
            $numPosts = rand(0, 2);
            for ($i = 0; $i < $numPosts; $i++) {
                $countryCode = $countryCodes[array_rand($countryCodes)];
                $post = Post::factory()->create([
                    'user_id' => $user->id,
                    'country_code' => $countryCode,
                    'status' => fake()->randomElement(['published', 'published', 'draft']),
                ]);

                $post->categories()->attach(
                    $categories->random(rand(1, 2))->pluck('id')->toArray()
                );
                $post->countries()->attach($countryCode);
            }
        }

        // Experiences with bundled images (created last so they appear most recent)
        $optimizer = new ImageOptimizer();

        foreach ($withImages as $exp) {
            $imagePath = $this->storeSeedImage($exp['image'], $optimizer);

            $post = Post::factory()->create([
                'user_id' => $users->random()->id,
                'title' => $exp['title'],
                'content' => $exp['content'],
                'image' => $imagePath,
                'country_code' => $exp['country_code'],
                'latitude' => $exp['latitude'],
                'longitude' => $exp['longitude'],
                'status' => 'published',
                'experience_date' => now()->subDays(rand(5, 30)),
            ]);

            $post->categories()->attach(
                $categories->random(rand(1, 3))->pluck('id')->toArray()
            );

            if ($exp['country_code']) {
                $post->countries()->attach($exp['country_code']);
            }
        }
    }

    /**
     * Copy a bundled image from database/seeders/images/ and process it
     * through the ImageOptimizer (Cloudinary or local WebP).
     */
    private function storeSeedImage(string $filename, ImageOptimizer $optimizer): ?string
    {
        $sourcePath = database_path('seeders/images/' . $filename);

        if (!file_exists($sourcePath)) {
            return null;
        }

        // Copy to a temp file so we can wrap it as UploadedFile (not test mode)
        $tmpPath = tempnam(sys_get_temp_dir(), 'seed_');
        copy($sourcePath, $tmpPath);

        $file = new UploadedFile(
            $tmpPath,
            $filename,
            mime_content_type($tmpPath) ?: 'image/jpeg',
            null,
            true // test mode: skip HTTP upload validation
        );

        $url = $optimizer->store($file);

        @unlink($tmpPath);

        return $url;
    }
}
