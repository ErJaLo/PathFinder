<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = DB::table('users')
        ->selectRaw("
            users.id,
            users.name,
            users.email,
            users.created_at,
            COUNT(posts.user_id) as total_posts,
            CASE
                WHEN users.active = 1 THEN 'active'
                WHEN users.active = 0 THEN 'inactive'
            END as status
        ")
        ->leftJoin('posts', 'posts.user_id', '=', 'users.id')
        ->groupBy('users.id', 'users.name', 'users.email', 'users.active')
        ->get();
        return Inertia::render('admin/users', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

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
