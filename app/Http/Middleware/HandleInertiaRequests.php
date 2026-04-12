<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $globalData = [
            'totalReports' => 0
        ];

        // Si l'usuari és administrador o moderador, calculem el total de reports
        if ($user && in_array($user->role, ['admin', 'moderator'])) {
            $globalData['totalReports'] = \Illuminate\Support\Facades\DB::table('reports')->where('status', 'pending')->count();
            $globalData["totalReportsResols"] =  \Illuminate\Support\Facades\DB::table('reports')->where('status', 'reviewed')->count();
            $globalData["totalReportsDescartats"] =  \Illuminate\Support\Facades\DB::table('reports')->where('status', 'dismissed')->count();
            $globalData["totalCategories"] = \Illuminate\Support\Facades\DB::table('categories')->count();
            $globalData["totalUsuaris"]  = \Illuminate\Support\Facades\DB::table('users')->count();
            $globalData["totalExperiencies"]  = \Illuminate\Support\Facades\DB::table('posts')->count();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'globalData' => $globalData,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
        ];
    }
}
