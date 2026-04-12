<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class ReportsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ens desfem del selectRaw conflictiu i del groupBy innecessari.
        $reports = DB::table("reports")
            ->select(
                "id",
                "user_id",
                "post_id",
                "status",
                "reason",
                "created_at"
            )
            ->get();

        return Inertia::render("admin/reports", compact("reports"));
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
        $validated = $request->validate([
            'post_id' => ['required', 'integer', 'exists:posts,id'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $alreadyReported = Report::where('user_id', $request->user()->id)
            ->where('post_id', $validated['post_id'])
            ->exists();

        if ($alreadyReported) {
            return back()->withErrors([
                'reason' => 'Ja has reportat aquesta experiencia.',
            ]);
        }

        Report::create([
            'user_id' => $request->user()->id,
            'post_id' => $validated['post_id'],
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Report enviat correctament.');
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
