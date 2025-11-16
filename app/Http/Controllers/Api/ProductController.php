<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET ALL PRODUCTS WITH VARIANTS
    public function index()
    {
        $products = Product::with(['variants', 'category'])
            ->get()
            ->map(function ($product) {
                return $this->formatProductResponse($product);
            });

        return response()->json([
            'success' => true,
            'data' => $products,
            'count' => $products->count()
        ]);
    }

    // GET PRODUCTS BY CATEGORY
    public function getByCategory($categoryName)
    {
        $category = Category::where('name', $categoryName)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found. Valid categories: helmets, jackets, pants, boots, gloves',
                'data' => []
            ], 404);
        }

        $products = Product::with(['variants', 'category'])
            ->where('category_id', $category->id)
            ->get()
            ->map(function ($product) {
                return $this->formatProductResponse($product);
            });

        return response()->json([
            'success' => true,
            'data' => $products,
            'count' => $products->count()
        ]);
    }

    // GET SINGLE PRODUCT BY ID WITH VARIANTS
    public function show($id)
    {
        $product = Product::with(['variants', 'category'])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatProductResponse($product)
        ]);
    }

    // FORMAT PRODUCT RESPONSE (Maintains similar structure to your old API)
    private function formatProductResponse($product)
{
    return [
        'id' => $product->id,
        'name' => $product->name,
        'brand' => $product->brand,
        'base_price' => (float) $product->base_price,
        'description' => $product->description,
        'category' => $product->category->name,
        'specifications' => $product->specifications,
        'variants' => $product->variants->map(function ($variant) {
            return [
                'id' => $variant->id,
                'color' => $variant->color,
                'hex_code' => $variant->hex_code, // ADD THIS LINE
                'image' => $variant->image_url,   // FIX: use image_url from database
                'price' => (float) $variant->price,
                'stock_quantity' => $variant->stock_quantity,
                'sku' => $variant->sku
            ];
        })->toArray(),
        'created_at' => $product->created_at,
        'updated_at' => $product->updated_at
    ];
}
}