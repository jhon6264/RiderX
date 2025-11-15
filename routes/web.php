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
    
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        Log::info("User {$id} email verified successfully");
    }
    
    return redirect('/')->with('verified', true);
})->middleware(['signed'])->name('verification.verify');

// Success page after verification
Route::get('/email/verified', function () {
    return view('home')->with('message', 'Email verified successfully!');
})->name('verification.notice');

// API Routes
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
                    'email_verified' => !is_null($request->user()->email_verified_at)
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
    
    // Auth routes
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});