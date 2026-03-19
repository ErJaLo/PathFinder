<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Aventura', 'description' => 'Experiències d\'aventura i esports extrems'],
            ['name' => 'Muntanyisme', 'description' => 'Senderisme, escalada i rutes de muntanya'],
            ['name' => 'Familiar', 'description' => 'Viatges ideals per a famílies amb nens'],
            ['name' => 'Històric', 'description' => 'Llocs amb valor històric i cultural'],
            ['name' => 'Romàntic', 'description' => 'Escapades per a parelles'],
            ['name' => 'Gastronòmic', 'description' => 'Rutes i experiències culinàries'],
            ['name' => 'Platja', 'description' => 'Destinacions de sol i platja'],
            ['name' => 'Natura', 'description' => 'Parcs naturals, reserves i paisatges'],
            ['name' => 'Urbà', 'description' => 'Ciutats, museus i vida nocturna'],
            ['name' => 'Backpacking', 'description' => 'Viatges amb motxilla i pressupost reduït'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
