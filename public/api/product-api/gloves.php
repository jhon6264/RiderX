<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config/security.php';

$gloves = [
    // Dainese Gloves
    [
        'id' => 1,
        'name' => 'Dainese X-Ride 2 Ergo Tek Gloves',
        'brand' => 'Dainese',
        'price' => 129.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2382/5511/dainese_x_ride2_ergo_tek_gloves_black_black_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Dainese Air Maze Gloves',
        'brand' => 'Dainese',
        'price' => 89.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1545/2797/dainese_air_maze_gloves_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Dainese Carbon 4 Leather Gloves',
        'brand' => 'Dainese',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1944/2772/dainese_carbon4_leather_gloves_black_black_750x750.jpg'
    ],
    [
        'id' => 4,
        'name' => 'Dainese Carbon 4 Leather Gloves',
        'brand' => 'Dainese',
        'price' => 199.99,
        'color' => 'Orange',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1944/2806/dainese_carbon4_leather_gloves_black_black_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Dainese Carbon 4 Gloves',
        'brand' => 'Dainese',
        'price' => 189.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1896/3618/dainese_carbon4_gloves_black_black_black_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'Dainese Impeto Gloves',
        'brand' => 'Dainese',
        'price' => 79.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1376/9581/dainese_impeto_gloves_black_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'Dainese Impeto Gloves',
        'brand' => 'Dainese',
        'price' => 79.99,
        'color' => 'White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1376/9530/dainese_impeto_gloves_black_white_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'Dainese Impeto Gloves',
        'brand' => 'Dainese',
        'price' => 79.99,
        'color' => 'Orange',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1376/9615/dainese_impeto_gloves_black_lava_red_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Dainese Blackjack Gloves',
        'brand' => 'Dainese',
        'price' => 69.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0217/2147/dainese_blackjack_gloves_750x750.jpg'
    ],
    
    // Reax Gloves
    [
        'id' => 10,
        'name' => 'Reax Tasker Air Womens Gloves',
        'brand' => 'Reax',
        'price' => 59.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1529/8709/reax_tasker_air_womens_gloves_black_750x750.jpg'
    ],
    
    // Revit Gloves
    [
        'id' => 11,
        'name' => 'Revit Hydra 2 H2O Gloves',
        'brand' => 'Revit',
        'price' => 99.99,
        'color' => 'Grey',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2361/3036/revit_hydra2_h2_o_gloves_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'Revit Hydra 2 H2O Gloves',
        'brand' => 'Revit',
        'price' => 99.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2361/3036/revit_hydra2_h2_o_gloves_750x750.jpg'
    ]
];

echo json_encode($gloves, JSON_PRETTY_PRINT);
?>