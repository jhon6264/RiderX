<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_variant_id',
        'quantity',
        'price',
        'total'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2'
    ];

    // Relationship with Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relationship with Product Variant
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}