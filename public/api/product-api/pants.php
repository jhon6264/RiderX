<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'config/security.php';

$pants = [
    // Dainese Pants
    [
        'id' => 1,
        'name' => 'Dainese Drake Air ABS Luteshell Pants',
        'brand' => 'Dainese',
        'price' => 249.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2526/2863/dainese_drake_air_abs_luteshell_pants_black_black_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Dainese Drake Air Tex Pants',
        'brand' => 'Dainese',
        'price' => 229.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2192/9290/dainese_drake_air_tex_pants_black_black_750x750.jpg'
    ],
    
    // Revit Pants
    [
        'id' => 3,
        'name' => 'Revit Sand 5 H2O Pants',
        'brand' => 'Revit',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2379/8481/revit_sand5_h2_o_pants_black_750x750.jpg'
    ],
    [
        'id' => 4,
        'name' => 'Revit Sand 5 H2O Pants',
        'brand' => 'Revit',
        'price' => 199.99,
        'color' => 'Silver/Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2379/8413/revit_sand5_h2_o_pants_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Revit Tornado 4 H2O Pants',
        'brand' => 'Revit',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2194/2125/revit_tornado4_h2_o_pants_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'Revit Tornado 4 H2O Pants',
        'brand' => 'Revit',
        'price' => 179.99,
        'color' => 'White',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2194/2159/revit_tornado4_h2_o_pants_750x750.jpg'
    ],
    
    // Sedici Pants
    [
        'id' => 7,
        'name' => 'Sedici Alexi2 Mesh Pants',
        'brand' => 'Sedici',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/1393/4464/sedici_alexi2_mesh_pants_black_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'Sedici Alexi2 Mesh Pants',
        'brand' => 'Sedici',
        'price' => 149.99,
        'color' => 'White',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2097/8753/sedici_alexi2_mesh_pants_silver_black_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Sedici Corsa2 Pants',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/2415/1318/sedici_corsa2_pants_black_black_750x750.jpg'
    ],
    
    // Alpinestars Pants
    [
        'id' => 10,
        'name' => 'Alpinestars Missile V3 Airflow Pants',
        'brand' => 'Alpinestars',
        'price' => 279.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/1783/9198/alpinestars_missilev3_airflow_pants_black_black_750x750.jpg'
    ],
    [
        'id' => 11,
        'name' => 'Alpinestars Track V2 Leather Pants',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/0904/9401/alpinestars_trackv2_leather_pants_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'Alpinestars Ramjet Pants',
        'brand' => 'Alpinestars',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/0268/0254/alpinestars_pant_ramjet_black_750x750.jpg'
    ],
    
    // Klim Pants
    [
        'id' => 13,
        'name' => 'Klim Carlsbad Pants',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Petrol Strike Orange',
        'category' => 'pants',
        'image' => 'https://www.revzilla.com/product_images/1730/3570/klim_carlsbad_pant_petrol_strike_orange_750x750.jpg'
    ]
];

echo json_encode($pants, JSON_PRETTY_PRINT);
?>