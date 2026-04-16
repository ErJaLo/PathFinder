<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

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

        $query = DB::table('users')
            ->selectRaw("
                users.id,
                users.name,
                users.surname,
                users.email,
                users.role,
                users.created_at,
                COUNT(posts.user_id) as posts,
                CASE
                    WHEN users.active = 1 THEN 'active'
                    WHEN users.active = 0 THEN 'inactive'
                END as status
            ")
            ->leftJoin('posts', 'posts.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name', 'users.surname', 'users.email', 'users.role', 'users.active', 'users.created_at')
            ->when(
                $search !== '',
                fn($q) =>
                $q->where(function ($searchQuery) use ($search) {
                    $searchQuery->where('users.name', 'like', "%{$search}%")
                        ->orWhere('users.email', 'like', "%{$search}%");
                })
            )
            ->when(
                in_array($status, ['active', 'inactive'], true),
                fn($q) =>
                $q->where('users.active', $status === 'active' ? 1 : 0)
            );

        $total = DB::query()->fromSub(clone $query, 'filtered_users')->count();
        $users = $query->limit($perPage)->offset($offset)->get();


        return Inertia::render('admin/users', [
            'users' => $users,
            'total' => $total,
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
        return redirect()->route('admin.users.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            ...($this->profileRules()),
            'password' => $this->passwordRules(),
            'role' => ['required', 'in:user,admin'],
        ]);

        User::create($validated);

        return redirect()->route('admin.users.index')->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Toggle the active status over the user
     */
    public function toggleActive(User $user)
    {
        // echo "test";
        // exit;
        $user->update([
            'active' => !$user->active
        ]);

        return redirect()->back();
    }
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return redirect()->route('admin.users.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return redirect()->route('admin.users.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            ...($this->profileRules($user->id)),
            'role' => ['required', 'in:user,admin'],
        ]);

        // Si se proporciona contraseña, añadirla a la validación
        if ($request->filled('password')) {
            $passwordValidated = $request->validate([
                'password' => $this->passwordRules(),
            ]);
            $validated = array_merge($validated, $passwordValidated);
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'Usuario actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
