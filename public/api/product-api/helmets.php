<?php
// api/helmets.php

// Include security configuration
require_once 'config/security.php';

$helmets = [
    // ========================
    // FULL FACE HELMETS
    // ========================
    
    // Arai Full Face
    [
        'id' => 1,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2337/4594/arai_regent_x_helmet_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2337/4628/arai_regent_x_helmet_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2337/4662/arai_regent_x_helmet_750x750.jpg'
    ],
    [
        'id' => 4,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2337/4730/arai_regent_x_helmet_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Ivory',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2337/4781/arai_regent_x_helmet_modern_ivory_750x750.jpg'
    ],
    
    // Sedici Full Face
    [
        'id' => 6,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2224/7993/sedici_strada3_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'Glossy Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2224/8078/sedici_strada3_helmet_black_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2224/8095/sedici_strada3_helmet_white_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2224/8112/sedici_strada3_helmet_grey_750x750.jpg'
    ],
    
    // Nexx Full Face
    [
        'id' => 10,
        'name' => 'Nexx X.WST3 Zero Pro Carbon Helmet',
        'brand' => 'Nexx',
        'price' => 799.99,
        'color' => 'Glaze Carbon Ice Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2493/4180/nexx_xwst3_zero_pro_carbon_glaze_edition_helmet_glaze_carbon_ice_blue_750x750.jpg'
    ],
    
    // Alpinestars Full Face
    [
        'id' => 11,
        'name' => 'Alpinestars Supertech R10 Carbon Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2225/7292/alpinestars_supertech_r10_carbon_helmet_white_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'Alpinestars Supertech R10 Carbon Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Black Carbon',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2209/1032/alpinestars_supertech_r10_carbon_helmet_black_carbon_480x480.jpg'
    ],
    
    // Scorpion Full Face
    [
        'id' => 13,
        'name' => 'Scorpion EXO-R1 Air Carbon Helmet',
        'brand' => 'Scorpion',
        'price' => 599.99,
        'color' => 'Black Onyx',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2475/0804/scorpion_exor1_air_carbon_onyx_helmet_black_750x750.jpg'
    ],
    
    // AGV Full Face
    [
        'id' => 14,
        'name' => 'AGV K1-S Sling Helmet',
        'brand' => 'AGV',
        'price' => 349.99,
        'color' => 'Black Pink',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2477/7392/agvk1_s_sling_helmet_black_pink_750x750.jpg'
    ],
    [
        'id' => 15,
        'name' => 'AGV K1-S Sling Helmet',
        'brand' => 'AGV',
        'price' => 349.99,
        'color' => 'Matte Black Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2250/8281/agvk1_s_sling_helmet_matte_black_red_750x750.jpg'
    ],
    [
        'id' => 16,
        'name' => 'AGV K1-S Fastlap Helmet',
        'brand' => 'AGV',
        'price' => 399.99,
        'color' => 'Black Grey Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2370/6218/agvk1_s_fastlap_helmet_black_grey_red_750x750.jpg'
    ],
    [
        'id' => 17,
        'name' => 'AGV K1-S Fastlap Helmet',
        'brand' => 'AGV',
        'price' => 399.99,
        'color' => 'Black Purple Pink',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2370/5963/agvk1_s_fastlap_helmet_black_purple_pink_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'AGV K1-S Fastlap Helmet',
        'brand' => 'AGV',
        'price' => 399.99,
        'color' => 'Black Red Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => 'https://www.revzilla.com/product_images/2405/2083/agvk1_s_fastlap_helmet_black_red_blue_750x750.jpg'
    ],
    
    // ========================
    // MODULAR HELMETS
    // ========================
    
    // Sedici Modular
    [
        'id' => 19,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2394/6620/sedici_sistema3_helmet_750x750.jpg'
    ],
    [
        'id' => 20,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2394/6586/sedici_sistema3_helmet_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2394/6603/sedici_sistema3_helmet_750x750.jpg'
    ],
    [
        'id' => 22,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2394/6654/sedici_sistema3_helmet_750x750.jpg'
    ],
    
    // LS2 Modular
    [
        'id' => 23,
        'name' => 'LS2 Advant X Solid Modular Helmet',
        'brand' => 'LS2',
        'price' => 279.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2105/7520/ls2_helmets_advant_x_solid_helmet_750x750.jpg'
    ],
    [
        'id' => 24,
        'name' => 'LS2 Advant X Solid Modular Helmet',
        'brand' => 'LS2',
        'price' => 279.99,
        'color' => 'Gloss White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2105/7503/ls2_helmets_advant_x_solid_helmet_750x750.jpg'
    ],
    [
        'id' => 25,
        'name' => 'LS2 Advant X Solid Modular Helmet',
        'brand' => 'LS2',
        'price' => 279.99,
        'color' => 'Matte Titanium',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2405/5465/ls2_advant_x_solid_helmet_matte_titanium_750x750.jpg'
    ],
    
    // Sedici Pro Modular
    [
        'id' => 26,
        'name' => 'Sedici Pro Modular Helmet',
        'brand' => 'Sedici',
        'price' => 449.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2431/3526/sedici_pro_modular_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 27,
        'name' => 'Sedici Pro Modular Helmet',
        'brand' => 'Sedici',
        'price' => 449.99,
        'color' => 'Matte White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2431/3441/sedici_pro_modular_helmet_white_750x750.jpg'
    ],
    
    // Schuberth Modular
    [
        'id' => 28,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1918/4784/schuberth_c5_master_helmet_grey_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'White Red',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1836/6209/schuberth_c5_master_helmet_blue_white_red_750x750.jpg'
    ],
    [
        'id' => 30,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'White Orange',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1836/6311/schuberth_c5_master_helmet_black_white_orange_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'Grey Yellow',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1836/6090/schuberth_c5_master_helmet_grey_yellow_750x750.jpg'
    ],
    [
        'id' => 32,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'Gloss Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2436/6792/schuberth_c5_helmet_gloss_black_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1836/5546/schuberth_c5_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 34,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1836/5393/schuberth_c5_helmet_white_750x750.jpg'
    ],
    [
        'id' => 35,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/1836/5699/schuberth_c5_helmet_grey_750x750.jpg'
    ],
    
    // Shoei Modular
    [
        'id' => 36,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2243/9314/shoei_neotec3_helmet_750x750.jpg'
    ],
    [
        'id' => 37,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2243/9059/shoei_neotec3_helmet_750x750.jpg'
    ],
    [
        'id' => 38,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2243/9110/shoei_neotec3_helmet_750x750.jpg'
    ],
    [
        'id' => 39,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'Matte Deep Gray',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2243/9042/shoei_neotec3_helmet_750x750.jpg'
    ],
    
    // Sedici Sistema 3 Parlare
    [
        'id' => 40,
        'name' => 'Sedici Sistema 3 Parlare Modular Helmet',
        'brand' => 'Sedici',
        'price' => 399.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2394/6875/sedici_sistema3_parlare_helmet_black_750x750.jpg'
    ],
    [
        'id' => 41,
        'name' => 'Sedici Sistema 3 Parlare Modular Helmet',
        'brand' => 'Sedici',
        'price' => 399.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2394/6722/sedici_sistema3_parlare_helmet_matte_black_750x750.jpg'
    ],
    
    // Schuberth Carbon Modular
    [
        'id' => 42,
        'name' => 'Schuberth C5 Carbon Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 899.99,
        'color' => 'Gloss Carbon',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => 'https://www.revzilla.com/product_images/2221/7696/schuberth_c5_carbon_helmet_gloss_carbon_750x750.jpg'
    ],
    
    // ========================
    // OPEN FACE HELMETS
    // ========================
    
    // Arai Open Face
    [
        'id' => 43,
        'name' => 'Arai Classic V Open Face Helmet',
        'brand' => 'Arai',
        'price' => 599.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/1361/7154/arai_classic_v_helmet_750x750.jpg'
    ],
    [
        'id' => 44,
        'name' => 'Arai Classic V Open Face Helmet',
        'brand' => 'Arai',
        'price' => 599.99,
        'color' => 'Copper Frost',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/1361/7222/arai_classic_v_helmet_750x750.jpg'
    ],
    [
        'id' => 45,
        'name' => 'Arai Classic V Open Face Helmet',
        'brand' => 'Arai',
        'price' => 599.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/1361/7188/arai_classic_v_helmet_750x750.jpg'
    ],
    
    // Bilt Open Face
    [
        'id' => 46,
        'name' => 'Bilt Jet Open Face Helmet',
        'brand' => 'Bilt',
        'price' => 149.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/0190/3762/custom_bilt_jet_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 47,
        'name' => 'Bilt Jet Open Face Helmet',
        'brand' => 'Bilt',
        'price' => 149.99,
        'color' => 'Pearl Gray',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/0190/3770/custom_bilt_jet_helmet_pearl_white_750x750.jpg'
    ],
    
    // Scorpion Open Face
    [
        'id' => 48,
        'name' => 'Scorpion Covert X Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 249.99,
        'color' => 'Gloss Black',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/2422/6972/scorpion_covert_x_helmet_black_750x750.jpg'
    ],
    [
        'id' => 49,
        'name' => 'Scorpion Covert X Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 249.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/2422/7006/scorpion_covert_x_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 50,
        'name' => 'Scorpion Covert X Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 249.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/2422/7125/scorpion_covert_x_helmet_grey_750x750.jpg'
    ],
    [
        'id' => 51,
        'name' => 'Scorpion Covert X Marauder Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 279.99,
        'color' => 'Marauder Design',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/2422/7227/scorpion_covert_x_marauder_helmet_750x750.jpg'
    ],
    
    // Bell Open Face
    [
        'id' => 52,
        'name' => 'Bell Rogue Open Face Helmet',
        'brand' => 'Bell',
        'price' => 329.99,
        'color' => 'Classic Design',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => 'https://www.revzilla.com/product_images/0344/5278/bell_rogue_helmet_750x750.jpg'
    ]
];

echo json_encode($helmets, JSON_PRETTY_PRINT);
?>