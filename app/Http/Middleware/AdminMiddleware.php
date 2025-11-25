<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthenticated.'], 401);
            }
            return redirect('/admin/login');
        }

        // Check if user is admin
        if (!$this->isAdmin(Auth::user())) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Admin access required.'], 403);
            }
            return redirect('/admin/login')->with('error', 'Admin access required.');
        }

        return $next($request);
    }

    private function isAdmin($user)
    {
        return $user->is_admin == true; // Use == for flexibility
    }
}