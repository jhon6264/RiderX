<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductVariantSeeder extends Seeder
{
    // Extended color mapping with common motorcycle gear colors
    private $colorMap = [
        // Basic Colors
        'black' => '#000000',
        'white' => '#ffffff',
        'red' => '#e63946',
        'blue' => '#1d4ed8',
        'green' => '#15803d',
        'yellow' => '#eab308',
        'orange' => '#ea580c',
        'purple' => '#7c3aed',
        'pink' => '#db2777',
        'brown' => '#92400e',
        'gray' => '#6b7280',
        'grey' => '#6b7280',
        'silver' => '#d1d5db',
        'gold' => '#fbbf24',
        
        // Motorcycle Specific Colors
        'matte black' => '#374151',
        'glossy black' => '#1f2937',
        'carbon' => '#374151',
        'ivory' => '#fefce8',
        'khaki' => '#f0e68c',
        'camo' => '#a88c5c',
        'camo brown' => '#a88c5c',
        'olive' => '#808000',
        'navy' => '#000080',
        'burgundy' => '#800020',
        'teal' => '#008080',
        'maroon' => '#800000',
        'beige' => '#f5f5dc',
        'cream' => '#fffdd0',
        'charcoal' => '#36454f',
        'gunmetal' => '#2a3439',
        'bronze' => '#cd7f32',
        'copper' => '#b87333',
        'turquoise' => '#40e0d0',
        'lavender' => '#e6e6fa',
        'magenta' => '#ff00ff',
        'cyan' => '#00ffff',
        'lime' => '#00ff00',
        'indigo' => '#4b0082',
        'violet' => '#ee82ee',
        'coral' => '#ff7f50',
        'salmon' => '#fa8072',
        'tan' => '#d2b48c',
        'taupe' => '#483c32',
        'mauve' => '#e0b0ff',
        'peach' => '#ffe5b4',
    ];

    public function run()
    {
        // Clear existing data
        DB::table('product_variants')->delete();
        DB::table('products')->delete();
        DB::table('categories')->delete();

        // Create categories
        $categories = [
            ['name' => 'helmets', 'display_name' => 'Helmets'],
            ['name' => 'jackets', 'display_name' => 'Jackets'],
            ['name' => 'pants', 'display_name' => 'Pants'],
            ['name' => 'boots', 'display_name' => 'Boots'],
            ['name' => 'gloves', 'display_name' => 'Gloves'],
        ];

        $categoryIds = [];
        foreach ($categories as $category) {
            $categoryId = DB::table('categories')->insertGetId([
                'name' => $category['name'],
                'display_name' => $category['display_name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $categoryIds[$category['name']] = $categoryId;
        }

        // Process each category file
        $categoryFiles = ['helmets', 'jackets', 'pants', 'boots', 'gloves'];

        foreach ($categoryFiles as $category) {
            $filePath = public_path("api/product-api/{$category}.php");
            
            if (!file_exists($filePath)) {
                Log::warning("Category file not found: {$filePath}");
                continue;
            }

            // Get products from the PHP file
            $products = $this->getProductsFromFile($filePath, $category);
            
            if (empty($products)) {
                Log::warning("No products found in: {$category}");
                continue;
            }

            // Group products by name and brand
            $groupedProducts = [];
            foreach ($products as $product) {
                $key = $product['name'] . '|' . $product['brand'];
                
                if (!isset($groupedProducts[$key])) {
                    $groupedProducts[$key] = [
                        'name' => $product['name'],
                        'brand' => $product['brand'],
                        'base_price' => $product['price'],
                        'category_id' => $categoryIds[$category],
                        'variants' => []
                    ];
                }
                
                // Add variant with color - USING LOCAL IMAGE PATH FROM STATIC FILE
                $groupedProducts[$key]['variants'][] = [
                    'color' => $product['color'],
                    'image_url' => $product['image'], // This now uses your local paths like '/img/...'
                    'price' => $product['price'],
                    'stock_quantity' => rand(5, 50),
                    'sku' => 'RX-' . strtoupper(substr($category, 0, 3)) . '-' . uniqid()
                ];
            }

            // Insert grouped products into database with smart color assignment
            foreach ($groupedProducts as $productData) {
                $productId = DB::table('products')->insertGetId([
                    'name' => $productData['name'],
                    'brand' => $productData['brand'],
                    'base_price' => $productData['base_price'],
                    'category_id' => $productData['category_id'],
                    'description' => $this->generateDescription($productData['name'], $productData['brand']),
                    'specifications' => json_encode(['type' => 'standard']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Smart color assignment for variants
                $usedColors = [];
                foreach ($productData['variants'] as $variant) {
                    $hexCode = $this->getSmartHexCode($variant['color'], $usedColors);
                    $usedColors[] = strtolower($hexCode); // Track used hex codes
                    
                    DB::table('product_variants')->insert([
                        'product_id' => $productId,
                        'color' => $variant['color'],
                        'hex_code' => $hexCode,
                        'image_url' => $variant['image_url'], // This will be your local path
                        'price' => $variant['price'],
                        'stock_quantity' => $variant['stock_quantity'],
                        'sku' => $variant['sku'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            Log::info("Processed {$category}: " . count($groupedProducts) . " products");
        }

        Log::info("Product variant seeding completed successfully.");
    }

    /**
     * Smart color assignment - picks first unused color for each variant
     */
    private function getSmartHexCode($colorName, $usedHexCodes)
    {
        // Split color name by common separators
        $colorWords = preg_split('/[\s\/\-\&,]+/', $colorName);
        
        foreach ($colorWords as $word) {
            $word = strtolower(trim($word));
            
            // Skip common non-color words
            if (in_array($word, ['matte', 'glossy', 'carbon', 'modern', 'classic', 'team', 'element'])) {
                continue;
            }
            
            // Check if this color exists in our map
            if (isset($this->colorMap[$word])) {
                $hexCode = $this->colorMap[$word];
                
                // Check if this hex code hasn't been used yet for this product
                if (!in_array(strtolower($hexCode), $usedHexCodes)) {
                    return $hexCode;
                }
            }
        }
        
        // If all colors are used or none found, use first available color
        foreach ($colorWords as $word) {
            $word = strtolower(trim($word));
            if (isset($this->colorMap[$word])) {
                return $this->colorMap[$word];
            }
        }
        
        // Default fallback
        return '#6b7280';
    }

    private function getProductsFromFile($filePath, $category)
    {
        // Read the file content directly
        $fileContent = file_get_contents($filePath);
        
        if (empty($fileContent)) {
            return [];
        }

        // Extract the array variable name based on category
        $arrayVar = $category;
        
        // Find the array assignment
        $arrayStart = strpos($fileContent, '$' . $arrayVar . ' = [');
        if ($arrayStart === false) {
            return [];
        }
        
        $arrayEnd = strpos($fileContent, '];', $arrayStart) + 2;
        $arrayCode = substr($fileContent, $arrayStart, $arrayEnd - $arrayStart);
        
        // Safely evaluate the array
        $products = [];
        try {
            eval($arrayCode . '; $products = $' . $arrayVar . ';');
        } catch (\Exception $e) {
            Log::error("Error parsing {$category} file: " . $e->getMessage());
            return [];
        }
        
        return $products;
    }

    private function generateDescription($name, $brand)
    {
        return "Premium quality {$name} by {$brand}. Designed for maximum comfort, safety, and style for motorcycle enthusiasts.";
    }
}