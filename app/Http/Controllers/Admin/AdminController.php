<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Get comprehensive dashboard data for charts and stats
     */
    public function dashboard(Request $request)
    {
        try {
            $period = $request->get('period', 'week'); // week, month, year
            
            // 1. Basic Stats
            $stats = [
                'total_orders' => Order::count(),
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'total_products' => Product::count(),
                'revenue' => (float) Order::where('status', '!=', 'cancelled')->sum('total_amount'),
                'new_customers' => User::whereDate('created_at', '>=', now()->subDays(30))->count(),
                'returning_customers' => Order::where('created_at', '>=', now()->subDays(30))
                    ->distinct('user_id')
                    ->count('user_id'),
                'low_stock_items' => ProductVariant::where('stock_quantity', '<', 10)->count(),
                'today_orders' => Order::whereDate('created_at', today())->count(),
                'today_revenue' => (float) Order::whereDate('created_at', today())
                                    ->where('status', '!=', 'cancelled')
                                    ->sum('total_amount'),
                'average_order_value' => (float) Order::where('status', '!=', 'cancelled')
                                            ->avg('total_amount')
            ];

            // 2. Sales Data for selected period
            $salesData = $this->getSalesData($period);
            
            // 3. Top 5 Products by Sales
            $topProducts = $this->getTopProducts(5);
            
            // 4. Recent 5 Orders
            $recentOrders = $this->getRecentOrders(5);
            
            // 5. Low Stock Alerts
            $lowStockAlerts = $this->getLowStockAlerts(5);
            
            // 6. Payment Status Summary
            $paymentSummary = $this->getPaymentSummary();
            
            // 7. Order Status Distribution
            $orderStatusDistribution = $this->getOrderStatusDistribution();

            return response()->json([
                'success' => true,
                'period' => $period,
                'stats' => $stats,
                'sales_data' => $salesData,
                'top_products' => $topProducts,
                'recent_orders' => $recentOrders,
                'low_stock_alerts' => $lowStockAlerts,
                'payment_summary' => $paymentSummary,
                'order_status_distribution' => $orderStatusDistribution,
                'last_updated' => now()->toDateTimeString()
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard API Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get paginated users for admin management (20 per page)
     */
    public function getUsers(Request $request)
    {
        try {
            $perPage = 20;
            $page = $request->get('page', 1);
            $search = $request->get('search', '');
            $filter = $request->get('filter', 'all');
            
            $query = User::query();
            
            // Apply search
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            // Apply filter
            if ($filter === 'admin') {
                $query->where('is_admin', true);
            } elseif ($filter === 'user') {
                $query->where('is_admin', false);
            }
            
            // Get paginated results
            $users = $query->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);
            
            // Format response
            $formattedUsers = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'is_admin' => $user->is_admin,
                    'last_login_at' => $user->last_login_at,
                    'last_logout_at' => $user->last_logout_at,
                    'last_activity_at' => $user->last_activity_at,
                    'login_count' => $user->login_count,
                    'created_at' => $user->created_at,
                    'status' => $this->getUserStatus($user)
                ];
            });
            
            // Get stats
            $totalUsers = User::count();
            $totalAdmins = User::where('is_admin', true)->count();
            $onlineNow = User::where('last_activity_at', '>', now()->subMinutes(5))->count();
            
            return response()->json([
                'success' => true,
                'users' => $formattedUsers,
                'pagination' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem()
                ],
                'stats' => [
                    'total_users' => $totalUsers,
                    'total_admins' => $totalAdmins,
                    'online_now' => $onlineNow
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users'
            ], 500);
        }
    }
    
    /**
     * Toggle admin status for a user
     */
    public function toggleAdminStatus($id, Request $request)
    {
        try {
            $user = User::findOrFail($id);
            $currentUser = $request->user();
            
            // Prevent self-demotion
            if ($user->id === $currentUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot change your own admin status'
                ], 400);
            }
            
            // Toggle admin status
            $user->is_admin = !$user->is_admin;
            $user->save();
            
            // Log the action
            Log::info("Admin status changed", [
                'changed_by' => $currentUser->id,
                'changed_user' => $user->id,
                'new_status' => $user->is_admin ? 'admin' : 'user'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => $user->is_admin 
                    ? 'User promoted to admin successfully'
                    : 'Admin access removed successfully',
                'user' => [
                    'id' => $user->id,
                    'is_admin' => $user->is_admin
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to toggle admin status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update admin status'
            ], 500);
        }
    }
    
    /**
     * Get user status for real-time updates
     */
    private function getUserStatus($user)
{
    if (!$user->last_activity_at) {
        return ['status' => 'never', 'color' => 'gray', 'text' => 'Never Active'];
    }
    
    // FIX: Use (int) to get integer minutes
    $minutesAgo = (int) $user->last_activity_at->diffInMinutes(now());
    
    if ($minutesAgo < 5) {
        return [
            'status' => 'active',
            'color' => 'green',
            'text' => $minutesAgo < 1 ? 'Just now' : "Active {$minutesAgo}m ago" // This could show decimals!
        ];
    } elseif ($minutesAgo < 30) {
        return [
            'status' => 'away',
            'color' => 'yellow',
            'text' => "Away {$minutesAgo}m ago"
        ];
    } else {
        return [
            'status' => 'offline',
            'color' => 'gray',
            'text' => "Offline {$minutesAgo}m ago"
        ];
    }
}

    // ... KEEP ALL YOUR EXISTING DASHBOARD METHODS BELOW ...
    // (getSalesData, getWeeklySalesData, getMonthlySalesData, getYearlySalesData,
    // getTopProducts, getRecentOrders, getLowStockAlerts, getPaymentSummary, 
    // getOrderStatusDistribution methods remain exactly the same)
    
    /**
     * Get sales data for specified period
     */
    private function getSalesData($period = 'week')
    {
        switch ($period) {
            case 'month':
                return $this->getMonthlySalesData();
            case 'year':
                return $this->getYearlySalesData();
            case 'week':
            default:
                return $this->getWeeklySalesData();
        }
    }

    /**
     * Get weekly sales data (last 7 days)
     */
    private function getWeeklySalesData()
    {
        $salesData = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayName = $date->format('D');
            $dateString = $date->format('Y-m-d');
            
            $dayOrders = Order::whereDate('created_at', $dateString)->get();
            $daySales = $dayOrders->where('status', '!=', 'cancelled')->sum('total_amount');
            $dayOrderCount = $dayOrders->count();
            
            $salesData[] = [
                'day' => $dayName,
                'full_date' => $dateString,
                'sales' => (float) $daySales,
                'orders' => $dayOrderCount
            ];
        }
        
        return $salesData;
    }

    /**
     * Get monthly sales data (last 30 days grouped by week)
     */
   private function getMonthlySalesData()
{
    $salesData = [];
    
    // Generate 4 weeks of data (last 30 days)
    for ($week = 4; $week >= 1; $week--) {
        $daysAgoStart = ($week * 7) - 1; // Start of week (e.g., 27 days ago for week 4)
        $daysAgoEnd = ($week - 1) * 7;   // End of week (e.g., 21 days ago for week 4)
        
        // For current week (week 1), end is today
        if ($week === 1) {
            $daysAgoEnd = 0;
        }
        
        $startDate = now()->subDays($daysAgoStart);
        $endDate = now()->subDays($daysAgoEnd);
        
        // Adjust for current week to not exceed today
        if ($endDate->greaterThan(now())) {
            $endDate = now();
        }
        
        // Get sales for this week
        $weekOrders = Order::whereBetween('created_at', [$startDate, $endDate])->get();
        
        $weekSales = $weekOrders->where('status', '!=', 'cancelled')->sum('total_amount');
        $weekOrderCount = $weekOrders->count();
        
        // Create readable date range label
        $monthStart = $startDate->format('M');
        $monthEnd = $endDate->format('M');
        
        // If same month, show "Nov 1-7", if different show "Nov 30 - Dec 6"
        if ($monthStart === $monthEnd) {
            $weekLabel = $monthStart . ' ' . $startDate->format('j') . '-' . $endDate->format('j');
        } else {
            $weekLabel = $startDate->format('M j') . ' - ' . $endDate->format('M j');
        }
        
        $salesData[] = [
            'day' => $weekLabel,
            'full_date' => $startDate->format('Y-m-d') . ' to ' . $endDate->format('Y-m-d'),
            'sales' => (float) $weekSales,
            'orders' => $weekOrderCount
        ];
    }
    
    return $salesData;
}

    /**
     * Get yearly sales data (last 12 months)
     */
    private function getYearlySalesData()
    {
        $salesData = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $startDate = now()->subMonths($i)->startOfMonth();
            $endDate = now()->subMonths($i)->endOfMonth();
            $monthName = $startDate->format('M');
            
            $monthOrders = Order::whereBetween('created_at', [$startDate, $endDate])->get();
            $monthSales = $monthOrders->where('status', '!=', 'cancelled')->sum('total_amount');
            $monthOrderCount = $monthOrders->count();
            
            $salesData[] = [
                'day' => $monthName,
                'full_date' => $startDate->format('Y-m'),
                'sales' => (float) $monthSales,
                'orders' => $monthOrderCount
            ];
        }
        
        return $salesData;
    }

    /**
     * Get top products by sales quantity
     */
    private function getTopProducts($limit = 5)
    {
        $results = OrderItem::select([
                'product_variants.product_id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sales'),
                DB::raw('SUM(order_items.total) as total_revenue')
            ])
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->groupBy('product_variants.product_id', 'products.name')
            ->orderBy('total_sales', 'desc')
            ->limit($limit)
            ->get();

        return $results->map(function ($item) {
            $revenue = (float) $item->total_revenue;
            return [
                'id' => $item->product_id,
                'name' => $item->name,
                'sales' => (int) $item->total_sales,
                'revenue' => $revenue,
                'formatted_revenue' => '₱' . number_format($revenue, 0)
            ];
        })->toArray();
    }

    /**
     * Get recent orders
     */
    private function getRecentOrders($limit = 5)
    {
        $orders = Order::with(['user', 'items.variant.product'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return $orders->map(function ($order) {
            $amount = (float) $order->total_amount;
            return [
                'id' => 'RX-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                'order_id' => $order->id,
                'customer' => $order->user ? $order->user->name : 'Unknown Customer',
                'customer_email' => $order->user ? $order->user->email : 'N/A',
                'amount' => $amount,
                'status' => $order->status,
                'formatted_amount' => '₱' . number_format($amount, 0),
                'date' => $order->created_at->format('Y-m-d'),
                'time' => $order->created_at->format('H:i'),
                'item_count' => $order->items->count()
            ];
        })->toArray();
    }

    /**
     * Get low stock alerts
     */
    private function getLowStockAlerts($limit = 5)
    {
        $variants = ProductVariant::with(['product', 'product.category'])
            ->where('stock_quantity', '<', 10)
            ->orderBy('stock_quantity', 'asc')
            ->limit($limit)
            ->get();

        return $variants->map(function ($variant) {
            return [
                'id' => $variant->id,
                'product' => $variant->product->name,
                'product_id' => $variant->product_id,
                'color' => $variant->color,
                'sku' => $variant->sku,
                'stock' => $variant->stock_quantity,
                'min_stock' => 10,
                'category' => $variant->product->category->name ?? 'Uncategorized',
                'is_critical' => $variant->stock_quantity < 3
            ];
        })->toArray();
    }

    /**
     * Get payment status summary
     */
    private function getPaymentSummary()
    {
        $summary = Payment::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = "verified" THEN 1 ELSE 0 END) as verified,
                SUM(CASE WHEN status = "failed" THEN 1 ELSE 0 END) as failed,
                SUM(CASE WHEN status = "rejected" THEN 1 ELSE 0 END) as rejected
            ')
            ->first();

        if (!$summary) {
            return [
                'total' => 0,
                'pending' => 0,
                'verified' => 0,
                'failed' => 0,
                'rejected' => 0,
                'verification_rate' => 0
            ];
        }

        $total = (int) $summary->total;
        $verified = (int) $summary->verified;

        return [
            'total' => $total,
            'pending' => (int) $summary->pending,
            'verified' => $verified,
            'failed' => (int) $summary->failed,
            'rejected' => (int) $summary->rejected,
            'verification_rate' => $total > 0 
                ? round(($verified / $total) * 100, 2) 
                : 0
        ];
    }

    /**
     * Get order status distribution
     */
    private function getOrderStatusDistribution()
    {
        $distribution = Order::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = "to_ship" THEN 1 ELSE 0 END) as to_ship,
                SUM(CASE WHEN status = "shipped" THEN 1 ELSE 0 END) as shipped,
                SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as delivered,
                SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as cancelled
            ')
            ->first();

        if (!$distribution) {
            return [
                'total' => 0,
                'pending' => 0,
                'to_ship' => 0,
                'shipped' => 0,
                'delivered' => 0,
                'cancelled' => 0,
                'completion_rate' => 0
            ];
        }

        $total = (int) $distribution->total;
        $delivered = (int) $distribution->delivered;

        return [
            'total' => $total,
            'pending' => (int) $distribution->pending,
            'to_ship' => (int) $distribution->to_ship,
            'shipped' => (int) $distribution->shipped,
            'delivered' => $delivered,
            'cancelled' => (int) $distribution->cancelled,
            'completion_rate' => $total > 0 
                ? round(($delivered / $total) * 100, 2) 
                : 0
        ];
    }

    public function getUserStatusUpdates(Request $request)
{
    try {
        $userIds = $request->get('user_ids', []);
        
        if (empty($userIds)) {
            return response()->json([
                'success' => true,
                'statuses' => []
            ]);
        }
        
        $users = User::whereIn('id', $userIds)->get();
        $statuses = [];
        
        foreach ($users as $user) {
            $statuses[$user->id] = $this->getUserStatus($user);
        }
        
        return response()->json([
            'success' => true,
            'statuses' => $statuses
        ]);
        
    } catch (\Exception $e) {
        Log::error('Failed to get user status updates: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to get status updates'
        ], 500);
    }
}
}