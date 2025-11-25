<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_orders' => Order::count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'total_products' => Product::count(),
            'revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount')
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }
}