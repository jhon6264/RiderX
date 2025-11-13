<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config/security.php';

$jackets = [
    // Dainese Jackets
    [
        'id' => 1,
        'name' => 'Dainese Air Fast Tex Jacket',
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Black/Grey',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2192/2866/dainese_air_fast_tex_jacket_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Dainese Air Fast Tex Jacket', 
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2192/2849/dainese_air_fast_tex_jacket_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Dainese Air Fast Tex Jacket',
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Red',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2190/4328/dainese_air_fast_tex_jacket_red_750x750.jpg'
    ],
    
    // Sedici Jackets
    [
        'id' => 4,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2410/6275/sedici_podio2_jacket_black_black_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'White/Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2410/6292/sedici_podio2_jacket_white_black_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'Black/Orange',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2410/6326/sedici_podio2_jacket_black_orange_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'Red/Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2410/6309/sedici_podio2_jacket_red_black_750x750.jpg'
    ],
    
    // Alpinestars Jackets
    [
        'id' => 8,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2279/2437/alpinestars_andes_air_drystar_jacket_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Grey',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2279/2471/alpinestars_andes_air_drystar_jacket_ice_grey_dark_grey_black_750x750.jpg'
    ],
    [
        'id' => 10,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Brown',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2395/3046/alpinestars_andes_air_drystar_jacket_black_grey_blue_750x750.jpg'
    ],
    [
        'id' => 11,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Dark Blue',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2279/2403/alpinestars_andes_air_drystar_jacket_750x750.jpg'
    ],
    
    // More Dainese
    [
        'id' => 12,
        'name' => 'Dainese Hydra Flux2 Air D-Dry Jacket',
        'brand' => 'Dainese',
        'price' => 329.99,
        'color' => 'Black/Grey',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1643/8817/dainese_hydra_flux2_air_d_dry_jacket_black_grey_750x750.jpg'
    ],
    [
        'id' => 13,
        'name' => 'Dainese Hydra Flux2 Air D-Dry Jacket',
        'brand' => 'Dainese',
        'price' => 329.99,
        'color' => 'Orange',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1643/8698/dainese_hydra_flux2_air_d_dry_jacket_black_grey_750x750.jpg'
    ],
    
    // Merlin Jackets
    [
        'id' => 14,
        'name' => 'Merlin Shenstone II Cotec Air Jacket',
        'brand' => 'Merlin',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2412/0317/merlin_shenstone_ii_cotec_air_jacket_black_750x750.jpg'
    ],
    [
        'id' => 15,
        'name' => 'Merlin Shenstone II Cotec Air Jacket',
        'brand' => 'Merlin',
        'price' => 179.99,
        'color' => 'Olive',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2412/0402/merlin_shenstone_ii_cotec_air_jacket_olive_750x750.jpg'
    ],
    
    // Revit Jackets
    [
        'id' => 16,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2379/8379/revit_sand5_h2_o_jacket_black_anthracite_750x750.jpg'
    ],
    [
        'id' => 17,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Grey',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2404/0829/revit_sand5_h2_o_jacket_grey_dark_grey_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Sand Brown',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2379/8277/revit_sand5_h2_o_jacket_750x750.jpg'
    ],
    [
        'id' => 19,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Silver',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2379/8243/revit_sand5_h2_o_jacket_750x750.jpg'
    ],
    
    // Reax Jackets
    [
        'id' => 20,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'Green',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2244/4788/reax_alta2_mesh_jacket_black_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2244/4737/reax_alta2_mesh_jacket_black_750x750.jpg'
    ],
    [
        'id' => 22,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'White',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2244/4754/reax_alta2_mesh_jacket_black_750x750.jpg'
    ],
    [
        'id' => 23,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'Rust',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2244/4805/reax_alta2_mesh_jacket_black_750x750.jpg'
    ],
    
    // Klim Jackets
    [
        'id' => 24,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Winter Moss',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2209/4568/klim_marrakesh_jacket_winter_moss_750x750.jpg'
    ],
    [
        'id' => 25,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Stealth Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1995/0973/klim_marrakesh_jacket_stealth_black_750x750.jpg'
    ],
    [
        'id' => 26,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Grey',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1995/2775/klim_marrakesh_jacket_grey_750x750.jpg'
    ],
    [
        'id' => 27,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Petrol Blue',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1995/3625/klim_marrakesh_jacket_potters_clay_750x750.jpg'
    ],
    
    // Women's Jackets
    [
        'id' => 28,
        'name' => 'Sedici Alexi2 Womens Mesh Jacket',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1393/2747/sedici_alexi2_womens_mesh_jacket_black_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Sedici Alexi2 Womens Mesh Jacket',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Silver',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1393/3971/sedici_alexi2_womens_mesh_jacket_white_fuchsia_750x750.jpg'
    ],
    [
        'id' => 30,
        'name' => 'Alpinestars Stella Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2280/1410/alpinestars_stella_andes_air_drystar_jacket_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Alpinestars Stella Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Ice Grey',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/2280/1376/alpinestars_stella_andes_air_drystar_jacket_750x750.jpg'
    ],
    [
        'id' => 32,
        'name' => 'Revit Sand 4 H2O Womens Jacket',
        'brand' => 'Revit',
        'price' => 269.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1505/7110/revit_sand4_h2_o_womens_jacket_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Revit Sand 4 H2O Womens Jacket',
        'brand' => 'Revit',
        'price' => 269.99,
        'color' => 'Silver',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1505/7042/revit_sand4_h2_o_womens_jacket_750x750.jpg'
    ],
    [
        'id' => 34,
        'name' => 'Revit Sand 4 H2O Womens Jacket',
        'brand' => 'Revit',
        'price' => 269.99,
        'color' => 'Camo Brown',
        'category' => 'jackets',
        'image' => 'https://www.revzilla.com/product_images/1505/6957/revit_sand4_h2_o_womens_jacket_750x750.jpg'
    ]
];

echo json_encode($jackets, JSON_PRETTY_PRINT);
?>