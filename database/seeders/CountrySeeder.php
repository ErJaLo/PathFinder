<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            ['code' => 'ES', 'name' => 'Espanya', 'nationality' => 'Espanyol/a'],
            ['code' => 'FR', 'name' => 'França', 'nationality' => 'Francès/a'],
            ['code' => 'IT', 'name' => 'Itàlia', 'nationality' => 'Italià/na'],
            ['code' => 'PT', 'name' => 'Portugal', 'nationality' => 'Portuguès/a'],
            ['code' => 'DE', 'name' => 'Alemanya', 'nationality' => 'Alemany/a'],
            ['code' => 'GB', 'name' => 'Regne Unit', 'nationality' => 'Britànic/a'],
            ['code' => 'GR', 'name' => 'Grècia', 'nationality' => 'Grec/a'],
            ['code' => 'JP', 'name' => 'Japó', 'nationality' => 'Japonès/a'],
            ['code' => 'US', 'name' => 'Estats Units', 'nationality' => 'Estatunidenc/a'],
            ['code' => 'MX', 'name' => 'Mèxic', 'nationality' => 'Mexicà/na'],
            ['code' => 'MA', 'name' => 'Marroc', 'nationality' => 'Marroquí'],
            ['code' => 'TH', 'name' => 'Tailàndia', 'nationality' => 'Tailandès/a'],
            ['code' => 'AR', 'name' => 'Argentina', 'nationality' => 'Argentí/na'],
            ['code' => 'HR', 'name' => 'Croàcia', 'nationality' => 'Croat/a'],
            ['code' => 'IS', 'name' => 'Islàndia', 'nationality' => 'Islandès/a'],
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(['code' => $country['code']], $country);
        }
    }
}
