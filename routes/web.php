<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Illuminate\Http\Request;

// Home route
Route::get('/', function () {
    return view('home');
});

// Login redirect (Fortify needs this)
Route::get('/login', function () {
    return redirect('/')->with('showAuthModal', true);
})->name('login');

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
    // Test route
    Route::get('/test', function () {
        return response()->json(['message' => 'API is working!', 'status' => 'success']);
    });
    
    // Auth routes
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});

// API Routes
Route::prefix('api')->group(function () {
    // ADD THIS ROUTE - Auth status check
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

    // Your existing API routes below...
    Route::get('/test', function () {
        return response()->json(['message' => 'API is working!', 'status' => 'success']);
    });
    
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});