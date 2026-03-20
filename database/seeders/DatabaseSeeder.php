<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            CategorySeeder::class,
            UserSeeder::class,
            PostSeeder::class,
            RatingSeeder::class,
            ReportSeeder::class,
        ]);
    }
}
