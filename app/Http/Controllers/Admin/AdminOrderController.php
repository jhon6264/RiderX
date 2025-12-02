<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class AdminOrderController extends Controller
{
    /**
     * Get all orders with filters
     */
    public function getAllOrders(Request $request)
    {
        try {
            $query = Order::with(['user', 'items.variant.product', 'payment']);
            
            // Status filter
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            // Search filter
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('id', 'LIKE', "%{$search}%")
                      ->orWhereHas('user', function($userQuery) use ($search) {
                          $userQuery->where('name', 'LIKE', "%{$search}%")
                                   ->orWhere('email', 'LIKE', "%{$search}%");
                      });
                });
            }
            
            // Date range filter
            if ($request->has('date_from') && !empty($request->date_from)) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            
            if ($request->has('date_to') && !empty($request->date_to)) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
            
            $orders = $query->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'orders' => $orders,
                'filters' => $request->all()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get orders by status
     */
    // In AdminOrderController.php - Update getOrdersByStatus method
    // In AdminOrderController.php - Update getOrdersByStatus method
public function getOrdersByStatus(Request $request)
{
    try {
        // Get the current URL path to determine the status
        $path = $request->path(); // Returns 'admin/orders/pending', 'admin/orders/to-ship', etc.
        $statusFromUrl = last(explode('/', $path));
        
        // Map URL segments to database status values
        $statusMap = [
            'pending' => 'pending',
            'to-ship' => 'to_ship',
            'shipped' => 'shipped',
            'delivered' => 'delivered',
            'cancelled' => 'cancelled'
        ];
        
        if (!array_key_exists($statusFromUrl, $statusMap)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status provided. Valid: ' . implode(', ', array_keys($statusMap))
            ], 422);
        }
        
        $dbStatus = $statusMap[$statusFromUrl];
        
        $orders = Order::with(['user', 'items.variant.product', 'payment'])
                     ->where('status', $dbStatus)
                     ->orderBy('created_at', 'desc')
                     ->get();
        
        return response()->json([
            'success' => true,
            'orders' => $orders,
            'status' => $dbStatus,
            'count' => $orders->count()
        ]);
        
    } catch (\Exception $e) {
        Log::error('Failed to fetch orders by status: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch orders: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Get single order details
     */
    public function getOrder($id)
    {
        try {
            $order = Order::with(['user', 'items.variant.product', 'payment'])
                        ->find($id);
            
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
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,to_ship,shipped,delivered,cancelled',
            'notes' => 'nullable|string'
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

            $order = Order::find($id);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $oldStatus = $order->status;
            $newStatus = $request->status;

            // Update order status
            $order->status = $newStatus;
            
            // Set timestamps based on status
            if ($newStatus === 'shipped' && !$order->shipped_at) {
                $order->shipped_at = now();
            } elseif ($newStatus === 'delivered' && !$order->delivered_at) {
                $order->delivered_at = now();
            } elseif ($newStatus === 'cancelled' && !$order->cancelled_at) {
                $order->cancelled_at = now();
                $order->cancellation_reason = $request->notes;
            }
            
            $order->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Order status updated from '{$oldStatus}' to '{$newStatus}'",
                'order' => $order->load(['user', 'items.variant.product', 'payment'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel order with reason
     */
    public function cancelOrder(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'required|string|min:10'
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

            $order = Order::find($id);
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Update order status and cancellation details
            $order->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => $request->cancellation_reason
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'order' => $order->load(['user', 'items.variant.product', 'payment'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order statistics
     */
    public function getOrderStats()
    {
        try {
            $stats = [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'to_ship_orders' => Order::where('status', 'to_ship')->count(),
                'shipped_orders' => Order::where('status', 'shipped')->count(),
                'delivered_orders' => Order::where('status', 'delivered')->count(),
                'cancelled_orders' => Order::where('status', 'cancelled')->count(),
                'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
                'today_orders' => Order::whereDate('created_at', today())->count()
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch order stats: ' . $e->getMessage()
            ], 500);
        }
    }
}