<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Cast to User model to access the update method
            if ($user instanceof User) {
                // Check if user is admin
                if ($this->isAdmin($user)) {
                    // Update login tracking
                    $user->update([
                        'last_login_at' => now(),
                        'last_activity_at' => now(),
                        'login_count' => $user->login_count + 1,
                        'current_session_id' => session()->getId()
                    ]);
                    
                    return response()->json([
                        'success' => true, 
                        'message' => 'Login successful'
                    ]);
                }
            } else {
                // If not a User instance, log out
                Auth::logout();
                return response()->json([
                    'success' => false, 
                    'message' => 'Invalid user type.'
                ], 401);
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
        if (Auth::check()) {
            $user = Auth::user();
            if ($user instanceof User) {
                $user->update(['last_logout_at' => now()]);
            }
        }
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/admin/login');
    }

    private function isAdmin($user)
    {
        return $user->is_admin == true;
    }
}