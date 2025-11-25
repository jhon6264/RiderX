import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '../utils/currencyFormatter';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/orders/${id}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setOrder(data.order);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#f59e0b',      // Yellow - To Pay
            to_ship: '#3b82f6',      // Blue - To Ship
            shipped: '#8b5cf6',      // Purple - Shipped
            delivered: '#10b981',    // Green - Delivered
            cancelled: '#ef4444',    // Red - Cancelled
            rejected: '#dc2626'      // Dark Red - Rejected (Payment rejected)
        };
        return statusColors[status] || '#6b7280';
    };

    const getStatusText = (status) => {
        const statusText = {
            pending: 'To Pay',
            to_ship: 'To Ship',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            rejected: 'Payment Rejected'
        };
        return statusText[status] || status;
    };

    const getStatusDescription = (status) => {
        const descriptions = {
            pending: 'Waiting for payment confirmation',
            to_ship: 'Payment verified. Preparing your order for shipment',
            shipped: 'Your order is on the way',
            delivered: 'Order delivered successfully',
            cancelled: 'This order has been cancelled',
            rejected: 'Your payment was rejected. Please check your payment details and try again.'
        };
        return descriptions[status] || 'Order processing';
    };

    const getPaymentStatus = (order) => {
        // Check if order has payment information
        if (order.payment) {
            return order.payment.status; // 'pending', 'verified', 'rejected', 'failed'
        }
        return 'pending'; // Default if no payment info
    };

    const getPaymentStatusText = (paymentStatus) => {
        const statusText = {
            pending: 'Pending Verification',
            verified: 'Verified ✅',
            rejected: 'Rejected ❌',
            failed: 'Failed ❌'
        };
        return statusText[paymentStatus] || 'Pending';
    };

    const getPaymentStatusColor = (paymentStatus) => {
        const statusColors = {
            pending: '#f59e0b',    // Yellow
            verified: '#10b981',   // Green
            rejected: '#dc2626',   // Red
            failed: '#dc2626'      // Red
        };
        return statusColors[paymentStatus] || '#6b7280';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="order-details-page">
                <div className="container">
                    <div className="loading">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-details-page">
                <div className="container">
                    <div className="error-message">
                        {error || 'Order not found'}
                        <div className="action-buttons">
                            <Link to="/orders" className="btn-primary">
                                Back to Orders
                            </Link>
                            <button onClick={fetchOrder} className="btn-secondary">
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const paymentStatus = getPaymentStatus(order);
    const isPaymentRejected = paymentStatus === 'rejected' || paymentStatus === 'failed';

    return (
        <div className="order-details-page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <Link to="/orders" className="back-link">
                        ← Back to Orders
                    </Link>
                    <h1>Order #{order.id}</h1>
                    <p>Placed on {formatDate(order.created_at)}</p>
                </div>

                <div className="order-details-content">
                    {/* Left Column - Order Info */}
                    <div className="order-info-column">
                        {/* Status Card */}
                        <div className="status-card">
                            <div 
                                className="status-badge-large"
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {getStatusText(order.status)}
                            </div>
                            <p className="status-description">
                                {getStatusDescription(order.status)}
                            </p>

                            {/* Payment Rejection Warning */}
                            {isPaymentRejected && (
                                <div className="rejection-warning">
                                    <div className="warning-icon">⚠️</div>
                                    <div className="warning-content">
                                        <h4>Payment Issue</h4>
                                        <p>Your payment was not approved. Please check the payment details below.</p>
                                        {order.payment?.notes && (
                                            <div className="rejection-reason">
                                                <strong>Reason:</strong> {order.payment.notes}
                                            </div>
                                        )}
                                        <div className="rejection-actions">
                                            <Link to="/cart" className="btn-primary">
                                                Try Again
                                            </Link>
                                            <button className="btn-secondary">
                                                Contact Support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shipping Info */}
                        <div className="info-card">
                            <h3>Shipping Information</h3>
                            <div className="info-content">
                                <div className="info-row">
                                    <strong>Address:</strong>
                                    <span>{order.shipping_address}</span>
                                </div>
                                <div className="info-row">
                                    <strong>Contact:</strong>
                                    <span>{order.contact_number}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="info-card">
                            <h3>Payment Information</h3>
                            <div className="info-content">
                                <div className="info-row">
                                    <strong>Method:</strong>
                                    <span>GCash</span>
                                </div>
                                <div className="info-row">
                                    <strong>Status:</strong>
                                    <span 
                                        className="payment-status"
                                        style={{ color: getPaymentStatusColor(paymentStatus) }}
                                    >
                                        {getPaymentStatusText(paymentStatus)}
                                    </span>
                                </div>
                                {order.payment && (
                                    <>
                                        <div className="info-row">
                                            <strong>Reference No:</strong>
                                            <span>{order.payment.reference_number}</span>
                                        </div>
                                        <div className="info-row">
                                            <strong>GCash Number:</strong>
                                            <span>{order.payment.gcash_number || 'Not provided'}</span>
                                        </div>
                                        <div className="info-row">
                                            <strong>QR Code Used:</strong>
                                            <span>#{order.payment.qr_number}</span>
                                        </div>
                                    </>
                                )}
                                <div className="info-row">
                                    <strong>Total Amount:</strong>
                                    <span className="total-amount">{formatPrice(order.total_amount)}</span>
                                </div>
                                
                                {/* Payment Notes (for rejected/failed payments) */}
                                {order.payment?.notes && paymentStatus !== 'verified' && (
                                    <div className="info-row">
                                        <strong>Notes:</strong>
                                        <span className="payment-notes">{order.payment.notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Items */}
                    <div className="order-items-column">
                        <div className="items-card">
                            <h3>Order Items ({order.items ? order.items.length : 0})</h3>
                            
                            {order.items && order.items.length > 0 ? (
                                <div className="order-items-list">
                                    {order.items.map((item, index) => (
                                        <OrderItemRow key={index} item={item} />
                                    ))}
                                    
                                    {/* Order Total */}
                                    <div className="order-total-section">
                                        <div className="total-row">
                                            <span>Subtotal:</span>
                                            <span>{formatPrice(order.total_amount)}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Shipping:</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="total-row grand-total">
                                            <strong>Total:</strong>
                                            <strong>{formatPrice(order.total_amount)}</strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-items">No items found in this order</div>
                            )}
                        </div>

                        {/* Help Section */}
                        <div className="help-card">
                            <h4>Need Help?</h4>
                            <p>If you have any questions about your order, contact our support team.</p>
                            <div className="help-actions">
                                <button className="help-btn">Contact Support</button>
                                {order.status === 'shipped' && (
                                    <button className="help-btn">Track Package</button>
                                )}
                                {isPaymentRejected && (
                                    <button className="help-btn primary">Repayment Help</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Order Item Component
const OrderItemRow = ({ item }) => {
    return (
        <div className="order-item-row">
            <div className="item-image">
                <img 
                    src={item.variant?.image_url || '/images/placeholder-product.jpg'} 
                    alt={item.variant?.product?.name || 'Product'}
                />
            </div>
            
            <div className="item-details">
                <h4>{item.variant?.product?.name || 'Product'}</h4>
                <p className="item-variant">{item.variant?.color || 'Standard'}</p>
                <p className="item-price">{formatPrice(item.price)} each</p>
            </div>
            
            <div className="item-quantity">
                <span>Qty: {item.quantity}</span>
            </div>
            
            <div className="item-total">
                <strong>{formatPrice(item.total)}</strong>
            </div>
        </div>
    );
};

export default OrderDetailsPage;