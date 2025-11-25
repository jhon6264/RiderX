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
        'image' => '/img/jackets/dainese_air_fast_tex_jacket_black_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Dainese Air Fast Tex Jacket', 
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/dainese_air_fast_tex_jacket_white_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Dainese Air Fast Tex Jacket',
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Red',
        'category' => 'jackets',
        'image' => '/img/jackets/dainese_air_fast_tex_jacket_red_750x750.jpg'
    ],
    
    // Sedici Jackets
    [
        'id' => 4,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/sedici_podio2_jacket_black_black_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'White/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/sedici_podio2_jacket_white_black_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'Black/Orange',
        'category' => 'jackets',
        'image' => '/img/jackets/sedici_podio2_jacket_black_orange_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'Sedici Podio2 Jacket',
        'brand' => 'Sedici',
        'price' => 199.99,
        'color' => 'Red/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/sedici_podio2_jacket_red_black_750x750.jpg'
    ],
    
    // Alpinestars Jackets
    [
        'id' => 8,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_andes_air_drystar_jacket_black_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Grey',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_andes_air_drystar_jacket_ice_grey_dark_grey_black_750x750.jpg'
    ],
    [
        'id' => 10,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Brown',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_andes_air_drystar_jacket_black_grey_blue_750x750.jpg'
    ],
    [
        'id' => 11,
        'name' => 'Alpinestars Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 349.99,
        'color' => 'Dark Blue',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_andes_air_drystar_jacket_blue_750x750.jpg'
    ],
    
    // New Alpinestars Jackets
    [
        'id' => 35,
        'name' => 'Alpinestars Atem V5 Jacket',
        'brand' => 'Alpinestars',
        'price' => 399.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_atem_v5_jacket_black_750x750.jpg'
    ],
    [
        'id' => 36,
        'name' => 'Alpinestars Atem V5 Jacket',
        'brand' => 'Alpinestars',
        'price' => 399.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_atem_v5_jacket_white_750x750.jpg'
    ],
    
    // Alpinestars Fluid Apex Jersey
    [
        'id' => 37,
        'name' => 'Alpinestars Fluid Apex Jersey',
        'brand' => 'Alpinestars',
        'price' => 89.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_fluid_apex_jersey_black_750x750.jpg'
    ],
    [
        'id' => 38,
        'name' => 'Alpinestars Fluid Apex Jersey',
        'brand' => 'Alpinestars',
        'price' => 89.99,
        'color' => 'Blue/Yellow Fluo',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_fluid_apex_jersey_blue_yellow_fluo_750x750.jpg'
    ],
    [
        'id' => 39,
        'name' => 'Alpinestars Fluid Apex Jersey',
        'brand' => 'Alpinestars',
        'price' => 89.99,
        'color' => 'Pink/Purple/Orange',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_fluid_apex_jersey_pink_purple_orange_750x750.jpg'
    ],
    [
        'id' => 40,
        'name' => 'Alpinestars Fluid Apex Jersey',
        'brand' => 'Alpinestars',
        'price' => 89.99,
        'color' => 'Red/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_fluid_apex_jersey_red_white_750x750.jpg'
    ],
    [
        'id' => 41,
        'name' => 'Alpinestars Fluid Apex Jersey',
        'brand' => 'Alpinestars',
        'price' => 89.99,
        'color' => 'Yellow/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_fluid_apex_jersey_yellow_black_750x750.jpg'
    ],
    
    // Alpinestars Leather Jackets
    [
        'id' => 42,
        'name' => 'Alpinestars Missile V3 Ignition Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 799.99,
        'color' => 'Black/Red',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_missile_v3_ignition_leather_jacket_black_red_750x750.jpg'
    ],
    [
        'id' => 43,
        'name' => 'Alpinestars Missile V3 Ignition Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 799.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_missile_v3_ignition_leather_jacket_black_white_750x750.jpg'
    ],
    
    [
        'id' => 44,
        'name' => 'Alpinestars GP Plus V4 Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 749.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_plus_v4_leather_jacket_black_white_750x750.jpg'
    ],
    [
        'id' => 45,
        'name' => 'Alpinestars GP Plus V4 Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 749.99,
        'color' => 'Black/Red/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_plus_v4_leather_jacket_black_red_fluo_white_750x750.jpg'
    ],
    [
        'id' => 46,
        'name' => 'Alpinestars GP Plus V4 Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 749.99,
        'color' => 'Black/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_plus_v4_leather_jacket_black_black_750x750.jpg'
    ],
    
    [
        'id' => 47,
        'name' => 'Alpinestars GP Force V2 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 899.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_force_v2_airflow_leather_jacket_black_white_750x750.jpg'
    ],
    [
        'id' => 48,
        'name' => 'Alpinestars GP Force V2 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 899.99,
        'color' => 'Black/Red',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_force_v2_airflow_leather_jacket_750x750.jpg'
    ],
    [
        'id' => 49,
        'name' => 'Alpinestars GP Force V2 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 899.99,
        'color' => 'Black/Hi-Viz Yellow',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_force_v2_airflow_leather_jacket_black_hi_viz_yellow_750x750.jpg'
    ],
    [
        'id' => 50,
        'name' => 'Alpinestars GP Force V2 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 899.99,
        'color' => 'Red/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_gp_force_v2_airflow_leather_jacket_red_black_750x750.jpg'
    ],
    
    [
        'id' => 51,
        'name' => 'Alpinestars Faster V3 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Black/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_faster_v3_airflow_leather_jacket_black_black_750x750.jpg'
    ],
    [
        'id' => 52,
        'name' => 'Alpinestars Faster V3 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_faster_v3_airflow_leather_jacket_black_white_750x750.jpg'
    ],
    [
        'id' => 53,
        'name' => 'Alpinestars Faster V3 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Black/Red Fluo',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_faster_v3_airflow_leather_jacket_black_red_fluo_750x750.jpg'
    ],
    [
        'id' => 54,
        'name' => 'Alpinestars Faster V3 Airflow Leather Jacket',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Black/White/Yellow Fluo',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_faster_v3_airflow_leather_jacket_black_white_yellow_fluo_750x750.jpg'
    ],
    
    // More Dainese
    [
        'id' => 12,
        'name' => 'Dainese Hydra Flux2 Air D-Dry Jacket',
        'brand' => 'Dainese',
        'price' => 329.99,
        'color' => 'Black/Grey',
        'category' => 'jackets',
        'image' => '/img/jackets/dainese_hydra_flux2_air_d_dry_jacket_black_grey_750x750.jpg'
    ],
    [
        'id' => 13,
        'name' => 'Dainese Hydra Flux2 Air D-Dry Jacket',
        'brand' => 'Dainese',
        'price' => 329.99,
        'color' => 'Orange',
        'category' => 'jackets',
        'image' => '/img/jackets/dainese_hydra_flux2_air_d_dry_jacket_black_orange_750x750.jpg'
    ],
    
    // Merlin Jackets
    [
        'id' => 14,
        'name' => 'Merlin Shenstone II Cotec Air Jacket',
        'brand' => 'Merlin',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/merlin_shenstone_ii_cotec_air_jacket_black_750x750.jpg'
    ],
    [
        'id' => 15,
        'name' => 'Merlin Shenstone II Cotec Air Jacket',
        'brand' => 'Merlin',
        'price' => 179.99,
        'color' => 'Olive',
        'category' => 'jackets',
        'image' => '/img/jackets/merlin_shenstone_ii_cotec_air_jacket_olive_750x750.jpg'
    ],
    
    // Revit Jackets
    [
        'id' => 16,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand5_h2_o_jacket_black_anthracite_750x750.jpg'
    ],
    [
        'id' => 17,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Grey',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand5_h2_o_jacket_grey_dark_grey_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Sand Brown',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand5_h2_o_jacket_sand_brown_750x750.jpg'
    ],
    [
        'id' => 19,
        'name' => 'Revit Sand 5 H2O Jacket',
        'brand' => 'Revit',
        'price' => 279.99,
        'color' => 'Silver',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand5_h2_o_jacket_silver_750x750.jpg'
    ],
    
    // Reax Jackets
    [
        'id' => 20,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'Green',
        'category' => 'jackets',
        'image' => '/img/jackets/reax_alta2_mesh_jacket_green_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/reax_alta2_mesh_jacket_black_750x750.jpg'
    ],
    [
        'id' => 22,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'White',
        'category' => 'jackets',
        'image' => '/img/jackets/reax_alta2_mesh_jacket_silver_750x750.jpg'
    ],
    [
        'id' => 23,
        'name' => 'Reax Alta2 Mesh Jacket',
        'brand' => 'Reax',
        'price' => 149.99,
        'color' => 'Rust',
        'category' => 'jackets',
        'image' => '/img/jackets/reax_alta2_mesh_jacket_rust_750x750.jpg'
    ],
    
    // Klim Jackets
    [
        'id' => 24,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Winter Moss',
        'category' => 'jackets',
        'image' => '/img/jackets/klim_marrakesh_jacket_winter_moss_750x750.jpg'
    ],
    [
        'id' => 25,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Stealth Black',
        'category' => 'jackets',
        'image' => '/img/jackets/klim_marrakesh_jacket_stealth_black_750x750.jpg'
    ],
    [
        'id' => 26,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Grey',
        'category' => 'jackets',
        'image' => '/img/jackets/klim_marrakesh_jacket_grey_750x750.jpg'
    ],
    [
        'id' => 27,
        'name' => 'Klim Marrakesh Jacket',
        'brand' => 'Klim',
        'price' => 389.99,
        'color' => 'Petrol Blue',
        'category' => 'jackets',
        'image' => '/img/jackets/klim_marrakesh_jacket_potters_clay_750x750.jpg'
    ],
    
    // Protective Gear / Chest Protectors
    [
        'id' => 55,
        'name' => 'Alpinestars A10 V2 Full Chest Protector',
        'brand' => 'Alpinestars',
        'price' => 199.99,
        'color' => 'Anthracite/Black/Red',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_a10_v2_full_chest_protector_anthracite_black_red_750x750.jpg'
    ],
    [
        'id' => 56,
        'name' => 'Leatt Moto65 Pro Chest Protector',
        'brand' => 'Leatt',
        'price' => 179.99,
        'color' => 'White',
        'category' => 'jackets',
        'image' => '/img/jackets/leatt_moto65_pro_chest_protector_white_750x750.jpg'
    ],
    [
        'id' => 57,
        'name' => 'Leatt 5.5 Pro Evo Chest Protector',
        'brand' => 'Leatt',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/leatt55_pro_evo_chest_protector_black_750x750.jpg'
    ],
    
    // Body Protectors
    [
        'id' => 58,
        'name' => 'Leatt Moto65 Body Protector',
        'brand' => 'Leatt',
        'price' => 249.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/leatt_moto65_body_protector_750x750.jpg'
    ],
    [
        'id' => 59,
        'name' => 'Leatt 5.5 Evo Body Protector',
        'brand' => 'Leatt',
        'price' => 229.99,
        'color' => 'Black/Red',
        'category' => 'jackets',
        'image' => '/img/jackets/leatt55_evo_body_protector_750x750.jpg'
    ],
    [
        'id' => 60,
        'name' => 'Alpinestars Bionic Plus V2 Jacket',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_bionic_plus_v2_jacket_black_white_750x750.jpg'
    ],
    
    // Women's Jackets
    [
        'id' => 28,
        'name' => 'Sedici Alexi2 Womens Mesh Jacket',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/sedici_alexi2_womens_mesh_jacket_black_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Sedici Alexi2 Womens Mesh Jacket',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Silver',
        'category' => 'jackets',
        'image' => '/img/jackets/sedici_alexi2_womens_mesh_jacket_white_fuchsia_750x750.jpg'
    ],
    
    // Bilt Women's Jackets
    [
        'id' => 61,
        'name' => 'Bilt Techno2 Womens Jacket',
        'brand' => 'Bilt',
        'price' => 149.99,
        'color' => 'White/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/bilt_techno2_womens_jacket_white_black_750x750.jpg'
    ],
    [
        'id' => 62,
        'name' => 'Bilt Techno2 Womens Jacket',
        'brand' => 'Bilt',
        'price' => 149.99,
        'color' => 'Black/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/bilt_techno2_womens_jacket_black_black_750x750.jpg'
    ],
    
    // Speed and Strength Hoodies
    [
        'id' => 63,
        'name' => 'Speed and Strength Cat Outta Hell Armored Hoody',
        'brand' => 'Speed and Strength',
        'price' => 129.99,
        'color' => 'White/Grey',
        'category' => 'jackets',
        'image' => '/img/jackets/speedand_strength_cat_outta_hell_armored_hoody_white_grey_750x750.jpg'
    ],
    [
        'id' => 64,
        'name' => 'Speed and Strength Cat Outta Hell Armored Hoody',
        'brand' => 'Speed and Strength',
        'price' => 129.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/speedand_strength_cat_outta_hell_armored_hoody_black_750x750.jpg'
    ],
    [
        'id' => 65,
        'name' => 'Speed and Strength Cat Outta Hell Armored Hoody',
        'brand' => 'Speed and Strength',
        'price' => 129.99,
        'color' => 'Red/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/speedand_strength_cat_outta_hell_armored_hoody_red_black_750x750.jpg'
    ],
    
    // Alpinestars Women's Hoodies
    [
        'id' => 66,
        'name' => 'Alpinestars Stella Chrome V2 Hoody',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Blue/Purple',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_chrome_v2_hoody_blue_purple_750x750.jpg'
    ],
    [
        'id' => 67,
        'name' => 'Alpinestars Stella Chrome V2 Hoody',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_chrome_v2_hoody_black_white_750x750.jpg'
    ],
    [
        'id' => 68,
        'name' => 'Alpinestars Stella Chrome V2 Hoody',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Grey/Pink',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_chrome_v2_hoody_grey_pink_750x750.jpg'
    ],
    
    // Alpinestars Women's Jackets
    [
        'id' => 30,
        'name' => 'Alpinestars Stella Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_andes_air_drystar_jacket_black_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Alpinestars Stella Andes Air Drystar Jacket',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Ice Grey',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_andes_air_drystar_jacket_grey_750x750.jpg'
    ],
    
    [
        'id' => 69,
        'name' => 'Alpinestars Stella SMX Air Womens Jacket',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Black/Yellow/Pink',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_smx_air_womens_jacket_black_yellow_pink_750x750.jpg'
    ],
    [
        'id' => 70,
        'name' => 'Alpinestars Stella SMX Air Womens Jacket',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Black/White',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_smx_air_womens_jacket_750x750.jpg'
    ],
    
    // Knox Women's Armored Shirts
    [
        'id' => 71,
        'name' => 'Knox Urbane Pro MK3 Womens Armored Shirt',
        'brand' => 'Knox',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/knox_urbane_pro_mk3_womens_armored_shirt_black_750x750.jpg'
    ],
    [
        'id' => 72,
        'name' => 'Knox Urbane Pro MK3 Womens Armored Shirt',
        'brand' => 'Knox',
        'price' => 349.99,
        'color' => 'Copper/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/knox_urbane_pro_mk3_womens_armored_shirt_750x750.jpg'
    ],
    
    // Revit Women's Jackets
    [
        'id' => 32,
        'name' => 'Revit Sand 4 H2O Womens Jacket',
        'brand' => 'Revit',
        'price' => 269.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand4_h2_o_womens_jacket_black_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Revit Sand 4 H2O Womens Jacket',
        'brand' => 'Revit',
        'price' => 269.99,
        'color' => 'Silver',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand4_h2_o_womens_jacket_white_750x750.jpg'
    ],
    [
        'id' => 34,
        'name' => 'Revit Sand 4 H2O Womens Jacket',
        'brand' => 'Revit',
        'price' => 269.99,
        'color' => 'Camo Brown',
        'category' => 'jackets',
        'image' => '/img/jackets/revit_sand4_h2_o_womens_jacket_brown_750x750.jpg'
    ],
    
    // Additional Protective Jackets
    [
        'id' => 73,
        'name' => 'Alpinestars Bionic Plus V2 Jacket',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Black/Anthracite/Red',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_bionic_plus_v2_jacket_black_anthracite_red_750x750.jpg'
    ],
    
    // Bionic Action Protection
    [
        'id' => 74,
        'name' => 'Alpinestars Stella Bionic Action V2 Jacket',
        'brand' => 'Alpinestars',
        'price' => 279.99,
        'color' => 'Black/Cyan',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_stella_bionic_action_v2_jacket_black_cyan_750x750.jpg'
    ],
    [
        'id' => 75,
        'name' => 'Alpinestars Bionic Action V2 Protection Jacket',
        'brand' => 'Alpinestars',
        'price' => 259.99,
        'color' => 'Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_bionic_action_v2_protection_jacket_black_750x750.jpg'
    ],
    [
        'id' => 76,
        'name' => 'Alpinestars Bionic Action V2 Protection Jacket',
        'brand' => 'Alpinestars',
        'price' => 259.99,
        'color' => 'Grey/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_bionic_action_v2_protection_jacket_greyblack_750x750.jpg'
    ],
    [
        'id' => 77,
        'name' => 'Alpinestars Bionic Action V2 Protection Jacket',
        'brand' => 'Alpinestars',
        'price' => 259.99,
        'color' => 'Sand/Black',
        'category' => 'jackets',
        'image' => '/img/jackets/alpinestars_bionic_action_v2_protection_jacket_sandblack_750x750.jpg'
    ]
];

echo json_encode($jackets, JSON_PRETTY_PRINT);
?>