<?php
// api/config/security.php - ENHANCED VERSION

// ========================
// BASIC SECURITY HEADERS
// ========================

// Prevent any output before JSON
ob_start();

// Set proper JSON headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// CORS - Allow your frontend
$allowed_origins = ['http://localhost', 'http://127.0.0.1'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: http://localhost');
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ========================
// ENHANCED SECURITY HEADERS
// ========================

header('X-Frame-Options: DENY'); // Prevent clickjacking
header('X-XSS-Protection: 1; mode=block'); // XSS protection
header('Referrer-Policy: strict-origin-when-cross-origin'); // Control referrer info

// ========================
// RATE LIMITING - SIMPLE VERSION
// ========================

function checkRateLimit() {
    $max_requests = 100; // Max requests per hour
    $ip = $_SERVER['REMOTE_ADDR'];
    $rate_file = sys_get_temp_dir() . '/rate_limit_' . md5($ip) . '.json';
    
    $current_time = time();
    
    if (file_exists($rate_file)) {
        $data = json_decode(file_get_contents($rate_file), true);
        
        // Reset if hour has passed
        if (($current_time - $data['first_request']) > 3600) {
            $data = ['count' => 1, 'first_request' => $current_time];
        } else {
            $data['count']++;
            
            // Check if limit exceeded
            if ($data['count'] > $max_requests) {
                http_response_code(429);
                echo json_encode(['error' => 'Rate limit exceeded. Please try again later.']);
                exit;
            }
        }
    } else {
        $data = ['count' => 1, 'first_request' => $current_time];
    }
    
    file_put_contents($rate_file, json_encode($data));
}

// ========================
// INPUT VALIDATION
// ========================

function validateInput() {
    if (!empty($_GET)) {
        foreach ($_GET as $key => $value) {
            // Basic SQL injection prevention
            $dangerous_patterns = [
                '/union\s+select/i',
                '/insert\s+into/i', 
                '/drop\s+table/i',
                '/script\s*:/i',
                '/javascript\s*:/i',
                '/<\s*script/i'
            ];
            
            foreach ($dangerous_patterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid input detected.']);
                    exit;
                }
            }
        }
    }
}

// ========================
// REQUEST VALIDATION
// ========================

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Only GET requests are allowed']);
    exit;
}

// ========================
// APPLY ENHANCED SECURITY
// ========================

checkRateLimit(); // Apply rate limiting
validateInput();  // Validate all inputs

// ========================
// CLEAN ANY BUFFERED OUTPUT
// ========================

ob_end_clean();
?>