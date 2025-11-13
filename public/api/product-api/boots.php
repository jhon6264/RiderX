<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config/security.php';

$boots = [
    // Reax Boots
    [
        'id' => 1,
        'name' => 'Reax Katana Riding Shoes',
        'brand' => 'Reax',
        'price' => 129.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2236/0537/reax_katana_riding_shoes_black_750x750.jpg'
    ],
    
    // Dainese Boots
    [
        'id' => 2,
        'name' => 'Dainese Seeker Gore-Tex Boots',
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Black/Army Green',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2523/8261/dainese_seeker_gore_tex_boots_black_army_green_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Dainese Nexus 2 Boots',
        'brand' => 'Dainese',
        'price' => 249.99,
        'color' => 'Red',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2528/7259/dainese_nexus2_boots_red_750x750.jpg'
    ],
    
    // TCX Boots
    [
        'id' => 4,
        'name' => 'TCX Comp Evo Michelin Boots',
        'brand' => 'TCX',
        'price' => 279.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/0324/2114/tcx_comp_evo_michelin_boots_black_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'TCX Comp Evo 2 Michelin Boots',
        'brand' => 'TCX',
        'price' => 289.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/1948/7000/tcx_comp_evo2_michelin_boots_black_grey_camo_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'TCX Comp Evo 2 Michelin Boots',
        'brand' => 'TCX',
        'price' => 289.99,
        'color' => 'White',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/1948/6966/tcx_comp_evo2_michelin_boots_black_white_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'TCX R04 D Air Womens Boots',
        'brand' => 'TCX',
        'price' => 199.99,
        'color' => 'Black/White',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/1681/6924/tcxr04_d_air_womens_boots_black_white_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'TCX Mood 2 Gore-Tex Boots',
        'brand' => 'TCX',
        'price' => 229.99,
        'color' => 'Green/Black/Yellow',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2365/9087/tcx_mood2_gore_tex_boots_green_black_yellow_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'TCX Infinity Mid WP Boots',
        'brand' => 'TCX',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/1681/5547/tcx_infinity_mid_wp_boots_black_750x750.jpg'
    ],
    [
        'id' => 10,
        'name' => 'TCX Infinity Mid WP Boots',
        'brand' => 'TCX',
        'price' => 179.99,
        'color' => 'Black/Green',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/1681/5598/tcx_infinity_mid_wp_boots_black_green_750x750.jpg'
    ],
    [
        'id' => 11,
        'name' => 'TCX Race Pro Air Boots',
        'brand' => 'TCX',
        'price' => 319.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2190/7864/tcxrt_race_pro_air_boots_black_reflex_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'TCX Race Pro Air Boots',
        'brand' => 'TCX',
        'price' => 319.99,
        'color' => 'Orange/Black',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2190/8544/tcxrt_race_pro_air_boots_750x750.jpg'
    ],
    [
        'id' => 13,
        'name' => 'TCX Race Pro Air Boots',
        'brand' => 'TCX',
        'price' => 319.99,
        'color' => 'Silver',
        'category' => 'boots',
        'image' => 'https://www.revzilla.com/product_images/2190/8646/tcxrt_race_pro_air_boots_750x750.jpg'
    ]
];

echo json_encode($boots, JSON_PRETTY_PRINT);
?>