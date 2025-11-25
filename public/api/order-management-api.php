<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
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
    case 'create_order':
        createOrder();
        break;
    case 'get_orders':
        getOrders();
        break;
    case 'get_order':
        getOrder();
        break;
    case 'update_status':
        updateOrderStatus();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// FUNCTION 1: Create new order
function createOrder() {
    global $pdo;
    
    // Get data from POST request
    $input = json_decode(file_get_contents('php://input'), true);
    
    $customer_name = $input['customer_name'] ?? '';
    $customer_email = $input['customer_email'] ?? '';
    $total_amount = $input['total_amount'] ?? 0;
    $items = $input['items'] ?? [];
    
    // Validate required fields
    if (empty($customer_name) || empty($customer_email) || $total_amount <= 0 || empty($items)) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    try {
        // Start transaction
        $pdo->beginTransaction();
        
        // Insert into orders table
        $stmt = $pdo->prepare("INSERT INTO orders (customer_name, customer_email, total_amount, status) VALUES (?, ?, ?, 'pending')");
        $stmt->execute([$customer_name, $customer_email, $total_amount]);
        $order_id = $pdo->lastInsertId();
        
        // Insert order items
        $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
        
        foreach ($items as $item) {
            $itemStmt->execute([
                $order_id,
                $item['product_name'],
                $item['quantity'],
                $item['price']
            ]);
        }
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'order_id' => $order_id,
            'status' => 'pending'
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()]);
    }
}

// FUNCTION 2: Get all orders
function getOrders() {
    global $pdo;
    
    $status_filter = $_GET['status'] ?? '';
    
    try {
        if ($status_filter) {
            $stmt = $pdo->prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$status_filter]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM orders ORDER BY created_at DESC");
            $stmt->execute();
        }
        
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
}

// FUNCTION 3: Get single order details
function getOrder() {
    global $pdo;
    
    $order_id = $_GET['id'] ?? '';
    
    if (empty($order_id)) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        return;
    }
    
    try {
        // Get order basic info
        $orderStmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $orderStmt->execute([$order_id]);
        $order = $orderStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }
        
        // Get order items
        $itemsStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$order_id]);
        $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'order' => $order,
            'items' => $items
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch order: ' . $e->getMessage()]);
    }
}

// FUNCTION 4: Update order status
function updateOrderStatus() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $order_id = $input['order_id'] ?? '';
    $new_status = $input['status'] ?? '';
    
    $allowed_statuses = ['pending', 'to_ship', 'shipped', 'delivered', 'cancelled'];
    
    if (empty($order_id) || empty($new_status)) {
        echo json_encode(['success' => false, 'message' => 'Order ID and status are required']);
        return;
    }
    
    if (!in_array($new_status, $allowed_statuses)) {
        echo json_encode(['success' => false, 'message' => 'Invalid status']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$new_status, $order_id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => "Order status updated to '$new_status'",
                'order_id' => $order_id,
                'new_status' => $new_status
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Order not found or no changes made']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update order status: ' . $e->getMessage()]);
    }
}
?>