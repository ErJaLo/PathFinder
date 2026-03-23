<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        $latest = Post::published()
            ->latest()
            ->take(4)
            ->with(['user:id,name,img', 'categories:id,name', 'mainCountry:code,name'])
            ->withCount([
                'ratings as ratings_up_count' => fn ($q) => $q->where('value', 1),
                'ratings as ratings_down_count' => fn ($q) => $q->where('value', -1),
            ])
            ->get();

        $featured = $latest->shift();
        $experiences = $latest->values();

        return Inertia::render('home', [
            'canRegister' => Features::enabled(Features::registration()),
            'featured' => $featured,
            'experiences' => $experiences,
        ]);
    }
}
