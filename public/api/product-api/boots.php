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
        'image' => '/img/boots/reax_katana_riding_shoes_blaasdasdask_750x750.jpg'
    ],
    [
        'id' => 2,
        'name' => 'Reax Fulton WP Riding Shoes',
        'brand' => 'Reax',
        'price' => 119.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/reax_fulton_wp_riding_shoscascaes_750x750.jpg'
    ],
    [
        'id' => 3,
        'name' => 'Reax Fulton WP Riding Shoes',
        'brand' => 'Reax',
        'price' => 119.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => '/img/boots/reax_fulton_wp_riding_shasdases_750x750.jpg'
    ],
    
    // Dainese Boots
    [
        'id' => 4,
        'name' => 'Dainese Seeker Gore-Tex Boots',
        'brand' => 'Dainese',
        'price' => 299.99,
        'color' => 'Black/Army Green',
        'category' => 'boots',
        'image' => '/img/boots/dainese_seeker_gore_tex_boots_bsaasdack_army_green_750x750.jpg'
    ],
    [
        'id' => 5,
        'name' => 'Dainese Nexus 2 Boots',
        'brand' => 'Dainese',
        'price' => 249.99,
        'color' => 'Red',
        'category' => 'boots',
        'image' => '/img/boots/dainese_nexus2_boots_resadasdd_750x750.jpg'
    ],
    [
        'id' => 6,
        'name' => 'Dainese Nexus 2 Air Boots',
        'brand' => 'Dainese',
        'price' => 269.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/dainese_nexus2_air_boots_blackasdasd_750x750.jpg'
    ],
    [
        'id' => 7,
        'name' => 'Dainese Nexus 2 Air Boots',
        'brand' => 'Dainese',
        'price' => 269.99,
        'color' => 'Black/White/Lava Red',
        'category' => 'boots',
        'image' => '/img/boots/dainese_nexus2_air_boots_black_white_lava_red_750x750.jpg'
    ],
    [
        'id' => 8,
        'name' => 'Dainese Superya Shoes',
        'brand' => 'Dainese',
        'price' => 179.99,
        'color' => 'Black/Anthracite',
        'category' => 'boots',
        'image' => '/img/boots/dainese_superya_shoesdss_750x750.jpg'
    ],
    [
        'id' => 9,
        'name' => 'Dainese Superya Shoes',
        'brand' => 'Dainese',
        'price' => 179.99,
        'color' => 'Black/Red',
        'category' => 'boots',
        'image' => '/img/boots/dainese_superya_shoess_750x750.jpg'
    ],
    
    // TCX Boots
    [
        'id' => 10,
        'name' => 'TCX Comp Evo Michelin Boots',
        'brand' => 'TCX',
        'price' => 279.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/tcx_comp_evo_michelin_boots_black_750x750.jpg'
    ],
    [
        'id' => 11,
        'name' => 'TCX Comp Evo 2 Michelin Boots',
        'brand' => 'TCX',
        'price' => 289.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => '/img/boots/tcx_comp_evo2_michelin_boots_black_grey_camo_750x750.jpg'
    ],
    [
        'id' => 12,
        'name' => 'TCX Comp Evo 2 Michelin Boots',
        'brand' => 'TCX',
        'price' => 289.99,
        'color' => 'White',
        'category' => 'boots',
        'image' => '/img/boots/tcx_comp_evo2_michelin_boots_black_white_750x750.jpg'
    ],
    [
        'id' => 13,
        'name' => 'TCX R04 D Air Womens Boots',
        'brand' => 'TCX',
        'price' => 199.99,
        'color' => 'Black/White',
        'category' => 'boots',
        'image' => '/img/boots/tcxr04_d_air_womens_boots_black_white_750x750.jpg'
    ],
    [
        'id' => 14,
        'name' => 'TCX Mood 2 Gore-Tex Boots',
        'brand' => 'TCX',
        'price' => 229.99,
        'color' => 'Green/Black/Yellow',
        'category' => 'boots',
        'image' => '/img/boots/tcx_mood2_gore_tex_boots_green_black_yellow_750x750.jpg'
    ],
    [
        'id' => 15,
        'name' => 'TCX Infinity Mid WP Boots',
        'brand' => 'TCX',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/tcx_infinity_mid_wp_boots_black_750x750.jpg'
    ],
    [
        'id' => 16,
        'name' => 'TCX Infinity Mid WP Boots',
        'brand' => 'TCX',
        'price' => 179.99,
        'color' => 'Black/Green',
        'category' => 'boots',
        'image' => '/img/boots/tcx_infinity_mid_wp_boots_black_green_750x750.jpg'
    ],
    [
        'id' => 17,
        'name' => 'TCX Race Pro Air Boots',
        'brand' => 'TCX',
        'price' => 319.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/tcxrt_race_pro_air_boots_black_reflex_750x750.jpg'
    ],
    [
        'id' => 18,
        'name' => 'TCX Race Pro Air Boots',
        'brand' => 'TCX',
        'price' => 319.99,
        'color' => 'Orange/Black',
        'category' => 'boots',
        'image' => '/img/boots/tcxrt_race_pro_air_boots_orange_750x750.jpg'
    ],
    [
        'id' => 19,
        'name' => 'TCX Race Pro Air Boots',
        'brand' => 'TCX',
        'price' => 319.99,
        'color' => 'Silver',
        'category' => 'boots',
        'image' => '/img/boots/tcxrt_race_pro_air_boots_black_750x750.jpg'
    ],
    [
        'id' => 20,
        'name' => 'TCX Fuel WP Boots',
        'brand' => 'TCX',
        'price' => 199.99,
        'color' => 'Vintage Brown',
        'category' => 'boots',
        'image' => '/img/boots/tcx_fuel_wp_boots_vintage_brown36_open_box_vintage_brown_750x750.jpg'
    ],
    [
        'id' => 21,
        'name' => 'TCX Dartwood WP Shoes',
        'brand' => 'TCX',
        'price' => 159.99,
        'color' => 'Light Brown',
        'category' => 'boots',
        'image' => '/img/boots/tcx_dartwood_wp_shoes_light_brown_750x750.jpg'
    ],
    [
        'id' => 22,
        'name' => 'TCX Dartwood WP Shoes',
        'brand' => 'TCX',
        'price' => 159.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/tcx_dartwood_wp_shoes_750x750.jpg'
    ],
    [
        'id' => 23,
        'name' => 'TCX Dartwood WP Shoes',
        'brand' => 'TCX',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/tcx_dartwood_wp_shoes_black_750x750.jpg'
    ],
    [
        'id' => 24,
        'name' => 'TCX Street 3 Air Shoes',
        'brand' => 'TCX',
        'price' => 139.99,
        'color' => 'Green/Caramel',
        'category' => 'boots',
        'image' => '/img/boots/tcx_street3_air_shoes_black_750x750.jpg'
    ],
    [
        'id' => 25,
        'name' => 'TCX Street 3 Air Shoes',
        'brand' => 'TCX',
        'price' => 139.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/tcx_street3_air_shoes_green_caramel_750x750.jpg'
    ],
    
    // Alpinestars Boots
    [
        'id' => 26,
        'name' => 'Alpinestars Tech 7 Enduro Boots',
        'brand' => 'Alpinestars',
        'price' => 549.99,
        'color' => 'Black/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech7_enduro_boots_black_white_750x750.jpg'
    ],
    [
        'id' => 27,
        'name' => 'Alpinestars Tech 7 Enduro Boots',
        'brand' => 'Alpinestars',
        'price' => 549.99,
        'color' => 'Black/Anthracite/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech7_enduro_boots_black_anthracite_white_750x750.jpg'
    ],
    [
        'id' => 28,
        'name' => 'Alpinestars Tech 7 Enduro Boots',
        'brand' => 'Alpinestars',
        'price' => 549.99,
        'color' => 'Black/Grey/Orange Fluo',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech7_enduro_boots_black_grey_orange_fluo_750x750.jpg'
    ],
    [
        'id' => 29,
        'name' => 'Alpinestars Tech 7 Enduro Boots',
        'brand' => 'Alpinestars',
        'price' => 549.99,
        'color' => 'Black/Grey/Bright Red',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech7_enduro_boots_black_grey_bright_red_750x750.jpg'
    ],
    [
        'id' => 30,
        'name' => 'Alpinestars Tech 5 Boots',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech5_boots_750x750.jpg'
    ],
    [
        'id' => 31,
        'name' => 'Alpinestars Tech 5 Boots',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Black/Red',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_boot_tech_bk_gy_wt_black_red_750x750.jpg'
    ],
    [
        'id' => 32,
        'name' => 'Alpinestars Tech 5 Boots',
        'brand' => 'Alpinestars',
        'price' => 299.99,
        'color' => 'Yellow/Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech5_boots_yellow_black_750x750.jpg'
    ],
    [
        'id' => 33,
        'name' => 'Alpinestars Tech Boots',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Blue/Orange/Yellow',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech_boots_orange-750x750.jpg'
    ],
    [
        'id' => 34,
        'name' => 'Alpinestars Tech Boots',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Blue/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech_boots_blue_750x750.jpg'
    ],
    [
        'id' => 35,
        'name' => 'Alpinestars Tech Boots',
        'brand' => 'Alpinestars',
        'price' => 329.99,
        'color' => 'Red/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech_boots_fluo_red_blue_white_red_white_750x750.jpg'
    ],
    [
        'id' => 36,
        'name' => 'Alpinestars Tech 10 Supervented Boots',
        'brand' => 'Alpinestars',
        'price' => 649.99,
        'color' => 'Fluo Orange/Black/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech10_supervented_boot_750x750.jpg'
    ],
    [
        'id' => 37,
        'name' => 'Alpinestars Tech 10 Supervented Boots',
        'brand' => 'Alpinestars',
        'price' => 649.99,
        'color' => 'White/Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_boot_t10_s_vnt_750x750.jpg'
    ],
    [
        'id' => 38,
        'name' => 'Alpinestars Tech 10 Supervented Boots',
        'brand' => 'Alpinestars',
        'price' => 649.99,
        'color' => 'White/Red',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech_supervented_boots_blue_black_white_usa_750x750.jpg'
    ],
    [
        'id' => 39,
        'name' => 'Alpinestars Tech 10 Supervented Boots',
        'brand' => 'Alpinestars',
        'price' => 649.99,
        'color' => 'Black/Blue/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech_supervented_boots_blue_blue_white_us_750x750.jpg'
    ],
    [
        'id' => 40,
        'name' => 'Alpinestars Tech 10 Supervented Boots',
        'brand' => 'Alpinestars',
        'price' => 649.99,
        'color' => 'Navy/White/Red',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech10_supervented_boots_navy_white_red_750x750.jpg'
    ],
    [
        'id' => 41,
        'name' => 'Alpinestars Tech 10 Supervented Boots',
        'brand' => 'Alpinestars',
        'price' => 649.99,
        'color' => 'Purple/Yellow Fluo/Pink',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_tech10_supervenssdasted_boot_750x750.jpg'
    ],
    [
        'id' => 42,
        'name' => 'Alpinestars Stella SMX6 V3 Drystar Boots',
        'brand' => 'Alpinestars',
        'price' => 229.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_stella_smx6_v3_drystar_boots_black_silver_750x750.jpg'
    ],
    [
        'id' => 43,
        'name' => 'Alpinestars Stella SMX6 V3 Drystar Boots',
        'brand' => 'Alpinestars',
        'price' => 229.99,
        'color' => 'White/Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_stella_smx6_v3_drystar_boots_white_black_750x750.jpg'
    ],
    [
        'id' => 44,
        'name' => 'Alpinestars SMX-1 R V2 Boots',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_smx1_rv2_boots_750x750.jpg'
    ],
    [
        'id' => 45,
        'name' => 'Alpinestars SMX-1 R V2 Boots',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black/White',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_smx1_rv2_boossts_750x750.jpg'
    ],
    [
        'id' => 46,
        'name' => 'Alpinestars SMX-1 R V2 Boots',
        'brand' => 'Alpinestars',
        'price' => 179.99,
        'color' => 'Black/Red',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_smx1_rv2_boasdasots_750x750.jpg'
    ],
    [
        'id' => 47,
        'name' => 'Alpinestars Ridge V2 WP Boots',
        'brand' => 'Alpinestars',
        'price' => 199.99,
        'color' => 'Black/Black',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_ridgev2_wp_bosots_750x750.jpg'
    ],
    [
        'id' => 48,
        'name' => 'Alpinestars Ridge V2 WP Boots',
        'brand' => 'Alpinestars',
        'price' => 199.99,
        'color' => 'Black/Red',
        'category' => 'boots',
        'image' => '/img/boots/alpinestars_boot_ridge_v2_wp_black_redss_750x750.jpg'
    ],
    
    // Sidi Boots
    [
        'id' => 49,
        'name' => 'Sidi Mag-1 Boots',
        'brand' => 'Sidi',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/sidi_mag1_boossts_750x750.jpg'
    ],
    [
        'id' => 50,
        'name' => 'Sidi Mag-1 Boots',
        'brand' => 'Sidi',
        'price' => 349.99,
        'color' => 'Black/White',
        'category' => 'boots',
        'image' => '/img/boots/sidi_boots_mag1_boosadt_750x750.jpg'
    ],
    [
        'id' => 51,
        'name' => 'Sidi Mag-1 Boots',
        'brand' => 'Sidi',
        'price' => 349.99,
        'color' => 'White',
        'category' => 'boots',
        'image' => '/img/boots/sidi_mag1_boots_whsadaste_750x750.jpg'
    ],
    [
        'id' => 52,
        'name' => 'Sidi Mag-1 Boots',
        'brand' => 'Sidi',
        'price' => 349.99,
        'color' => 'Black/Red',
        'category' => 'boots',
        'image' => '/img/boots/sidi_boots_mag1_bosaaaot_750x750.jpg'
    ],
    
    // Gaerne Boots
    [
        'id' => 53,
        'name' => 'Gaerne GP Evo 1 Boots',
        'brand' => 'Gaerne',
        'price' => 499.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/gaerne_gp_evo1_bootsadadw_750x750.jpg'
    ],
    [
        'id' => 54,
        'name' => 'Gaerne GP Evo 1 Boots',
        'brand' => 'Gaerne',
        'price' => 499.99,
        'color' => 'White/Black/Hi-Viz Yellow',
        'category' => 'boots',
        'image' => '/img/boots/gaerne_gp_evo1_boots_750x750.jpg'
    ],
    [
        'id' => 55,
        'name' => 'Gaerne GP Evo 1 Boots',
        'brand' => 'Gaerne',
        'price' => 499.99,
        'color' => 'Nardo Grey/Red',
        'category' => 'boots',
        'image' => '/img/boots/gaerne_gp_evo1_bootwqqws_750x750.jpg'
    ],
    [
        'id' => 56,
        'name' => 'Gaerne G-Dakar Aquatec WP Boots',
        'brand' => 'Gaerne',
        'price' => 399.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/gaerne_g_dakar_aquatec_wp_boots_brownss_750x750.jpg'
    ],
    [
        'id' => 57,
        'name' => 'Gaerne G-Dune Aquatech WP Boots',
        'brand' => 'Gaerne',
        'price' => 349.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/gaerne_g_dune_aquatech_wp_boots_blacsdak_750x750.jpg'
    ],
    [
        'id' => 58,
        'name' => 'Gaerne G-Dune Aquatech WP Boots',
        'brand' => 'Gaerne',
        'price' => 349.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/gaerne_g_dune_aquatech_wp_boots_brasdasdasdasown_750x750.jpg'
    ],
    
    // Forma Boots
    [
        'id' => 59,
        'name' => 'Forma Adventure Boots',
        'brand' => 'Forma',
        'price' => 299.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/forma_adventure_bootssadas_750x750.jpg'
    ],
    [
        'id' => 60,
        'name' => 'Forma Adventure Boots',
        'brand' => 'Forma',
        'price' => 299.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/forma_adventure_boots_blaasdasdck_750x750.jpg'
    ],
    [
        'id' => 61,
        'name' => 'Forma Eagle Boots',
        'brand' => 'Forma',
        'price' => 249.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/forma_boots_eagleasdas_750x750.jpg'
    ],
    [
        'id' => 62,
        'name' => 'Forma Eagle Boots',
        'brand' => 'Forma',
        'price' => 249.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/forma_boots_eagdadle_750x750.jpg'
    ],
    [
        'id' => 63,
        'name' => 'Forma Freccia Boots',
        'brand' => 'Forma',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/forma_boots_frecciaasdas_750x750.jpg'
    ],
    [
        'id' => 64,
        'name' => 'Forma Freccia Boots',
        'brand' => 'Forma',
        'price' => 199.99,
        'color' => 'Black/White',
        'category' => 'boots',
        'image' => '/img/boots/forma_boots_frecciasadas_750x750.jpg'
    ],
    [
        'id' => 65,
        'name' => 'Forma Freccia Boots',
        'brand' => 'Forma',
        'price' => 199.99,
        'color' => 'Red/Black',
        'category' => 'boots',
        'image' => '/img/boots/forma_boots_frecasdasdcia_750x750.jpg'
    ],
    
    // Icon Boots
    [
        'id' => 66,
        'name' => 'Icon Elsinore 2 CE Boots',
        'brand' => 'Icon',
        'price' => 149.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/icon_elsinore2_ce_boosacasts_750x750.jpg'
    ],
    [
        'id' => 67,
        'name' => 'Icon Elsinore 2 CE Boots',
        'brand' => 'Icon',
        'price' => 149.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/icon_elsinore2_ce_booascasts_750x750.jpg'
    ],
    [
        'id' => 68,
        'name' => 'Icon Stormhawk Waterproof Boots',
        'brand' => 'Icon',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/icon_stormhawk_waterproof_boots_blacasdask_750x750.jpg'
    ],
    [
        'id' => 69,
        'name' => 'Icon Stormhawk Waterproof Boots',
        'brand' => 'Icon',
        'price' => 179.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => '/img/boots/icon_stormhawk_waterproof_boots_grascacay_750x750.jpg'
    ],
    [
        'id' => 70,
        'name' => 'Icon Stormhawk Waterproof Boots',
        'brand' => 'Icon',
        'price' => 179.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/icon_stormhawk_waterproof_boots_browascasn_750x750.jpg'
    ],
    [
        'id' => 71,
        'name' => 'Icon Overlord Vented CE Boots',
        'brand' => 'Icon',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/icon_overlord_vented_ce_boots_blaacascasck_750x750.jpg'
    ],
    [
        'id' => 72,
        'name' => 'Icon Overlord Vented CE Boots',
        'brand' => 'Icon',
        'price' => 199.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => '/img/boots/icon_overlord_vented_ce_boots_grecaasy_750x750.jpg'
    ],
    [
        'id' => 73,
        'name' => 'Icon Slabtown WP CE Boots',
        'brand' => 'Icon',
        'price' => 169.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/icon_slabtown_wpce_boots_bladasdasck_750x750.jpg'
    ],
    [
        'id' => 74,
        'name' => 'Icon Alcan WP CE Boots',
        'brand' => 'Icon',
        'price' => 189.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/icon_alcan_wpce_boots_blaasdasdawqwqck_750x750.jpg'
    ],
    [
        'id' => 75,
        'name' => 'Icon Alcan WP CE Boots',
        'brand' => 'Icon',
        'price' => 189.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => '/img/boots/icon_alcan_wpce_bootascass_750x750.jpg'
    ],
    [
        'id' => 76,
        'name' => 'Icon Patrol 3 WP CE Boots',
        'brand' => 'Icon',
        'price' => 159.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/icon_patrol3_wpce_boots_blacksacas_750x750.jpg'
    ],
    [
        'id' => 77,
        'name' => 'Icon Patrol 3 WP CE Boots',
        'brand' => 'Icon',
        'price' => 159.99,
        'color' => 'Grey',
        'category' => 'boots',
        'image' => '/img/boots/icon_patrol3_wpce_boots_greascasy_750x750.jpg'
    ],
    
    // Stylmartin Boots
    [
        'id' => 78,
        'name' => 'Stylmartin Legend Evo WP Boots',
        'brand' => 'Stylmartin',
        'price' => 249.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/stylmartin_legend_evo_wp_boots_blackacascas_750x750.jpg'
    ],
    [
        'id' => 79,
        'name' => 'Stylmartin Continental Boots',
        'brand' => 'Stylmartin',
        'price' => 199.99,
        'color' => 'Red',
        'category' => 'boots',
        'image' => '/img/boots/stylmartin_continental_boots_redascas_750x750.jpg'
    ],
    [
        'id' => 80,
        'name' => 'Stylmartin Continental Boots',
        'brand' => 'Stylmartin',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/stylmartin_continental_boots_blacascwqadck_750x750.jpg'
    ],
    
    // BMW Boots
    [
        'id' => 81,
        'name' => 'BMW Seoul GTX Sneakers',
        'brand' => 'BMW',
        'price' => 229.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/bmw_seoul_gtx_sneakers_khakascasi_750x750.jpg'
    ],
    [
        'id' => 82,
        'name' => 'BMW Seoul GTX Sneakers',
        'brand' => 'BMW',
        'price' => 229.99,
        'color' => 'Khaki',
        'category' => 'boots',
        'image' => '/img/boots/bmw_seoul_gtx_sneakers_khakiascas_750x750.jpg'
    ],
    
    // RST Boots
    [
        'id' => 83,
        'name' => 'RST Moto Tractech Evo III CE WP Boots',
        'brand' => 'RST',
        'price' => 279.99,
        'color' => 'Black/Black',
        'category' => 'boots',
        'image' => '/img/boots/rst_moto_tractech_evo_iiicewp_boots_black_blacsadask_750x750.jpg'
    ],
    [
        'id' => 84,
        'name' => 'RST Moto Adventure X Mid CE WP Boots',
        'brand' => 'RST',
        'price' => 199.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/rst_moto_adventure_x_mid_cewp_boots_black_asdas750x750.jpg'
    ],
    
    // Klim Boots
    [
        'id' => 85,
        'name' => 'Klim Adventure GTX Boots',
        'brand' => 'Klim',
        'price' => 499.99,
        'color' => 'Brown/Orange',
        'category' => 'boots',
        'image' => '/img/boots/klim_adventure_gtx_boots_brown_oraasdasAnge_750x750.jpg'
    ],
    [
        'id' => 86,
        'name' => 'Klim Adventure GTX Boots',
        'brand' => 'Klim',
        'price' => 499.99,
        'color' => 'Asphalt/Hi-Viz Green',
        'category' => 'boots',
        'image' => '/img/boots/klim_adventure_gtx_boascasdasots_750x750.jpg'
    ],
    [
        'id' => 87,
        'name' => 'Klim Adventure GTX Boots',
        'brand' => 'Klim',
        'price' => 499.99,
        'color' => 'Stealth Black',
        'category' => 'boots',
        'image' => '/img/boots/klim_adventure_gtx_booasdts_750x750.jpg'
    ],
    
    // Tour Master Boots
    [
        'id' => 88,
        'name' => 'Tour Master Break Trail WP Boots',
        'brand' => 'Tour Master',
        'price' => 179.99,
        'color' => 'Brown',
        'category' => 'boots',
        'image' => '/img/boots/tour_master_break_trail_wp_boots_broasdasn_750x750.jpg'
    ],
    [
        'id' => 89,
        'name' => 'Tour Master Break Trail WP Boots',
        'brand' => 'Tour Master',
        'price' => 179.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/tour_master_break_trail_wp_boots_bacsslack_750x750.jpg'
    ],
    
    // Sedici Boots
    [
        'id' => 90,
        'name' => 'Sedici Vertice H2O Boot',
        'brand' => 'Sedici',
        'price' => 169.99,
        'color' => 'Black',
        'category' => 'boots',
        'image' => '/img/boots/sedici_vertice_h2_o_boot_blasdcasack_750x750.jpg'
    ]
];

echo json_encode($boots, JSON_PRETTY_PRINT);
?>