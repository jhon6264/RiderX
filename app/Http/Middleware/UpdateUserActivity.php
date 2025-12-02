<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UpdateUserActivity
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            // Check if it's a User model instance
            if ($user instanceof User) {
                $user->update(['last_activity_at' => now()]);
            }
        }
        
        return $next($request);
    }
}