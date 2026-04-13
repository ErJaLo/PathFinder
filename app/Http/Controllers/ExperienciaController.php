<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Country;
use App\Models\Post;
use App\Models\Rating;
use App\Models\Report;
use App\Models\User;
use App\Services\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExperienciaController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::published()
            ->with(['user:id,name,img', 'categories:id,name', 'mainCountry:code,name'])
            ->withCount([
                'ratings as ratings_up_count' => fn($q) => $q->where('value', 1),
                'ratings as ratings_down_count' => fn($q) => $q->where('value', -1),
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



    public function create()
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);
        $countries = Country::orderBy('name')->get(['code', 'name']);

        return Inertia::render('experiencies/crear', [
            'categories' => $categories,
            'countries' => $countries,
        ]);
    }

    public function store(Request $request)
    {
        $isDraft = $request->input('status') === 'draft';

        $rules = [
            'title' => $isDraft ? 'nullable|string|max:255' : 'required|string|max:255',
            'content' => $isDraft ? 'nullable|string' : 'required|string',
            'experience_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'country_code' => 'nullable|string|exists:countries,code',
            'categories' => $isDraft ? 'nullable|array' : 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'status' => 'required|in:draft,published',
        ];

        $validated = $request->validate($rules);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $optimizer = new ImageOptimizer();
            $imagePath = '/storage/' . $optimizer->store($request->file('image'));
        }

        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'] ?? '',
            'content' => $validated['content'] ?? '',
            'experience_date' => $validated['experience_date'] ?? null,
            'image' => $imagePath,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'country_code' => $validated['country_code'] ?? null,
            'status' => $validated['status'],
        ]);

        if (!empty($validated['categories'])) {
            $post->categories()->sync($validated['categories']);
        }

        if ($validated['status'] === 'published') {
            return redirect()->route('explorar.index')->with('success', 'Experiencia publicada!');
        }

        return redirect()->route('experiencies.edit', $post)->with('success', 'Esborrany guardat!');
    }

    public function show(Request $request, Post $post)
    {
        $post->load(['categories:id,name', 'mainCountry:code,name']);
        $post->loadCount([
            'ratings as ratings_up_count' => fn($q) => $q->where('value', 1),
            'ratings as ratings_down_count' => fn($q) => $q->where('value', -1),
        ]);

        $userRatingValue = null;

        if ($request->user()) {
            $userRatingValue = Rating::where('user_id', $request->user()->id)
                ->where('post_id', $post->id)
                ->value('value');
        }

        $post->setAttribute('user_rating_value', $userRatingValue);

        // Author with stats
        $author = User::where('id', $post->user_id)
            ->withCount('posts')
            ->first(['id', 'name', 'img', 'created_at']);

        // Sum of positive ratings across all author's posts
        $authorScore = Post::where('user_id', $post->user_id)
            ->withCount(['ratings as up' => fn($q) => $q->where('value', 1)])
            ->get()
            ->sum('up');

        return Inertia::render('experiencies/show', [
            'experience' => $post,
            'author' => [
                'id' => $author->id,
                'name' => $author->name,
                'img' => $author->img,
                'created_at' => $author->created_at,
                'posts_count' => $author->posts_count,
                'score' => $authorScore,
            ],
        ]);
    }

    public function rate(Request $request, Post $post)
    {
        $validated = $request->validate([
            'value' => ['required', 'integer', 'in:-1,0,1'],
        ]);

        $value = (int) $validated['value'];

        if ($value === 0) {
            Rating::where('user_id', $request->user()->id)
                ->where('post_id', $post->id)
                ->delete();
        } else {
            Rating::updateOrCreate(
                [
                    'user_id' => $request->user()->id,
                    'post_id' => $post->id,
                ],
                [
                    'value' => $value,
                ]
            );
        }

        return back()->with('success', 'Vot actualitzat');
    }

    public function meves(Request $request){
        $query = Post::where('user_id', $request->user()->id)
            ->with(['categories:id,name', 'mainCountry:code,name'])
            ->withCount([
                'ratings as ratings_up_count' => fn($q) => $q->where('value', 1),
                'ratings as ratings_down_count' => fn($q) => $q->where('value', -1),
            ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $experiences = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('experiencies/meves', [
            'experiences' => $experiences,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
            ],
        ]);
    }

    public function edit(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $post->load(['categories:id,name', 'mainCountry:code,name']);
        $categories = Category::orderBy('name')->get(['id', 'name']);
        $countries = Country::orderBy('name')->get(['code', 'name']);

        return Inertia::render('experiencies/editar', [
            'experience' => $post,
            'categories' => $categories,
            'countries' => $countries,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $isDraft = $request->input('status') === 'draft';

        $rules = [
            'title' => $isDraft ? 'nullable|string|max:255' : 'required|string|max:255',
            'content' => $isDraft ? 'nullable|string' : 'required|string',
            'experience_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'country_code' => 'nullable|string|exists:countries,code',
            'categories' => $isDraft ? 'nullable|array' : 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'status' => 'required|in:draft,published',
        ];

        $validated = $request->validate($rules);

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $post->image));
            }
            $optimizer = new ImageOptimizer();
            $validated['image'] = '/storage/' . $optimizer->store($request->file('image'));
        } else {
            unset($validated['image']);
        }

        $validated['title'] = $validated['title'] ?? $post->title ?? '';
        $validated['content'] = $validated['content'] ?? $post->content ?? '';

        $cats = $validated['categories'] ?? [];
        unset($validated['categories']);
        $post->update($validated);
        $post->categories()->sync($cats);

        return redirect()->route('experiencies.meves')->with('success', 'Experiencia actualitzada!');
    }

    public function destroy(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        if ($post->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $post->image));
        }

        $post->delete();

        return redirect()->route('experiencies.meves')->with('success', 'Experiencia eliminada.');
    }

    public function rejectedStatus(Report $report)
    {
        $post = Post::findOrFail($report->post_id);
        $post->update(['status' => "rejected"]);

        return back();
    }

    public function acceptedStatus(Report $report)
    {
        $post = Post::findOrFail($report->post_id);
        $post->update(['status' => "published"]);

        return back();
    }
}
