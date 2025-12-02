<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'last_login_at',
        'last_logout_at',
        'last_activity_at',
        'login_count',
        'current_session_id',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'last_login_at' => 'datetime',
        'last_logout_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'login_count' => 'integer'
    ];

       public function isOnline()
    {
        if (!$this->last_activity_at) return false;
        
        return $this->last_activity_at->greaterThan(now()->subMinutes(5));
    }
    
    public function getStatus()
    {
        if (!$this->last_activity_at) {
            return ['status' => 'never', 'color' => 'gray', 'text' => 'Never Active'];
        }
        
        $minutesAgo = $this->last_activity_at->diffInMinutes(now());
        
        if ($minutesAgo < 5) {
            return [
                'status' => 'active',
                'color' => 'green',
                'text' => $minutesAgo < 1 ? 'Just now' : "Active {$minutesAgo}m ago"
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
}