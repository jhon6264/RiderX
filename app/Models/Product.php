<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'brand', 'base_price', 'description', 
        'category_id', 'specifications'
    ];

    protected $casts = [
        'specifications' => 'array'
    ];

    // Relationship with variants
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    // Relationship with category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}