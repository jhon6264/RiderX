<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Create a new order
     */
    public function create(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'contact_number' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Calculate total amount and validate stock
            $totalAmount = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $variant = ProductVariant::with('product')->find($item['product_variant_id']); 
                
                if (!$variant) {
                    throw new \Exception("Product variant not found");
                }

                // Check stock
                if ($variant->stock_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$variant->product->name} - {$variant->color}");
                }

                $itemTotal = $variant->price * $item['quantity'];
                $totalAmount += $itemTotal;

                $orderItems[] = [
                    'variant' => $variant,
                    'quantity' => $item['quantity'],
                    'price' => $variant->price,
                    'total' => $itemTotal
                ];
            }

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(), // FIXED: Use Auth::id instead of auth()->id()
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'contact_number' => $request->contact_number,
            ]);

            // Create order items and update stock
            foreach ($orderItems as $orderItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $orderItem['variant']->id,
                    'quantity' => $orderItem['quantity'],
                    'price' => $orderItem['price'],
                    'total' => $orderItem['total']
                ]);

                // Update stock
                $orderItem['variant']->decrement('stock_quantity', $orderItem['quantity']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order_id' => $order->id,
                'total_amount' => $totalAmount,
                'status' => 'pending'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's order history
     */
    public function index()
    {
        try {
            $orders = Order::with(['items.variant.product'])
                        ->where('user_id', Auth::id()) // FIXED: Use Auth::id instead of auth()->id()
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'orders' => $orders
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single order details
     */
    public function show($id)
    {
        try {
            $order = Order::with(['items.variant.product'])
                        ->where('user_id', Auth::id()) // FIXED: Use Auth::id instead of auth()->id()
                        ->where('id', $id)
                        ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'order' => $order
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'status' => 'required|in:pending,to_ship,shipped,delivered,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $order = Order::where('id', $request->order_id)
                         ->where('user_id', Auth::id()) // FIXED: Use Auth::id instead of auth()->id()
                         ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $order->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => "Order status updated to '{$request->status}'",
                'order_id' => $order->id,
                'new_status' => $request->status
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }
}