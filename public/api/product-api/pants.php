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
        'image' => '/img/pants/dainese_drake_air_abs_luteshell_pants_black_black_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Dainese Drake Air Tex Pants',
        'brand' => 'Dainese',
        'price' => 229.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/dainese_drake_air_tex_pants_black_black_750x750.jpg'
    ],
    
    // Revit Pants
    [
        'id' => 3,
        'name' => 'Revit Sand 5 H2O Pants',
        'brand' => 'Revit',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/revit_sand5_h2_o_pants_black_750x750.jpg'
    ],
    [
        'id' => 4,
        'name' => 'Revit Sand 5 H2O Pants',
        'brand' => 'Revit',
        'price' => 199.99,
        'color' => 'Silver/Black',
        'category' => 'pants',
        'image' => '/img/pants/revit_sand5_h2_o_pants_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Revit Tornado 4 H2O Pants',
        'brand' => 'Revit',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/revit_tornado4_h2_o_pants_black_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'Revit Tornado 4 H2O Pants',
        'brand' => 'Revit',
        'price' => 179.99,
        'color' => 'White',
        'category' => 'pants',
        'image' => '/img/pants/revit_tornado4_h2_o_pants_white_750x750.jpg'
    ],
    
    // Sedici Pants
    [
        'id' => 7,
        'name' => 'Sedici Alexi2 Mesh Pants',
        'brand' => 'Sedici',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/sedici_alexi2_mesh_pants_black_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'Sedici Alexi2 Mesh Pants',
        'brand' => 'Sedici',
        'price' => 149.99,
        'color' => 'White',
        'category' => 'pants',
        'image' => '/img/pants/sedici_alexi2_mesh_pants_silver_black_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Sedici Corsa2 Pants',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/sedici_corsa2_pants_black_black_750x750.jpg'
    ],
    
    // Alpinestars Pants
    [
        'id' => 10,
        'name' => 'Alpinestars Missile V3 Airflow Pants',
        'brand' => 'Alpinestars',
        'price' => 279.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_missilev3_airflow_pants_black_black_750x750.jpg'
    ],
    [
        'id' => 11,
        'name' => 'Alpinestars Track V2 Leather Pants',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_trackv2_leather_pants_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'Alpinestars Ramjet Pants',
        'brand' => 'Alpinestars',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_pant_ramjet_black_750x750.jpg'
    ],
    
    // New Alpinestars Pants
    [
        'id' => 14,
        'name' => 'Alpinestars Pro Dura Pants',
        'brand' => 'Alpinestars',
        'price' => 189.99,
        'color' => 'Navy/Orange/White',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_pro_dura_pants_navy_orange_white_750x750.jpg'
    ],
    [
        'id' => 15,
        'name' => 'Alpinestars Pro Dura Pants',
        'brand' => 'Alpinestars',
        'price' => 189.99,
        'color' => 'Navy/White',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_pro_dura_pants_navy_white_750x750.jpg'
    ],
    [
        'id' => 16,
        'name' => 'Alpinestars Pro Dura Pants',
        'brand' => 'Alpinestars',
        'price' => 189.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_pro_dura_pants_black_750x750.jpg'
    ],
    
    // Alpinestars Fluid Apex Pants
    [
        'id' => 17,
        'name' => 'Alpinestars Fluid Apex Pants',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_fluid_apex_pants_black_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'Alpinestars Fluid Apex Pants',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Blue/Yellow Fluo',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_fluid_apex_pants_blue_750x750.jpg'
    ],
    [
        'id' => 19,
        'name' => 'Alpinestars Fluid Apex Pants',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Pink/Purple/Orange',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_fluid_apex_pants_pink_purple_orange_750x750.jpg'
    ],
    [
        'id' => 20,
        'name' => 'Alpinestars Fluid Apex Pants',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Red/White',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_fluid_apex_pants_red_white_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'Alpinestars Fluid Apex Pants',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Yellow/Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_fluid_apex_pants_750x750.jpg'
    ],
    
    // Alpinestars Supertech Vista Pants
    [
        'id' => 22,
        'name' => 'Alpinestars Supertech Vista Pants',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Yellow/Purple/Black',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_supertech_vista_pants_750x750.jpg'
    ],
    [
        'id' => 23,
        'name' => 'Alpinestars Supertech Vista Pants',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Grey/Yellow Fluo/Blue',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_supertech_vista_pants_grey_yellow_fluo_blue_750x750.jpg'
    ],
    [
        'id' => 24,
        'name' => 'Alpinestars Supertech Vista Pants',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Navy/Hot Coral/Cobalt',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_supertech_vista_pants_navy750x750.jpg'
    ],
    
    // Alpinestars Supertech AFD Vista Pants
    [
        'id' => 25,
        'name' => 'Alpinestars Supertech AFD Vista Pants',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Black/Red/White',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_supertech_afd_vista_pants_black_750x750.jpg'
    ],
    [
        'id' => 26,
        'name' => 'Alpinestars Supertech AFD Vista Pants',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'White/Purple',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_supertech_afd_vista_pants_white_750x750.jpg'
    ],
    
    // Dainese Leather Pants
    [
        'id' => 27,
        'name' => 'Dainese Delta 4 Leather Pants',
        'brand' => 'Dainese',
        'price' => 449.99,
        'color' => 'Black/Black',
        'category' => 'pants',
        'image' => '/img/pants/dainese_delta4_leather_pants_black_black_750x750.jpg'
    ],
    [
        'id' => 28,
        'name' => 'Dainese Delta 4 Leather Pants',
        'brand' => 'Dainese',
        'price' => 449.99,
        'color' => 'Black/White',
        'category' => 'pants',
        'image' => '/img/pants/dainese_delta4_leather_pants_black_black_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Dainese Super Speed Perforated Leather Pants',
        'brand' => 'Dainese',
        'price' => 499.99,
        'color' => 'Black/White/Red',
        'category' => 'pants',
        'image' => '/img/pants/dainese_super_speed_perforated_leather_pants_black_white_red_750x750.jpg'
    ],
    
    // Klim Pants
    [
        'id' => 13,
        'name' => 'Klim Carlsbad Pants',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Petrol Strike Orange',
        'category' => 'pants',
        'image' => '/img/pants/klim_carlsbad_pant_petrol_strike_orange_750x750.jpg'
    ],
    
    // Klim Mojave Pants
    [
        'id' => 30,
        'name' => 'Klim Mojave In The Boot Pants',
        'brand' => 'Klim',
        'price' => 299.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/klim_mojave_in_the_boot_pant_black_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Klim Mojave ITB Pants',
        'brand' => 'Klim',
        'price' => 299.99,
        'color' => 'Peyote/Asphalt',
        'category' => 'pants',
        'image' => '/img/pants/klim_mojave_itb_pants_peyote_asphalt_750x750.jpg'
    ],
    [
        'id' => 32,
        'name' => 'Klim Mojave ITB Pants',
        'brand' => 'Klim',
        'price' => 299.99,
        'color' => 'High Rise/Nightfall Blue',
        'category' => 'pants',
        'image' => '/img/pants/klim_mojave_itb_pants_high_rise_nightfall_blue_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Klim Mojave ITB Pants',
        'brand' => 'Klim',
        'price' => 299.99,
        'color' => 'Petrol/Golden Brown',
        'category' => 'pants',
        'image' => '/img/pants/klim_mojave_itb_pants_petrol_golden_brown_750x750.jpg'
    ],
    
    // Klim Jackson Pants
    [
        'id' => 34,
        'name' => 'Klim Jackson Pants',
        'brand' => 'Klim',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/klim_jackson_pants_stealth_black_750x750.jpg'
    ],
    [
        'id' => 35,
        'name' => 'Klim Jackson Pants',
        'brand' => 'Klim',
        'price' => 349.99,
        'color' => 'Golden Brown',
        'category' => 'pants',
        'image' => '/img/pants/klim_jackson_pants_golden_brown_750x750.jpg'
    ],
    [
        'id' => 36,
        'name' => 'Klim Jackson Pants',
        'brand' => 'Klim',
        'price' => 349.99,
        'color' => 'Petrol/Monument',
        'category' => 'pants',
        'image' => '/img/pants/klim_jackson_pants_petrol_750x750.jpg'
    ],
    
    // Klim XC Pro Pants
    [
        'id' => 37,
        'name' => 'Klim XC Pro Pants',
        'brand' => 'Klim',
        'price' => 379.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_pro_pants_black_750x750.jpg'
    ],
    [
        'id' => 38,
        'name' => 'Klim XC Pro Pants',
        'brand' => 'Klim',
        'price' => 379.99,
        'color' => 'Slate Grey/Black',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_pro_pants_slate_grey_black_750x750.jpg'
    ],
    [
        'id' => 39,
        'name' => 'Klim XC Pro Pants',
        'brand' => 'Klim',
        'price' => 379.99,
        'color' => 'Hi-Viz',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_pro_pants_hi_viz_750x750.jpg'
    ],
    [
        'id' => 40,
        'name' => 'Klim XC Pro Pants',
        'brand' => 'Klim',
        'price' => 379.99,
        'color' => 'Redrock',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_pro_pants_redrock_750x750.jpg'
    ],
    
    // Klim XC Lite Pants
    [
        'id' => 41,
        'name' => 'Klim XC Lite Pants',
        'brand' => 'Klim',
        'price' => 329.99,
        'color' => 'Heliotrope',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_lite_pants_heliotrope_750x750.jpg'
    ],
    [
        'id' => 42,
        'name' => 'Klim XC Lite Pants',
        'brand' => 'Klim',
        'price' => 329.99,
        'color' => 'Monument',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_lite_pants_monument_750x750.jpg'
    ],
    [
        'id' => 43,
        'name' => 'Klim XC Lite Pants',
        'brand' => 'Klim',
        'price' => 329.99,
        'color' => 'Winter Moss',
        'category' => 'pants',
        'image' => '/img/pants/klim_xc_lite_pants_winter_moss_750x750.jpg'
    ],
    
    // Alpinestars Adventure Pants
    [
        'id' => 44,
        'name' => 'Alpinestars AMT10 R Drystar XF Pants',
        'brand' => 'Alpinestars',
        'price' => 399.99,
        'color' => 'Pale Brown',
        'category' => 'pants',
        'image' => '/img/pants/alpinestars_amt10_r_drystar_xf_pants_pale_brown_750x750.jpg'
    ],
    
    // Women's Pants
    [
        'id' => 45,
        'name' => 'Dainese Tempest 3 D-Dry Womens Pants',
        'brand' => 'Dainese',
        'price' => 269.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/dainese_tempest3_d_dry_womens_pants_black_750x750.jpg'
    ],
    [
        'id' => 46,
        'name' => 'Dainese Tempest 3 D-Dry Womens Pants',
        'brand' => 'Dainese',
        'price' => 269.99,
        'color' => 'Black/Red',
        'category' => 'pants',
        'image' => '/img/pants/dainese_tempest3_d_dry_womens_pants_black_red_750x750.jpg'
    ],
    
    [
        'id' => 47,
        'name' => 'Dainese Mangen Absoluteshell Pro Womens Pants',
        'brand' => 'Dainese',
        'price' => 329.99,
        'color' => 'Ebony/Black',
        'category' => 'pants',
        'image' => '/img/pants/dainese_mangen_absoluteshell_pro_womens_pants_black_750x750.jpg'
    ],
    [
        'id' => 48,
        'name' => 'Dainese Mangen Absoluteshell Pro Womens Pants',
        'brand' => 'Dainese',
        'price' => 329.99,
        'color' => 'Dark Green/Black',
        'category' => 'pants',
        'image' => '/img/pants/dainese_mangen_absoluteshell_pro_womens_pants_green_750x750.jpg'
    ],
    
    // Women's Leggings
    [
        'id' => 49,
        'name' => 'Revit Ellison Womens Leggings',
        'brand' => 'Revit',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/revit_ellison_womens_leggings_black_750x750.jpg'
    ],
    [
        'id' => 50,
        'name' => 'Street Steel Moto Leggings',
        'brand' => 'Street Steel',
        'price' => 119.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/street_steel_moto_leggings_black_black_750x750.jpg'
    ],
    
    // Additional Dainese Pants
    [
        'id' => 51,
        'name' => 'Dainese Tempest 3 D-Dry Pants',
        'brand' => 'Dainese',
        'price' => 249.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/dainese_tempest3_d_dry_pants_black_750x750.jpg'
    ],
    [
        'id' => 52,
        'name' => 'Dainese Tempest 3 D-Dry Pants',
        'brand' => 'Dainese',
        'price' => 249.99,
        'color' => 'Black/Red',
        'category' => 'pants',
        'image' => '/img/pants/dainese_tempest3_d_dry_pants_black_750x750.jpg'
    ],
    
    // Oxford Pants
    [
        'id' => 53,
        'name' => 'Oxford Mondial Pants',
        'brand' => 'Oxford',
        'price' => 179.99,
        'color' => 'Tech Black',
        'category' => 'pants',
        'image' => '/img/pants/oxford_mondial_pants_black_750x750.jpg'
    ],
    [
        'id' => 54,
        'name' => 'Oxford Mondial Pants',
        'brand' => 'Oxford',
        'price' => 179.99,
        'color' => 'Grey/Blue/Red',
        'category' => 'pants',
        'image' => '/img/pants/oxford_mondial_pants_750x750.jpg'
    ],
    
    [
        'id' => 55,
        'name' => 'Oxford Continental Pants',
        'brand' => 'Oxford',
        'price' => 159.99,
        'color' => 'Desert',
        'category' => 'pants',
        'image' => '/img/pants/oxford_continental_pants_desert_750x750.jpg'
    ],
    [
        'id' => 56,
        'name' => 'Oxford Continental Pants',
        'brand' => 'Oxford',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'pants',
        'image' => '/img/pants/oxford_continental_pants_750x750.jpg'
    ]
];

echo json_encode($pants, JSON_PRETTY_PRINT);
?>