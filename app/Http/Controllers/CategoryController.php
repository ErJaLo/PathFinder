<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Validation\Rules\Date;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = DB::table("categories")
            ->leftJoin("post_category", "categories.id", "=", "post_category.category_id")
            ->selectRaw("categories.id,
             categories.name, 
             categories.description,
              categories.created_at,
               count(post_category.category_id) as experiencies_categories,
             \"end\" as status")
            ->groupBy("categories.id", "categories.name", "categories.description", "categories.created_at", "status")
            ->get();

        return Inertia::render("admin/category", compact("category"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Inertia::render("");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validat = $request->validate(["name" => "required", "descrption" => "required"]);
        $categoria = Category::create([
            "name" => $validat["name"],
            "description" => $validat["description"]
        ]);
        return Inertia::render("", compact(['msg' => 'true']));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categoria = Category::findOrFail($id);
        return Inertia::render("", compact("$categoria"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $categoria = Category::findOrFail($id);
        return Inertia::render("", compact("categoria"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validat = $request->validate(["name" => "required", "descrption" => "required"]);
        $categoria = Category::update($validat);

        return Inertia::render("", compact("categoria"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categoria = Category::findOrFail($id);
        $categoria->delete();
        return Inertia::render("");
    }
}
