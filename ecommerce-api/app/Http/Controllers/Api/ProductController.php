<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::when($request->category_id, function ($query) use ($request) {
            return $query->where('category_id', $request->category_id);
        })
            ->with('category')
            ->latest()
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable',
        ]);

        $validated['slug'] = Str::slug($validated['name']).'-'.strtolower(Str::random(6));
        $validated['image'] = $this->resolveImagePath($request, null);

        if ($validated['image'] === null) {
            unset($validated['image']);
        }

        $product = Product::create($validated);

        return response()->json(new ProductResource($product->load('category')), 201);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return new ProductResource($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable',
        ]);

        $validated['slug'] = Str::slug($validated['name']).'-'.$product->id;

        $imagePath = $this->resolveImagePath($request, $product->image);

        if ($imagePath !== null) {
            $validated['image'] = $imagePath;
        } else {
            unset($validated['image']);
        }

        $product->update($validated);

        return response()->json(new ProductResource($product->fresh('category')));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    private function resolveImagePath(Request $request, ?string $currentImage): ?string
    {
        if ($request->hasFile('image')) {
            if ($currentImage) {
                Storage::disk('public')->delete($currentImage);
            }

            return $request->file('image')->store('products', 'public');
        }

        if (is_string($request->image) && trim($request->image) !== '') {
            return $request->image;
        }

        return null;
    }
}
