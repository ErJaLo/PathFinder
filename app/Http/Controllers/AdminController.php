<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $rangeDays = $this->resolveRangeDays($request);

        $end = Carbon::now()->endOfDay();
        $start = $end->copy()->subDays($rangeDays - 1)->startOfDay();

        return Inertia::render('admin/index', [
            'range' => $rangeDays,
            'ranges' => [1, 3, 7, 30],
            'metrics' => [
                'postsByCategory' => $this->postsByCategory($start, $end),
                'postsByCountry' => $this->postsByCountry($start, $end),
                'reportedAbuseTimeline' => $this->timelineByDay('reports', $start, $end),
                'registeredUsersTimeline' => $this->timelineByDay('users', $start, $end),
            ],
        ]);
    }

    private function resolveRangeDays(Request $request): int
    {
        $allowed = [1, 3, 7, 30];
        $range = (int) $request->integer('range', 7);

        return in_array($range, $allowed, true) ? $range : 7;
    }

    private function postsByCategory(Carbon $start, Carbon $end)
    {
        return DB::table('post_category as pc')
            ->join('posts as p', 'p.id', '=', 'pc.post_id')
            ->join('categories as c', 'c.id', '=', 'pc.category_id')
            ->whereBetween('p.created_at', [$start, $end])
            ->select('c.name', DB::raw('COUNT(*) as value'))
            ->groupBy('c.id', 'c.name')
            ->orderByDesc('value')
            ->limit(8)
            ->get()
            ->map(fn($row) => [
                'name' => $row->name,
                'value' => (int) $row->value,
            ])
            ->values();
    }

    private function postsByCountry(Carbon $start, Carbon $end)
    {
        return DB::table('posts as p')
            ->join('countries as c', 'c.code', '=', 'p.country_code')
            ->whereNotNull('p.country_code')
            ->whereBetween('p.created_at', [$start, $end])
            ->select('c.name', DB::raw('COUNT(*) as value'))
            ->groupBy('c.code', 'c.name')
            ->orderByDesc('value')
            ->limit(8)
            ->get()
            ->map(fn($row) => [
                'name' => $row->name,
                'value' => (int) $row->value,
            ])
            ->values();
    }

    private function timelineByDay(string $table, Carbon $start, Carbon $end)
    {
        $raw = DB::table($table)
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DATE(created_at) as day, COUNT(*) as value')
            ->groupBy('day')
            ->pluck('value', 'day');

        $days = $start->diffInDays($end) + 1;

        $data = collect();
        for ($offset = 0; $offset < $days; $offset++) {
            $day = $start->copy()->addDays($offset);

            $data->push([
                'label' => $day->format('d/m'),
                'value' => (int) ($raw[$day->toDateString()] ?? 0),
            ]);
        }

        return $data;
    }
}
