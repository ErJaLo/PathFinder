<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminStatsController extends Controller
{
    /**
     * Retorna les dades estadístiques agrupades i les envia a qui les demani.
     */
    public function summaryStats(Request $request)
    {
        // 1. Obtenim la informació dels models / taules tal com farien els seus respectius controladors
        $totalCategories = DB::table('categories')->count();
        $totalUsuaris = DB::table('users')->count();
        $totalExperiencies = DB::table('posts')->count();
        $totalReports = DB::table('reports')->count();

        // 2. Determinem la pàgina que està fent la petició parcial (Inertia Partial Reloads)
        $component = $request->header('X-Inertia-Partial-Component', 'admin/index');

        // 3. Tornem el render per a la vista amb les dades unificades
        return Inertia::render($component, [
            'totalCategories' => $totalCategories,
            'totalUsuaris' => $totalUsuaris,
            'totalExperiencies' => $totalExperiencies,
            'totalReports' => $totalReports,
        ]);
    }
}
