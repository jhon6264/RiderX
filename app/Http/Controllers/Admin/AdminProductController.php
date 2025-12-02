<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminProductController extends Controller
{
    // GET ALL PRODUCTS (active only by default)
    public function index(Request $request)
    {
        try {
            $query = Product::with(['variants', 'category']);
            
            // Include trashed products if requested
            if ($request->has('with_trashed') && $request->with_trashed) {
                $query->withTrashed();
            }
            
            // Show only trashed products if requested
            if ($request->has('only_trashed') && $request->only_trashed) {
                $query->onlyTrashed();
            }
            
            // Search filter
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('brand', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }
            
            // Category filter
            if ($request->has('category') && $request->category) {
                $query->whereHas('category', function($q) use ($request) {
                    $q->where('name', $request->category);
                });
            }
            
            $products = $query->orderBy('created_at', 'desc')
                            ->paginate($request->get('per_page', 15));
            
            return response()->json([
                'success' => true,
                'data' => $products,
                'total' => $products->total()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Admin Product Index Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products'
            ], 500);
        }
    }
    
    // GET SINGLE PRODUCT (including trashed)
    public function show($id)
    {
        try {
            $product = Product::with(['variants', 'category'])
                            ->withTrashed()
                            ->find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
            
        } catch (\Exception $e) {
            Log::error('Admin Product Show Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product'
            ], 500);
        }
    }
    
    // CREATE NEW PRODUCT (unchanged)
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'brand' => 'required|string|max:255',
                'base_price' => 'required|numeric|min:0',
                'description' => 'required|string',
                'category_id' => 'required|exists:categories,id',
                'specifications' => 'sometimes|array',
                'variants' => 'sometimes|array',
                'variants.*.color' => 'required|string',
                'variants.*.hex_code' => 'required|string',
                'variants.*.price' => 'required|numeric|min:0',
                'variants.*.stock_quantity' => 'required|integer|min:0',
                'variants.*.sku' => 'required|string|unique:product_variants,sku'
            ]);
            
            $product = Product::create([
                'name' => $validated['name'],
                'brand' => $validated['brand'],
                'base_price' => $validated['base_price'],
                'description' => $validated['description'],
                'category_id' => $validated['category_id'],
                'specifications' => $validated['specifications'] ?? ['type' => 'standard'],
            ]);
            
            if (isset($validated['variants'])) {
                foreach ($validated['variants'] as $variantData) {
                    $product->variants()->create($variantData);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product->load(['variants', 'category'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Admin Product Store Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // UPDATE PRODUCT (including trashed)
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $product = Product::withTrashed()->find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }
            
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'brand' => 'sometimes|required|string|max:255',
                'base_price' => 'sometimes|required|numeric|min:0',
                'description' => 'sometimes|required|string',
                'category_id' => 'sometimes|required|exists:categories,id',
                'specifications' => 'sometimes|array',
                'variants' => 'sometimes|array',
                'variants.*.id' => 'sometimes|exists:product_variants,id',
                'variants.*.color' => 'required_with:variants|string',
                'variants.*.hex_code' => 'required_with:variants|string',
                'variants.*.price' => 'required_with:variants|numeric|min:0',
                'variants.*.stock_quantity' => 'required_with:variants|integer|min:0',
                'variants.*.sku' => 'required_with:variants|string'
            ]);
            
            // Update product
            $product->update($validated);
            
            // Handle variants update
            if (isset($validated['variants'])) {
                $existingVariantIds = [];
                
                foreach ($validated['variants'] as $variantData) {
                    if (isset($variantData['id'])) {
                        // Update existing variant
                        $variant = ProductVariant::withTrashed()
                                               ->where('id', $variantData['id'])
                                               ->where('product_id', $product->id)
                                               ->first();
                        if ($variant) {
                            $variant->update($variantData);
                            $existingVariantIds[] = $variantData['id'];
                        }
                    } else {
                        // Create new variant
                        $newVariant = $product->variants()->create($variantData);
                        $existingVariantIds[] = $newVariant->id;
                    }
                }
                
                // Soft delete variants not in the request
                $product->variants()
                       ->whereNotIn('id', $existingVariantIds)
                       ->delete();
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product->load(['variants', 'category'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Admin Product Update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // SOFT DELETE PRODUCT
    public function destroy($id)
    {
        DB::beginTransaction();
        
        try {
            $product = Product::find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }
            
            // Soft delete variants first
            $product->variants()->delete();
            
            // Soft delete product
            $product->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Product moved to trash successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Admin Product Delete Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product'
            ], 500);
        }
    }
    
    // RESTORE SOFT DELETED PRODUCT
    public function restore($id)
    {
        DB::beginTransaction();
        
        try {
            $product = Product::onlyTrashed()->find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Trashed product not found'
                ], 404);
            }
            
            // Restore product
            $product->restore();
            
            // Restore variants
            ProductVariant::onlyTrashed()
                         ->where('product_id', $id)
                         ->restore();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Product restored successfully',
                'data' => $product->load(['variants', 'category'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Admin Product Restore Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore product'
            ], 500);
        }
    }
    
    // PERMANENTLY DELETE PRODUCT
    public function forceDestroy($id)
    {
        DB::beginTransaction();
        
        try {
            $product = Product::onlyTrashed()->find($id);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Trashed product not found'
                ], 404);
            }
            
            // Permanently delete variants first
            $product->variants()->withTrashed()->forceDelete();
            
            // Permanently delete product
            $product->forceDelete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Product permanently deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Admin Product Force Delete Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to permanently delete product'
            ], 500);
        }
    }
    
    // GET CATEGORIES FOR DROPDOWN
    public function getCategories()
    {
        try {
            $categories = Category::all();
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
            
        } catch (\Exception $e) {
            Log::error('Admin Categories Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories'
            ], 500);
        }
    }
}

