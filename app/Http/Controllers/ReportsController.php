<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PHPUnit\Logging\OpenTestReporting\Status;

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
            ->when($status !== '', function ($q) use ($status) {
                // Si la variable the status que arriba és 'reviewed', mostrarà tot menos els pendents
                if ($status === 'reviewed') {
                    return $q->where('reports.status', '!=', 'pending');
                }

                // En els altres casos es filtrarà normalment
                return $q->where('reports.status', $status);
            });

        // Obtenim el total de registres abans del limit/offset
        $total = $query->count();

        $reports = $query->orderBy('reports.created_at', 'desc')
            ->limit($perPage)
            ->offset($offset)
            ->get();

        return Inertia::render("admin/reports", [
            'reports' => $reports,
            'perPage' => $perPage,
            'page' => $page,
            'total' => $total,
            'status' => $status,
            'search' => $search,
        ]);
    }

    public function acceptStatus(Report $report)
    {
        $report->update(['status' => "accepted"]);
        return back();
    }

    public function rejectedStatus(Report $report)
    {
        $report->update(['status' => "dismissed"]);
        return back();
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
        $report = Report::findOrFail($id);

        $report->load([
            'user:id,name,email',
            'post' => function ($query) {
                $query->with(['user' => function ($userQuery) {
                    $userQuery->withCount(['posts', 'reportsReceived']);
                }, 'mainCountry']);
            }
        ]);

        return Inertia::render("admin/report-detail", compact("report"));
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
        $report = Report::findOrFail($id);
        $report->delete();

        return Inertia::render("admin/reports");
    }
}
