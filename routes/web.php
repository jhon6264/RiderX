<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Http\Controllers\Auth\ResetPasswordController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminProductController;

// ========================
// CUSTOMER ROUTES
// ========================

// Home route
Route::get('/', function () {
    return view('home');
});

// Login redirect (Fortify needs this)
Route::get('/login', function () {
    return redirect('/')->with('showAuthModal', true);
})->name('login');

// Load Fortify routes (THIS IS CRITICAL)
Route::group([], base_path('vendor/laravel/fortify/routes/routes.php'));

// Fixed Password Reset Route - Use the new controller
Route::get('/reset-password/{token}', function (Request $request, $token) {
    // Include both token and email in the redirect
    $email = $request->email ? urlencode($request->email) : '';
    
    return redirect('/?token=' . $token . '&email=' . $email);
})->name('password.reset');

// API route for resetting password
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])
    ->name('password.update');

// Fixed Email Verification Route
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    Log::info("Email verification for user {$id} with hash {$hash}");
    
    $user = User::find($id);
    
    if (!$user) {
        Log::error("User {$id} not found for email verification");
        abort(404);
    }
    
    if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
        Log::error("Invalid hash for user {$id}");
        abort(403);
    }
    
    $wasVerified = $user->hasVerifiedEmail();
    
    if (!$wasVerified) {
        $user->markEmailAsVerified();
        Log::info("User {$id} email verified successfully");
    }
    
    // Redirect to home with verification success parameters
    return redirect('/?verified=true&email=' . urlencode($user->email));
})->middleware(['signed'])->name('verification.verify');

// Success page after verification
Route::get('/email/verified', function () {
    return view('home')->with('message', 'Email verified successfully!');
})->name('verification.notice');

// ========================
// CUSTOMER API ROUTES
// ========================
Route::prefix('api')->group(function () {
    // Auth status check
    Route::get('/user', function (Request $request) {
        if ($request->user()) {
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'email_verified' => !is_null($request->user()->email_verified_at),
                    'is_admin' => $request->user()->is_admin ?? false
                ]
            ]);
        }
        
        return response()->json([
            'authenticated' => false
        ]);
    });

    // Test route
    Route::get('/test', function () {
        return response()->json(['message' => 'API is working!', 'status' => 'success']);
    });
    
    // Auth routes with RATE LIMITING
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware('throttle:3,1'); // 3 registration attempts per minute
    
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1'); // 5 login attempts per minute
    
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Product API routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{category}', [ProductController::class, 'getByCategory']);
    Route::get('/products/item/{id}', [ProductController::class, 'show']); 
});

// Rate limiting for Fortify routes (additional protection)
Route::middleware('throttle:5,1')->group(function () {
    // Fortify's built-in routes are already loaded above
});

// ========================
// CUSTOMER ORDER ROUTES
// ========================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/orders/create', [OrderController::class, 'create']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/update-status', [OrderController::class, 'updateStatus']);
});

// ========================
// CUSTOMER PAYMENT ROUTES
// ========================
Route::post('/payments/generate-qr', [PaymentController::class, 'generateQR']);
Route::post('/payments/another-qr', [PaymentController::class, 'getAnotherQR']);
Route::post('/payments/upload-screenshot', [PaymentController::class, 'uploadScreenshot']);
Route::get('/payments/status/{order_id}', [PaymentController::class, 'getPaymentStatus']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
    Route::get('/payments/pending', [PaymentController::class, 'getPendingVerifications']);
});

// ========================
// ADMIN ROUTES
// ========================
Route::prefix('admin')->group(function () {
    // Auth routes (public)
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

    // Protected admin routes - BOTH PAGES AND APIS
    Route::middleware(['auth', 'admin'])->group(function () {
        // ========== REACT PAGE ROUTES ==========
        // These return the React admin app view for SPA routing
        Route::get('/', function () {
            return view('admin.app'); // Main admin dashboard
        });
        
        Route::get('/orders', function () {
            return view('admin.app'); // Orders page
        });
        
        Route::get('/payments', function () {
            return view('admin.app'); // Payments page
        });
        
        Route::get('/products', function () {
            return view('admin.app'); // Products page
        });
        
        // NEW: Add Admin Management page route
        Route::get('/admins', function () {
            return view('admin.app'); // Admin Management page
        });
        
        // ========== ADMIN API ROUTES ==========
        
        // Dashboard API
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Orders API
        Route::prefix('orders')->group(function () {
            Route::get('/all', [AdminOrderController::class, 'getAllOrders']);
            Route::get('/pending', [AdminOrderController::class, 'getOrdersByStatus']);
            Route::get('/to-ship', [AdminOrderController::class, 'getOrdersByStatus']);
            Route::get('/shipped', [AdminOrderController::class, 'getOrdersByStatus']);
            Route::get('/delivered', [AdminOrderController::class, 'getOrdersByStatus']);
            Route::get('/cancelled', [AdminOrderController::class, 'getOrdersByStatus']);
            Route::get('/{id}', [AdminOrderController::class, 'getOrder']);
            Route::put('/{id}/status', [AdminOrderController::class, 'updateStatus']);
            Route::post('/{id}/cancel', [AdminOrderController::class, 'cancelOrder']);
            Route::get('/stats/overview', [AdminOrderController::class, 'getOrderStats']);
        });
        
        // Payments API
        Route::prefix('payments')->group(function () {
            Route::get('/all', [AdminPaymentController::class, 'getAllPayments']);
            Route::get('/pending', [AdminPaymentController::class, 'getPendingPayments']);
            Route::get('/approved', [AdminPaymentController::class, 'getApprovedPayments']);
            Route::post('/verify', [AdminPaymentController::class, 'verifyPayment']);
            Route::post('/reject', [AdminPaymentController::class, 'rejectPayment']);
            Route::get('/stats', [AdminPaymentController::class, 'getPaymentStats']);
        });
        
        // Products API
        Route::prefix('products')->group(function () {
            Route::get('/', [AdminProductController::class, 'index']);
            Route::get('/categories', [AdminProductController::class, 'getCategories']);
            Route::get('/{id}', [AdminProductController::class, 'show']);
            Route::post('/', [AdminProductController::class, 'store']);
            Route::put('/{id}', [AdminProductController::class, 'update']);
            Route::delete('/{id}', [AdminProductController::class, 'destroy']);
            Route::post('/{id}/restore', [AdminProductController::class, 'restore']);
            Route::delete('/{id}/force', [AdminProductController::class, 'forceDestroy']);
        });

        // FIXED: Admin Management Routes - SIMPLIFIED
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::put('/admin/users/{id}/toggle-admin', [AdminController::class, 'toggleAdminStatus']);
        Route::get('/admin/users/status-updates', [AdminController::class, 'getUserStatusUpdates']);
    });
});

// ========================
// REACT ROUTER CATCH-ALL
// ========================
// This MUST be the last route in the file
Route::get('/{any}', function () {
    return view('home');
})->where('any', '.*');