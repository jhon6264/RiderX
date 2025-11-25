<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('login'); // We'll create this React page
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        // Check if user is admin
        if ($this->isAdmin(Auth::user())) {
            return response()->json([
                'success' => true, 
                'message' => 'Login successful'
            ]);
        }
        
        Auth::logout();
        return response()->json([
            'success' => false, 
            'message' => 'Admin access only.'
        ], 401);
    }

    return response()->json([
        'success' => false, 
        'message' => 'Invalid email or password.'
    ], 401);
}

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/admin/login');
    }

   private function isAdmin($user)
{
    return $user->is_admin == true; // Use == instead of ===
}
}