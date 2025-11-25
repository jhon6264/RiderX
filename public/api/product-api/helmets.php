<?php
// api/helmets.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
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
        'image' => '/img/helmets/arai_regent_x_helmet_black_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_regent_x_helmet_white_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_regent_x_helmet_grey_750x750.jpg'
    ],
    [
        'id' => 4,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_regent_x_helmet_red_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Arai Regent-X Helmet',
        'brand' => 'Arai',
        'price' => 699.99,
        'color' => 'Ivory',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_regent_x_helmet_modern_ivory_750x750.jpg'
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
        'image' => '/img/helmets/sedici_strada3_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'Glossy Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/sedici_strada3_helmet_black_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/sedici_strada3_helmet_white_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Sedici Strada 3 Helmet',
        'brand' => 'Sedici',
        'price' => 299.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/sedici_strada3_helmet_grey_750x750.jpg'
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
        'image' => '/img/helmets/nexx_xwst3_zero_pro_carbon_glaze_edition_helmet_glaze_carbon_ice_blue_750x750.jpg'
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
        'image' => '/img/helmets/alpinestars_supertech_r10_carbon_helmet_white_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'Alpinestars Supertech R10 Carbon Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Black Carbon',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_r10_carbon_helmet_black_carbon_480x480.jpg'
    ],
    // New Alpinestars Supertech R10 Carbon variants
    [
        'id' => 53,
        'name' => 'Alpinestars Supertech R10 Carbon Team Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Matte Black Carbon/Fluo Red/Blue/White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_r10_carbon_team_helmet_black_carbon_red_fluo_matte_blue_white_750x750.jpg'
    ],
    [
        'id' => 54,
        'name' => 'Alpinestars Supertech R10 Carbon Team Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Gloss Black Carbon/Red/White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_r10_carbon_team_helmet_black_carbon_red_white_750x750.jpg'
    ],
    [
        'id' => 55,
        'name' => 'Alpinestars Supertech R10 Carbon Element Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Gloss Black Carbon/Silver',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_r10_carbon_element_helmet_gloss_black_carbon_silver_750x750.jpg'
    ],
    [
        'id' => 56,
        'name' => 'Alpinestars Supertech R10 Carbon Element Helmet',
        'brand' => 'Alpinestars',
        'price' => 849.99,
        'color' => 'Gloss Black Carbon/Bright Red/White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_r10_carbon_element_helmet_gloss_black_carbon_bright_red_white_750x750.jpg'
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
        'image' => '/img/helmets/scorpion_exor1_air_carbon_onyx_helmet_black_camo_750x750.jpg'
    ],
    // New Scorpion Full Face variants
    [
        'id' => 57,
        'name' => 'Scorpion EXO-R1 Air Carbon Helmet',
        'brand' => 'Scorpion',
        'price' => 599.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exor1_air_carbon_onyx_helmet_black_dark_750x750.jpg'
    ],
    [
        'id' => 58,
        'name' => 'Scorpion EXO-R1 Air Carbon Helmet',
        'brand' => 'Scorpion',
        'price' => 599.99,
        'color' => 'Gloss Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exor1_air_carbon_helmet_braided_750x750.jpg'
    ],
    [
        'id' => 59,
        'name' => 'Scorpion EXO-R1 Air Carbon Helmet',
        'brand' => 'Scorpion',
        'price' => 599.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exor1_air_carbon_helmet_lightbraid_750x750.jpg'
    ],
    [
        'id' => 60,
        'name' => 'Scorpion EXO-R1 Air Carbon Helmet',
        'brand' => 'Scorpion',
        'price' => 599.99,
        'color' => 'Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exo_exo_r1_air_full_face_helmet_blue_750x750.jpg'
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
        'image' => '/img/helmets/agvk1_s_sling_helmet_black_pink_750x750.jpg'
    ],
    [
        'id' => 15,
        'name' => 'AGV K1-S Sling Helmet',
        'brand' => 'AGV',
        'price' => 349.99,
        'color' => 'Matte Black Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/agvk1_s_sling_helmet_matte_black_red_750x750.jpg'
    ],
    [
        'id' => 16,
        'name' => 'AGV K1-S Fastlap Helmet',
        'brand' => 'AGV',
        'price' => 399.99,
        'color' => 'Black Grey Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/agvk1_s_fastlap_helmet_black_grey_red_750x750.jpg'
    ],
    [
        'id' => 17,
        'name' => 'AGV K1-S Fastlap Helmet',
        'brand' => 'AGV',
        'price' => 399.99,
        'color' => 'Black Purple Pink',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/agvk1_s_fastlap_helmet_black_purple_pink_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'AGV K1-S Fastlap Helmet',
        'brand' => 'AGV',
        'price' => 399.99,
        'color' => 'Black Red Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/agvk1_s_fastlap_helmet_black_red_blue_750x750.jpg'
    ],
    
    // New Scorpion Full Face Helmets
    [
        'id' => 61,
        'name' => 'Scorpion EXO Eclipse Helmet',
        'brand' => 'Scorpion',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exo_eclipse_helmet_black_750x750.jpg'
    ],
    [
        'id' => 62,
        'name' => 'Scorpion EXO Eclipse Helmet',
        'brand' => 'Scorpion',
        'price' => 199.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exo_eclipse_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 63,
        'name' => 'Scorpion EXO Eclipse Helmet',
        'brand' => 'Scorpion',
        'price' => 199.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exo_eclipse_helmet_750x750.jpg'
    ],
    
    [
        'id' => 64,
        'name' => 'Scorpion EXO-ST1400 Evo Hex Helmet',
        'brand' => 'Scorpion',
        'price' => 349.99,
        'color' => 'Black/Blue/Hi-Viz Yellow',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exost1400_evo_hex_helmet_blue_750x750.jpg'
    ],
    [
        'id' => 65,
        'name' => 'Scorpion EXO-ST1400 Evo Hex Helmet',
        'brand' => 'Scorpion',
        'price' => 349.99,
        'color' => 'Black/Matte Blue/White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exost1400_evo_hex_helmet_reda_750x750.jpg'
    ],
    [
        'id' => 66,
        'name' => 'Scorpion EXO-ST1400 Evo Hex Helmet',
        'brand' => 'Scorpion',
        'price' => 349.99,
        'color' => 'Matte Grey/Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exost1400_evo_hex_helmet_redq_750x750.jpg'
    ],
    [
        'id' => 67,
        'name' => 'Scorpion EXO-ST1400 Evo Hex Helmet',
        'brand' => 'Scorpion',
        'price' => 349.99,
        'color' => 'Black/Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/scorpion_exost1400_evo_hex_helmet_red_750x750.jpg'
    ],
    
    // New Alpinestars Full Face Helmets
    [
        'id' => 68,
        'name' => 'Alpinestars SM5 Helmet',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_sm5_helmet_black_750x750.jpg'
    ],
    [
        'id' => 69,
        'name' => 'Alpinestars SM5 Helmet',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Gloss White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_sm5_helmet_750x750.jpg'
    ],
    
    [
        'id' => 70,
        'name' => 'Alpinestars Supertech M3 Helmet',
        'brand' => 'Alpinestars',
        'price' => 449.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_m3_helmet_black_750x750.jpg'
    ],
    [
        'id' => 71,
        'name' => 'Alpinestars Supertech M3 Helmet',
        'brand' => 'Alpinestars',
        'price' => 449.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_m3_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 72,
        'name' => 'Alpinestars Supertech M3 Helmet',
        'brand' => 'Alpinestars',
        'price' => 449.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/alpinestars_supertech_m3_helmet_white_750x750.jpg'
    ],
    
    // Adventure/Dual Sport Helmets
    [
        'id' => 73,
        'name' => 'Arai XD5 Trail Helmet',
        'brand' => 'Arai',
        'price' => 749.99,
        'color' => 'Yellow',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_xd5_trail_helmet_yellow_750x750.jpg'
    ],
    [
        'id' => 74,
        'name' => 'Arai XD5 Trail Helmet',
        'brand' => 'Arai',
        'price' => 749.99,
        'color' => 'Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_xd5_trail_helmet_blue_750x750.jpg'
    ],
    [
        'id' => 75,
        'name' => 'Arai XD5 Discovery Helmet',
        'brand' => 'Arai',
        'price' => 749.99,
        'color' => 'Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/arai_xd5_discovery_helmet_750x750.jpg'
    ],
    
    [
        'id' => 76,
        'name' => 'Shoei Hornet X2 Invigorate Helmet',
        'brand' => 'Shoei',
        'price' => 699.99,
        'color' => 'Black/Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/shoei_hornet_x2_invigorate_helmet_blue_750x750.jpg'
    ],
    [
        'id' => 77,
        'name' => 'Shoei Hornet X2 Invigorate Helmet',
        'brand' => 'Shoei',
        'price' => 699.99,
        'color' => 'Black/Green',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/shoei_hornet_x2_invigorate_helmet_green_750x750.jpg'
    ],
    [
        'id' => 78,
        'name' => 'Shoei Hornet X2 Invigorate Helmet',
        'brand' => 'Shoei',
        'price' => 699.99,
        'color' => 'White/Pink/Purple',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/shoei_hornet_x2_invigorate_helmet_white_750x750.jpg'
    ],
    [
        'id' => 79,
        'name' => 'Shoei Hornet X2 Invigorate Helmet',
        'brand' => 'Shoei',
        'price' => 699.99,
        'color' => 'White/Red/Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/shoei_hornet_x2_invigorate_helmet_hehe_750x750.jpg'
    ],
    
    // New Nexx Adventure Helmets
    [
        'id' => 80,
        'name' => 'Nexx X.WED3 Keyo Carbon Helmet',
        'brand' => 'Nexx',
        'price' => 649.99,
        'color' => 'Matte White/Hi-Viz Yellow',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/nexx_xwed3_keyo_carbon_helmet_matte_white_hi_viz_750x750.jpg'
    ],
    [
        'id' => 81,
        'name' => 'Nexx X.WED3 Keyo Carbon Helmet',
        'brand' => 'Nexx',
        'price' => 649.99,
        'color' => 'Matte Blue/Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/nexx_xwed3_keyo_carbon_helmet_matte_blue_red_750x750.jpg'
    ],
    [
        'id' => 82,
        'name' => 'Nexx X.WED3 Keyo Carbon Helmet',
        'brand' => 'Nexx',
        'price' => 649.99,
        'color' => 'Matte Green/Silver',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/nexx_xwed3_keyo_carbon_helmet_matte_green_silver_750x750.jpg'
    ],
    [
        'id' => 83,
        'name' => 'Nexx X.WED3 Keyo Carbon Helmet',
        'brand' => 'Nexx',
        'price' => 649.99,
        'color' => 'Matte Grey/Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/nexx_xwed3_keyo_carbon_helmet_matte_grey_red_750x750.jpg'
    ],
    [
        'id' => 84,
        'name' => 'Nexx X.WED3 Keyo Carbon Helmet',
        'brand' => 'Nexx',
        'price' => 649.99,
        'color' => 'Matte White/Orange',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/nexx_xwed3_keyo_carbon_helmet_matte_white_orange_750x750.jpg'
    ],
    
    // Klim Adventure Helmets
    [
        'id' => 85,
        'name' => 'Klim X1 Alpha Concept Helmet',
        'brand' => 'Klim',
        'price' => 799.99,
        'color' => 'Gloss Petrol/Strike Orange',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_x1_alpha_concept_helmet_gloss_petrol_strike_orange_750x750.jpg'
    ],
    [
        'id' => 86,
        'name' => 'Klim X1 Alpha Concept Helmet',
        'brand' => 'Klim',
        'price' => 799.99,
        'color' => 'Gloss High Rise/Electric Blue Lemonade',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_x1_alpha_concept_helmet_gloss_high_rise_electric_blue_lemonade_750x750.jpg'
    ],
    [
        'id' => 87,
        'name' => 'Klim X1 Alpha Concept Helmet',
        'brand' => 'Klim',
        'price' => 799.99,
        'color' => 'Chrome/Gunmetal Black',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_x1_alpha_patriot_helmet_750x750.jpg'
    ],
    
    [
        'id' => 88,
        'name' => 'Klim Krios Pro Ventura Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Electric Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_ventura_helmet_electric_blue_750x750.jpg'
    ],
    [
        'id' => 89,
        'name' => 'Klim Krios Pro Ventura Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Olive',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_ventura_helmet_olive_750x750.jpg'
    ],
    [
        'id' => 90,
        'name' => 'Klim Krios Pro Rally Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Striking Orange',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_rally_helmet_bronzewer_750x750.jpg'
    ],
    [
        'id' => 91,
        'name' => 'Klim Krios Pro Rally Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Bronze',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_rally_helmet_bronze_750x750.jpg'
    ],
    
    [
        'id' => 92,
        'name' => 'Klim Krios Karbon Helmet',
        'brand' => 'Klim',
        'price' => 749.99,
        'color' => 'Carbon',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_karbon_helmet_750x750.jpg'
    ],
    [
        'id' => 93,
        'name' => 'Klim Krios Pro Spectrum Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Black/Fiery Red',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_spectrum_helmet_black_fiery_red_750x750.jpg'
    ],
    [
        'id' => 94,
        'name' => 'Klim Krios Pro Spectrum Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'White/Blue',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_spectrum_helmet_white_blue_750x750.jpg'
    ],
    [
        'id' => 95,
        'name' => 'Klim Krios Pro Charger Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_charger_helmet_grey_750x750.jpg'
    ],
    [
        'id' => 96,
        'name' => 'Klim Krios Pro Charger Helmet',
        'brand' => 'Klim',
        'price' => 699.99,
        'color' => 'Hi-Viz Yellow/Black/Grey',
        'category' => 'helmets',
        'type' => 'full-face',
        'image' => '/img/helmets/klim_krios_pro_charger_helmet_hi_viz_750x750.jpg'
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
        'image' => '/img/helmets/sedici_sistema3_helmetqw_750x750.jpg'
    ],
    [
        'id' => 20,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/sedici_sistema3_helmetssa_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/sedici_sistema3_helmesact_750x750.jpg'
    ],
    [
        'id' => 22,
        'name' => 'Sedici Sistema 3 Modular Helmet',
        'brand' => 'Sedici',
        'price' => 349.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/sedici_sistema3_helsccacasmet_750x750.jpg'
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
        'image' => '/img/helmets/ls2_helmets_advant_x_solid_helcascasmet_750x750.jpg'
    ],
    [
        'id' => 24,
        'name' => 'LS2 Advant X Solid Modular Helmet',
        'brand' => 'LS2',
        'price' => 279.99,
        'color' => 'Gloss White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/ls2_helmets_advacascnt_x_solid_helmet_750x750.jpg'
    ],
    [
        'id' => 25,
        'name' => 'LS2 Advant X Solid Modular Helmet',
        'brand' => 'LS2',
        'price' => 279.99,
        'color' => 'Matte Titanium',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/ls2_advant_x_solid_helmet_matte_titaniuascascm_750x750.jpg'
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
        'image' => '/img/helmets/sedici_pro_modular_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 27,
        'name' => 'Sedici Pro Modular Helmet',
        'brand' => 'Sedici',
        'price' => 449.99,
        'color' => 'Matte White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/sedici_pro_modular_helmet_white_750x750.jpg'
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
        'image' => '/img/helmets/schuberth_c5_master_helmasdaset_grey_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'White Red',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_master_helmet_blue_white_red_750x750.jpg'
    ],
    [
        'id' => 30,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'White Orange',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_master_helmet_black_white_orange_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Schuberth C5 Master Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 799.99,
        'color' => 'Grey Yellow',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_master_helmet_grey_yellow_750x750.jpg'
    ],
    [
        'id' => 32,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'Gloss Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_helmet_gloss_black_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 34,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_helmet_white_750x750.jpg'
    ],
    [
        'id' => 35,
        'name' => 'Schuberth C5 Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 749.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_c5_helmet_grey_750x750.jpg'
    ],
    
    // New Schuberth S3 Apex Modular
    [
        'id' => 97,
        'name' => 'Schuberth S3 Apex Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 699.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_s3_apex_helmet_grey_750x750.jpg'
    ],
    [
        'id' => 98,
        'name' => 'Schuberth S3 Apex Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 699.99,
        'color' => 'White/Red',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_s3_apex_helmet_white_750x750.jpg'
    ],
    [
        'id' => 99,
        'name' => 'Schuberth S3 Apex Modular Helmet',
        'brand' => 'Schuberth',
        'price' => 699.99,
        'color' => 'Anthracite/Red',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/schuberth_s3_apex_helmet_anthracite_750x750.jpg'
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
        'image' => '/img/helmets/shoei_neotec3_hascacaelmet_750x750.jpg'
    ],
    [
        'id' => 37,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/shoei_neotec3_helmeadasdasadast_750x750.jpg'
    ],
    [
        'id' => 38,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/shoei_neotsadec3_helmasdaset_750x750.jpg'
    ],
    [
        'id' => 39,
        'name' => 'Shoei Neotec 3 Modular Helmet',
        'brand' => 'Shoei',
        'price' => 849.99,
        'color' => 'Matte Deep Gray',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/shoei_neotec3_helmet_750x750.jpg'
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
        'image' => '/img/helmets/sedici_sistema3_parlare_helmet_black_750x750.jpg'
    ],
    [
        'id' => 41,
        'name' => 'Sedici Sistema 3 Parlare Modular Helmet',
        'brand' => 'Sedici',
        'price' => 399.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'modular',
        'image' => '/img/helmets/sedici_sistema3_parlare_helmet_matte_black_750x750.jpg'
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
        'image' => '/img/helmets/schuberth_c5_carbon_helmet_gloss_carbon_750x750.jpg'
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
        'image' => '/img/helmets/arai_classic_v_heasdawqewqlmet_750x750.jpg'
    ],
    [
        'id' => 44,
        'name' => 'Arai Classic V Open Face Helmet',
        'brand' => 'Arai',
        'price' => 599.99,
        'color' => 'Copper Frost',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => '/img/helmets/arai_classic_v_helmeasdsaa_750x750.jpg'
    ],
    [
        'id' => 45,
        'name' => 'Arai Classic V Open Face Helmet',
        'brand' => 'Arai',
        'price' => 599.99,
        'color' => 'White',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => '/img/helmets/arai_classic_v_helmedasdt_750x750.jpg'
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
        'image' => '/img/helmets/custom_bilt_jet_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 47,
        'name' => 'Bilt Jet Open Face Helmet',
        'brand' => 'Bilt',
        'price' => 149.99,
        'color' => 'Pearl Gray',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => '/img/helmets/custom_bilt_jet_helmet_pearl_white_750x750.jpg'
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
        'image' => '/img/helmets/scorpion_covert_x_helmet_black_750x750.jpg'
    ],
    [
        'id' => 49,
        'name' => 'Scorpion Covert X Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 249.99,
        'color' => 'Matte Black',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => '/img/helmets/scorpion_covert_x_helmet_matte_black_750x750.jpg'
    ],
    [
        'id' => 50,
        'name' => 'Scorpion Covert X Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 249.99,
        'color' => 'Grey',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => '/img/helmets/scorpion_covert_x_helmet_grey_750x750.jpg'
    ],
    [
        'id' => 51,
        'name' => 'Scorpion Covert X Marauder Open Face Helmet',
        'brand' => 'Scorpion',
        'price' => 279.99,
        'color' => 'Marauder Design',
        'category' => 'helmets',
        'type' => 'open-face',
        'image' => '/img/helmets/scorpion_covert_x_marauder_helmet_750x750.jpg'
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
        'image' => '/img/helmets/bell_rogue_helmet_750x750.jpg'
    ]
];

echo json_encode($helmets, JSON_PRETTY_PRINT);
?>