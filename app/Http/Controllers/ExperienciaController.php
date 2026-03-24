<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Country;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperienciaController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::published()
            ->with(['user:id,name,img', 'categories:id,name', 'mainCountry:code,name'])
            ->withCount([
                'ratings as ratings_up_count' => fn ($q) => $q->where('value', 1),
                'ratings as ratings_down_count' => fn ($q) => $q->where('value', -1),
            ]);

        // Filter by category
        if ($request->filled('category')) {
            $query->byCategory((int) $request->category);
        }

        // Filter by country
        if ($request->filled('country')) {
            $query->where('country_code', $request->country);
        }

        // Search by title/content
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Sort
        $sort = $request->input('sort', 'new');
        $query = match ($sort) {
            'popular' => $query->orderByRaw('(SELECT COUNT(*) FROM ratings WHERE ratings.post_id = posts.id AND ratings.value = 1) DESC'),
            'score' => $query->orderByRaw('(SELECT COUNT(*) FROM ratings WHERE ratings.post_id = posts.id AND ratings.value = 1) - (SELECT COUNT(*) FROM ratings WHERE ratings.post_id = posts.id AND ratings.value = -1) DESC'),
            'date' => $query->orderBy('experience_date', 'desc'),
            default => $query->latest(), // 'new' — by created_at
        };

        $experiences = $query->paginate(12)->withQueryString();

        // Sidebar data
        $categories = Category::orderBy('name')->get(['id', 'name']);

        // Countries strip (all countries with at least one post)
        $countries = Country::whereHas('posts')
            ->orderBy('name')
            ->get(['code', 'name']);

        $trendingCountries = Country::withCount('posts')
            ->whereHas('posts')
            ->orderByDesc('posts_count')
            ->limit(5)
            ->get(['code', 'name']);

        $topUsers = User::withCount('posts')
            ->whereHas('posts')
            ->orderByDesc('posts_count')
            ->limit(4)
            ->get(['id', 'name', 'img']);

        return Inertia::render('explorar/index', [
            'experiences' => $experiences,
            'categories' => $categories,
            'countries' => $countries,
            'trendingCountries' => $trendingCountries,
            'topUsers' => $topUsers,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'country' => $request->input('country', ''),
                'sort' => $sort,
            ],
        ]);
    }
}
