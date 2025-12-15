<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * INDEX (Public + Dashboard)
     */
    public function index()
    {
        // Jika akses dashboard
        if (request()->is('dashboard/*')) {
            return Inertia::render('dashboard/categories/Index', [
                'categories' => Category::latest()->get()
            ]);
        }

        // Halaman public
        return Inertia::render('categories/Index', [
            'categories' => Category::all()
        ]);
    }


    /**
     * CREATE (Dashboard)
     */
    public function create()
    {
        return Inertia::render('dashboard/categories/Create');
    }

    /**
     * STORE
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|max:100'
        ]);

        Category::create([
            'name' => $request->name
        ]);

        return redirect()->route('categories.index');
    }

    /**
     * EDIT
     */
    public function edit(Category $category)
    {
        return Inertia::render('dashboard/categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * UPDATE
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|min:3|max:100'
        ]);

        $category->update([
            'name' => $request->name
        ]);

        return redirect()->route('categories.index');
    }

    /**
     * DELETE
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index');
    }
}
