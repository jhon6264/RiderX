<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration (same as order API)
$host = 'localhost';
$dbname = 'riderx_orders';
$username = 'root';
$password = '';

// Create database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get the action from URL parameter
$action = $_GET['action'] ?? '';

// Handle different actions
switch($action) {
    case 'generate_qr':
        generateQR();
        break;
    case 'initiate_payment':
        initiatePayment();
        break;
    case 'get_payment_status':
        getPaymentStatus();
        break;
    case 'verify_payment':
        verifyPayment();
        break;
    case 'get_pending_verifications':
        getPendingVerifications();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// FUNCTION 1: Generate QR code data (not image, just the data)
function generateQR() {
    global $pdo;
    
    $order_id = $_GET['order_id'] ?? '';
    
    if (empty($order_id)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        return;
    }
    
    try {
        // Get order details
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$order_id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }
        
        // Your GCash number (REPLACE WITH YOUR ACTUAL GCASH NUMBER)
        $your_gcash_number = "09171234567";
        
        // Create QR data for GCash app
        $qr_data = "GCash Payment\n";
        $qr_data .= "Number: " . $your_gcash_number . "\n";
        $qr_data .= "Amount: ₱" . number_format($order['total_amount'], 2) . "\n";
        $qr_data .= "Reference: ORDER-" . $order_id . "\n";
        $qr_data .= "Merchant: RiderX Store";
        
        echo json_encode([
            'success' => true,
            'qr_data' => $qr_data,
            'gcash_number' => $your_gcash_number,
            'amount' => $order['total_amount'],
            'reference' => 'ORDER-' . $order_id,
            'instructions' => 'Send exact amount to this GCash number with the reference number'
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to generate QR: ' . $e->getMessage()]);
    }
}

// FUNCTION 2: Initiate payment (link payment to order)
function initiatePayment() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $order_id = $input['order_id'] ?? '';
    $gcash_number = $input['gcash_number'] ?? ''; // Customer's GCash number
    
    if (empty($order_id)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        return;
    }
    
    try {
        // Get order amount
        $orderStmt = $pdo->prepare("SELECT total_amount FROM orders WHERE id = ?");
        $orderStmt->execute([$order_id]);
        $order = $orderStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }
        
        // Check if payment already exists
        $checkStmt = $pdo->prepare("SELECT * FROM payments WHERE order_id = ?");
        $checkStmt->execute([$order_id]);
        $existing_payment = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($existing_payment) {
            echo json_encode([
                'success' => true,
                'message' => 'Payment already initiated',
                'payment_id' => $existing_payment['id'],
                'reference_number' => $existing_payment['reference_number']
            ]);
            return;
        }
        
        // Create new payment record
        $reference_number = 'RIDERX-' . $order_id . '-' . time();
        
        $stmt = $pdo->prepare("INSERT INTO payments (order_id, amount_paid, status, reference_number, gcash_number) VALUES (?, ?, 'pending', ?, ?)");
        $stmt->execute([
            $order_id,
            $order['total_amount'],
            $reference_number,
            $gcash_number
        ]);
        
        $payment_id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Payment initiated successfully',
            'payment_id' => $payment_id,
            'reference_number' => $reference_number,
            'amount' => $order['total_amount'],
            'instructions' => 'Send exact amount to GCash number with reference: ' . $reference_number
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to initiate payment: ' . $e->getMessage()]);
    }
}

// FUNCTION 3: Check payment status
function getPaymentStatus() {
    global $pdo;
    
    $order_id = $_GET['order_id'] ?? '';
    $payment_id = $_GET['payment_id'] ?? '';
    
    if (empty($order_id) && empty($payment_id)) {
        echo json_encode(['success' => false, 'message' => 'Order ID or Payment ID is required']);
        return;
    }
    
    try {
        if (!empty($order_id)) {
            $stmt = $pdo->prepare("SELECT p.*, o.customer_name, o.total_amount FROM payments p JOIN orders o ON p.order_id = o.id WHERE p.order_id = ?");
            $stmt->execute([$order_id]);
        } else {
            $stmt = $pdo->prepare("SELECT p.*, o.customer_name, o.total_amount FROM payments p JOIN orders o ON p.order_id = o.id WHERE p.id = ?");
            $stmt->execute([$payment_id]);
        }
        
        $payment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$payment) {
            echo json_encode(['success' => false, 'message' => 'Payment not found']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'payment' => $payment
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to get payment status: ' . $e->getMessage()]);
    }
}

// FUNCTION 4: Manual payment verification (ADMIN USE)
function verifyPayment() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $payment_id = $input['payment_id'] ?? '';
    $actual_amount_received = $input['actual_amount_received'] ?? 0;
    $verified_by = $input['verified_by'] ?? 'Admin';
    $notes = $input['notes'] ?? '';
    
    if (empty($payment_id) || $actual_amount_received <= 0) {
        echo json_encode(['success' => false, 'message' => 'Payment ID and actual amount are required']);
        return;
    }
    
    try {
        // Get payment details
        $stmt = $pdo->prepare("SELECT p.*, o.total_amount as expected_amount FROM payments p JOIN orders o ON p.order_id = o.id WHERE p.id = ?");
        $stmt->execute([$payment_id]);
        $payment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$payment) {
            echo json_encode(['success' => false, 'message' => 'Payment not found']);
            return;
        }
        
        // Check if amount matches exactly
        $expected_amount = $payment['expected_amount'];
        $status = 'verified';
        $verification_notes = $notes;
        
        if ($actual_amount_received != $expected_amount) {
            $status = 'failed';
            $verification_notes = "Amount mismatch. Expected: ₱{$expected_amount}, Received: ₱{$actual_amount_received}. " . $notes;
        }
        
        // Update payment status
        $updateStmt = $pdo->prepare("UPDATE payments SET status = ?, amount_paid = ? WHERE id = ?");
        $updateStmt->execute([$status, $actual_amount_received, $payment_id]);
        
        // If payment verified, update order status to 'to_ship'
        if ($status === 'verified') {
            $orderUpdateStmt = $pdo->prepare("UPDATE orders SET status = 'to_ship' WHERE id = ?");
            $orderUpdateStmt->execute([$payment['order_id']]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Payment verification completed',
            'payment_id' => $payment_id,
            'order_id' => $payment['order_id'],
            'expected_amount' => $expected_amount,
            'actual_amount_received' => $actual_amount_received,
            'status' => $status,
            'order_status_updated' => ($status === 'verified') ? 'to_ship' : 'pending'
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to verify payment: ' . $e->getMessage()]);
    }
}

// FUNCTION 5: Get payments pending verification (ADMIN DASHBOARD)
function getPendingVerifications() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT p.*, o.customer_name, o.customer_email, o.total_amount 
                              FROM payments p 
                              JOIN orders o ON p.order_id = o.id 
                              WHERE p.status = 'pending' 
                              ORDER BY p.created_at DESC");
        $stmt->execute();
        
        $pending_payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'pending_payments' => $pending_payments,
            'count' => count($pending_payments)
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to get pending verifications: ' . $e->getMessage()]);
    }
}
?>