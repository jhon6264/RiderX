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
    [
        'id' => 10,
        'name' => 'Dainese Blackjack Gloves',
        'brand' => 'Dainese',
        'price' => 69.99,
        'color' => 'Brown',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0159/6393/dainese_blackjack_gloves_brown_750x750.jpg'
    ],
    
    // Reax Gloves
    [
        'id' => 11,
        'name' => 'Reax Tasker Air Womens Gloves',
        'brand' => 'Reax',
        'price' => 59.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1529/8709/reax_tasker_air_womens_gloves_black_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'Reax Superfly 2 Mesh Gloves',
        'brand' => 'Reax',
        'price' => 49.99,
        'color' => 'Green',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2220/7734/reax_superfly2_mesh_gloves_black_750x750.jpg'
    ],
    [
        'id' => 13,
        'name' => 'Reax Superfly 2 Mesh Gloves',
        'brand' => 'Reax',
        'price' => 49.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2220/7717/reax_superfly2_mesh_gloves_black_750x750.jpg'
    ],
    [
        'id' => 14,
        'name' => 'Reax Superfly 2 Mesh Gloves',
        'brand' => 'Reax',
        'price' => 49.99,
        'color' => 'Cement',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2220/7598/reax_superfly2_mesh_gloves_silver_750x750.jpg'
    ],
    
    // Revit Gloves
    [
        'id' => 15,
        'name' => 'Revit Hydra 2 H2O Gloves',
        'brand' => 'Revit',
        'price' => 99.99,
        'color' => 'Grey',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2361/3036/revit_hydra2_h2_o_gloves_750x750.jpg'
    ],
    [
        'id' => 16,
        'name' => 'Revit Hydra 2 H2O Gloves',
        'brand' => 'Revit',
        'price' => 99.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2361/3036/revit_hydra2_h2_o_gloves_750x750.jpg'
    ],
    [
        'id' => 17,
        'name' => 'Revit Quantum 3 Gloves',
        'brand' => 'Revit',
        'price' => 149.99,
        'color' => 'Neon Red/Blue',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2379/7733/revit_quantum3_gloves_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'Revit Quantum 3 Gloves',
        'brand' => 'Revit',
        'price' => 149.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2379/7699/revit_quantum3_gloves_750x750.jpg'
    ],
    [
        'id' => 19,
        'name' => 'Revit Quantum 3 Gloves',
        'brand' => 'Revit',
        'price' => 149.99,
        'color' => 'Grey/Neon Yellow',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2379/7665/revit_quantum3_gloves_750x750.jpg'
    ],
    [
        'id' => 20,
        'name' => 'Revit Quantum 3 Gloves',
        'brand' => 'Revit',
        'price' => 149.99,
        'color' => 'White/Neon Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2379/7631/revit_quantum3_gloves_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'Revit Metis 2 Gloves',
        'brand' => 'Revit',
        'price' => 89.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1938/8083/revit_metis2_gloves_750x750.jpg'
    ],
    [
        'id' => 22,
        'name' => 'Revit Metis 2 Gloves',
        'brand' => 'Revit',
        'price' => 89.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1938/8185/revit_metis2_gloves_750x750.jpg'
    ],
    [
        'id' => 23,
        'name' => 'Revit Metis 2 Gloves',
        'brand' => 'Revit',
        'price' => 89.99,
        'color' => 'Light Grey/Neon Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2379/6543/revit_metis2_gloves_light_grey_neon_red_750x750.jpg'
    ],
    [
        'id' => 24,
        'name' => 'Revit League 2 Gloves',
        'brand' => 'Revit',
        'price' => 79.99,
        'color' => 'Black/Grey',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1938/8338/revit_league2_gloves_750x750.jpg'
    ],
    [
        'id' => 25,
        'name' => 'Revit League 2 Gloves',
        'brand' => 'Revit',
        'price' => 79.99,
        'color' => 'Black/Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1938/8304/revit_league2_gloves_750x750.jpg'
    ],
    
    // Alpinestars Gloves
    [
        'id' => 26,
        'name' => 'Alpinestars SP-X Air Carbon V2 Gloves',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1022/6406/alpinestars_spx_air_carbonv2_gloves_black_750x750.jpg'
    ],
    [
        'id' => 27,
        'name' => 'Alpinestars SP-X Air Carbon V2 Gloves',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0904/9707/alpinestars_spx_air_carbonv2_gloves_black_white_750x750.jpg'
    ],
    [
        'id' => 28,
        'name' => 'Alpinestars SP-X Air Carbon V2 Gloves',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'Black/White/Fluo Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0904/9724/alpinestars_spx_air_carbonv2_gloves_black_white_fluo_red_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Alpinestars SP-X Air Carbon V2 Gloves',
        'brand' => 'Alpinestars',
        'price' => 129.99,
        'color' => 'White/Black/Bright Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0904/9741/alpinestars_spx_air_carbonv2_gloves_white_black_bright_red_750x750.jpg'
    ],
    [
        'id' => 30,
        'name' => 'Alpinestars GP Pro R3 Gloves',
        'brand' => 'Alpinestars',
        'price' => 199.99,
        'color' => 'Black/Fluo Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0904/9078/alpinestars_gp_pro_r3_gloves_black_white_bright_red_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Alpinestars GP Pro RS4 Gloves',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2326/9765/alpinestars_gp_pro_rs4_gloves_black_750x750.jpg'
    ],
    [
        'id' => 32,
        'name' => 'Alpinestars GP Pro RS4 Gloves',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2326/9714/alpinestars_gp_pro_rs4_gloves_black_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Alpinestars GP Pro RS4 Gloves',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black/Red/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2326/9799/alpinestars_gp_pro_rs4_gloves_black_750x750.jpg'
    ],
    
    // Roland Sands Gloves
    [
        'id' => 34,
        'name' => 'Roland Sands Caspian74 CE Womens Gloves',
        'brand' => 'Roland Sands',
        'price' => 89.99,
        'color' => 'Sapphire Leopard',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1789/8139/roland_sands_caspian74_ce_womens_gloves_leopard_750x750.jpg'
    ],
    [
        'id' => 35,
        'name' => 'Roland Sands Caspian74 CE Womens Gloves',
        'brand' => 'Roland Sands',
        'price' => 89.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1789/7913/roland_sands_caspian74_ce_womens_gloves_black_750x750.jpg'
    ],
    [
        'id' => 36,
        'name' => 'Roland Sands Caspian74 CE Womens Gloves',
        'brand' => 'Roland Sands',
        'price' => 89.99,
        'color' => 'Gravel',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1789/7947/roland_sands_caspian74_ce_womens_gloves_gravel_750x750.jpg'
    ],
    [
        'id' => 37,
        'name' => 'Roland Sands Caspian74 CE Womens Gloves',
        'brand' => 'Roland Sands',
        'price' => 89.99,
        'color' => 'Tigre',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1800/2372/roland_sands_caspian74_ce_womens_gloves_tigre_750x750.jpg'
    ],
    
    // Cortech Gloves
    [
        'id' => 38,
        'name' => 'Cortech Bully 2.0 Gloves',
        'brand' => 'Cortech',
        'price' => 69.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2236/6861/cortech_bully20_gloves_750x750.jpg'
    ],
    [
        'id' => 39,
        'name' => 'Cortech Bully 2.0 Gloves',
        'brand' => 'Cortech',
        'price' => 69.99,
        'color' => 'White/Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2236/6827/cortech_bully20_gloves_750x750.jpg'
    ],
    [
        'id' => 40,
        'name' => 'Cortech Bully 2.0 Gloves',
        'brand' => 'Cortech',
        'price' => 69.99,
        'color' => 'Tan/Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2236/6895/cortech_bully20_gloves_750x750.jpg'
    ],
    [
        'id' => 41,
        'name' => 'Cortech Bully 2.0 Gloves',
        'brand' => 'Cortech',
        'price' => 69.99,
        'color' => 'Tobacco/Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2236/6793/cortech_bully20_gloves_750x750.jpg'
    ],
    
    // Speed and Strength Gloves
    [
        'id' => 42,
        'name' => 'Speed and Strength Rust and Redemption Gloves',
        'brand' => 'Speed and Strength',
        'price' => 59.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0094/2010/speedand_strength_rustand_redemption_gloves_750x750.jpg'
    ],
    [
        'id' => 43,
        'name' => 'Speed and Strength Rust and Redemption Gloves',
        'brand' => 'Speed and Strength',
        'price' => 59.99,
        'color' => 'Brown',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0094/2018/speedand_strength_rustand_redemption_gloves_750x750.jpg'
    ],
    [
        'id' => 44,
        'name' => 'Speed and Strength Rust and Redemption Gloves',
        'brand' => 'Speed and Strength',
        'price' => 59.99,
        'color' => 'Olive',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0094/2026/speedand_strength_rustand_redemption_gloves_750x750.jpg'
    ],
    
    // Icon Gloves
    [
        'id' => 45,
        'name' => 'Icon Hypersport Short Gloves',
        'brand' => 'Icon',
        'price' => 79.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0905/5132/icon_hypersport_short_gloves_black_750x750.jpg'
    ],
    [
        'id' => 46,
        'name' => 'Icon Hypersport Short Gloves',
        'brand' => 'Icon',
        'price' => 79.99,
        'color' => 'White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0905/5268/icon_hypersport_short_gloves_white_750x750.jpg'
    ],
    [
        'id' => 47,
        'name' => 'Icon Hypersport Short Gloves',
        'brand' => 'Icon',
        'price' => 79.99,
        'color' => 'Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0905/5234/icon_hypersport_short_gloves_red_750x750.jpg'
    ],
    [
        'id' => 48,
        'name' => 'Icon Hypersport Short Gloves',
        'brand' => 'Icon',
        'price' => 79.99,
        'color' => 'Blue',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/0905/5200/icon_hypersport_short_gloves_blue_750x750.jpg'
    ],
    [
        'id' => 49,
        'name' => 'Icon Long Track CX Gloves',
        'brand' => 'Icon',
        'price' => 99.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2394/7385/icon_long_track_cx_gloves_750x750.jpg'
    ],
    [
        'id' => 50,
        'name' => 'Icon Long Track CX Gloves',
        'brand' => 'Icon',
        'price' => 99.99,
        'color' => 'Tan',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2394/7351/icon_long_track_cx_gloves_750x750.jpg'
    ],
    [
        'id' => 51,
        'name' => 'Icon Airform Slabtown Gloves',
        'brand' => 'Icon',
        'price' => 69.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2206/3373/icon_airform_slabtown_gloves_750x750.jpg'
    ],
    [
        'id' => 52,
        'name' => 'Icon Airform Slabtown Gloves',
        'brand' => 'Icon',
        'price' => 69.99,
        'color' => 'White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2206/3407/icon_airform_slabtown_gloves_750x750.jpg'
    ],
    [
        'id' => 53,
        'name' => 'Icon Airform Slabtown Gloves',
        'brand' => 'Icon',
        'price' => 69.99,
        'color' => 'Black/White Checkers',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2206/3441/icon_airform_slabtown_gloves_black_white_checkers_750x750.jpg'
    ],
    [
        'id' => 54,
        'name' => 'Icon Anthem 3 Gloves',
        'brand' => 'Icon',
        'price' => 59.99,
        'color' => 'Blue',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2394/7963/icon_anthem3_gloves_750x750.jpg'
    ],
    [
        'id' => 55,
        'name' => 'Icon Anthem 3 Gloves',
        'brand' => 'Icon',
        'price' => 59.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2394/7895/icon_anthem3_gloves_black_750x750.jpg'
    ],
    [
        'id' => 56,
        'name' => 'Icon Anthem 3 Gloves',
        'brand' => 'Icon',
        'price' => 59.99,
        'color' => 'Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2394/7929/icon_anthem3_gloves_750x750.jpg'
    ],
    
    // Knox Gloves
    [
        'id' => 57,
        'name' => 'Knox Handroid MK5 Gloves',
        'brand' => 'Knox',
        'price' => 229.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2076/7623/knox_handroid_mk5_gloves_black_750x750.jpg'
    ],
    [
        'id' => 58,
        'name' => 'Knox Handroid MK5 Gloves',
        'brand' => 'Knox',
        'price' => 229.99,
        'color' => 'Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2076/7725/knox_handroid_mk5_gloves_750x750.jpg'
    ],
    [
        'id' => 59,
        'name' => 'Knox Handroid MK5 Gloves',
        'brand' => 'Knox',
        'price' => 229.99,
        'color' => 'Black/Yellow',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2076/7691/knox_handroid_mk5_gloves_750x750.jpg'
    ],
    [
        'id' => 60,
        'name' => 'Knox Oulton MK2 Gloves',
        'brand' => 'Knox',
        'price' => 149.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2075/9361/knox_oulton_mk2_gloves_750x750.jpg'
    ],
    [
        'id' => 61,
        'name' => 'Knox Oulton MK2 Gloves',
        'brand' => 'Knox',
        'price' => 149.99,
        'color' => 'Black/Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2075/9395/knox_oulton_mk2_gloves_750x750.jpg'
    ],
    [
        'id' => 62,
        'name' => 'Knox Handroid Pod MK5 Gloves',
        'brand' => 'Knox',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2076/7759/knox_handroid_pod_mk5_gloves_black_750x750.jpg'
    ],
    [
        'id' => 63,
        'name' => 'Knox Handroid Pod MK5 Gloves',
        'brand' => 'Knox',
        'price' => 199.99,
        'color' => 'Black/Sand',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2513/4932/knox_handroid_pod_mk5_gloves_black_sand_750x750.jpg'
    ],
    
    // Sedici Gloves
    [
        'id' => 64,
        'name' => 'Sedici Misano 2 Gloves',
        'brand' => 'Sedici',
        'price' => 89.99,
        'color' => 'Black/White/Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2417/2061/sedici_misano2_gloves_750x750.jpg'
    ],
    [
        'id' => 65,
        'name' => 'Sedici Misano 2 Gloves',
        'brand' => 'Sedici',
        'price' => 89.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2417/9150/sedici_misano2_gloves_black_white_750x750.jpg'
    ],
    [
        'id' => 66,
        'name' => 'Sedici Misano 2 Gloves',
        'brand' => 'Sedici',
        'price' => 89.99,
        'color' => 'Black/Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2417/2078/sedici_misano2_gloves_750x750.jpg'
    ],
    [
        'id' => 67,
        'name' => 'Sedici Corsa 2 Gloves',
        'brand' => 'Sedici',
        'price' => 79.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2417/6260/sedici_corsa2_gloves_750x750.jpg'
    ],
    [
        'id' => 68,
        'name' => 'Sedici Corsa 2 Gloves',
        'brand' => 'Sedici',
        'price' => 79.99,
        'color' => 'Black/Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2417/6243/sedici_corsa2_gloves_750x750.jpg'
    ],
    [
        'id' => 69,
        'name' => 'Sedici Corsa 2 Gloves',
        'brand' => 'Sedici',
        'price' => 79.99,
        'color' => 'Black/White/Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2417/6277/sedici_corsa2_gloves_750x750.jpg'
    ],
    
    // Gerbing Heated Gloves
    [
        'id' => 70,
        'name' => 'Gerbing 12V Hero Heated Gloves',
        'brand' => 'Gerbing',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2505/4716/gerbing12_v_hero_heated_gloves_black_750x750.jpg'
    ],
    [
        'id' => 71,
        'name' => 'Gerbing 7V Heated Glove Liners',
        'brand' => 'Gerbing',
        'price' => 129.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2357/8431/gerbing7_v_heated_glove_liners_750x750.jpg'
    ],
    
    // FXR Heated Gloves
    [
        'id' => 72,
        'name' => 'FXR Heated Recon Glove',
        'brand' => 'FXR',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1482/0572/fxr_heated_recon_glove_black_750x750.jpg'
    ],
    
    // Fly Racing Heated Gloves
    [
        'id' => 73,
        'name' => 'Fly Racing Dirt Title Heated Gloves',
        'brand' => 'Fly Racing',
        'price' => 89.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1579/2581/fly_racing_dirt_title_heated_gloves_750x750.jpg'
    ],
    [
        'id' => 74,
        'name' => 'Fly Racing Dirt Title Heated Gloves',
        'brand' => 'Fly Racing',
        'price' => 89.99,
        'color' => 'Black/Grey',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/1579/2615/fly_racing_dirt_title_heated_gloves_750x750.jpg'
    ],
    
    // LS2 Gloves
    [
        'id' => 75,
        'name' => 'LS2 Swift Gloves',
        'brand' => 'LS2',
        'price' => 49.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2213/5708/ls2_swift_gloves_black_750x750.jpg'
    ],
    [
        'id' => 76,
        'name' => 'LS2 Swift Gloves',
        'brand' => 'LS2',
        'price' => 49.99,
        'color' => 'Black/Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2213/5742/ls2_swift_gloves_black_red_750x750.jpg'
    ],
    [
        'id' => 77,
        'name' => 'LS2 Swift Gloves',
        'brand' => 'LS2',
        'price' => 49.99,
        'color' => 'Black/Hi-Viz Yellow',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2213/5776/ls2_swift_gloves_black_hi_viz_yellow_750x750.jpg'
    ],
    
    // Spidi Gloves
    [
        'id' => 78,
        'name' => 'Spidi STR-6 Gloves',
        'brand' => 'Spidi',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2068/5536/spidi_str6_gloves_black_750x750.jpg'
    ],
    [
        'id' => 79,
        'name' => 'Spidi STR-6 Gloves',
        'brand' => 'Spidi',
        'price' => 159.99,
        'color' => 'Black/White',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2068/5587/spidi_str6_gloves_black_white_750x750.jpg'
    ],
    [
        'id' => 80,
        'name' => 'Spidi STR-6 Gloves',
        'brand' => 'Spidi',
        'price' => 159.99,
        'color' => 'Red',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2068/5638/spidi_str6_gloves_red_750x750.jpg'
    ],
    [
        'id' => 81,
        'name' => 'Spidi STR-6 Gloves',
        'brand' => 'Spidi',
        'price' => 159.99,
        'color' => 'Yellow',
        'category' => 'gloves',
        'image' => 'https://www.revzilla.com/product_images/2068/5689/spidi_str6_gloves_yellow_750x750.jpg'
    ]
];

echo json_encode($gloves, JSON_PRETTY_PRINT);
?>