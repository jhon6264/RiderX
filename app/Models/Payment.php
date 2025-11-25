<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount_paid',
        'status',
        'reference_number',
        'gcash_number',
        'qr_number', 
        'verified_by',
        'verified_at',
        'notes',
        'screenshot_path' 
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'verified_at' => 'datetime'
    ];

    // Relationship with Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relationship with User through Order
    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            Order::class,
            'id', // Foreign key on orders table
            'id', // Foreign key on users table  
            'order_id', // Local key on payments table
            'user_id' // Local key on orders table
        );
    }
}