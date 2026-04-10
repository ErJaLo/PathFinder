<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class ReportsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->integer('perPage', 10);
        $page = $request->integer('page', 1);
        $offset = ($page - 1) * $perPage;
        $status = (string) $request->input('status', '');
        $search = trim((string) $request->input('search', ''));

        $query = DB::table("reports")
            ->select(
                "reports.id",
                "reports.user_id",
                "reports.post_id",
                "reports.status",
                "reports.reason",
                "reports.created_at"
            )
            ->when(
                $search !== '',
                fn($q) => $q->where(function ($searchQuery) use ($search) {
                    $searchQuery->where('reports.reason', 'like', "%{$search}%");
                })
            )
            ->when(
                $status !== '',
                fn($q) => $q->where('reports.status', $status)
            );

        $reports = $query->orderBy('reports.created_at', 'desc')
            ->limit($perPage)
            ->offset($offset)
            ->get();

        return Inertia::render("admin/reports", [
            'reports' => $reports,
            'perPage' => $perPage,
            'page' => $page,
            'status' => $status,
            'search' => $search,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
