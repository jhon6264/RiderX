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
            pending: '#f59e0b',
            to_ship: '#3b82f6', 
            shipped: '#8b5cf6',
            delivered: '#10b981',
            cancelled: '#ef4444',
            rejected: '#dc2626'
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

    const getPaymentStatus = (order) => {
        if (order.payment) {
            return order.payment.status;
        }
        return 'pending';
    };

    const getPaymentStatusText = (paymentStatus) => {
        const statusText = {
            pending: 'Pending Verification',
            verified: 'Payment Verified',
            rejected: 'Payment Rejected',
            failed: 'Payment Failed'
        };
        return statusText[paymentStatus] || 'Pending';
    };

    const getPaymentStatusColor = (paymentStatus) => {
        const statusColors = {
            pending: '#f59e0b',
            verified: '#10b981',
            rejected: '#dc2626', 
            failed: '#dc2626'
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
                    <p className="order-date">Placed on {formatDate(order.created_at)}</p>
                    
                    <div className="status-section">
                        <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                            {getStatusText(order.status)}
                        </div>
                        {isPaymentRejected && (
                            <div className="payment-warning">
                                Payment was not approved
                            </div>
                        )}
                    </div>
                </div>

                <div className="order-content">
                    {/* Order Items */}
                    <div className="order-items-section">
                        <h2>Order Items</h2>
                        <div className="order-items-list">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <OrderItemRow key={index} item={item} />
                                ))
                            ) : (
                                <div className="no-items">No items found</div>
                            )}
                        </div>

                        {/* Order Total */}
                        <div className="order-total">
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

                    {/* Order Information */}
                    <div className="order-info-section">
                        {/* Shipping Information */}
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

                        {/* Payment Information */}
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
                                    </>
                                )}
                                {order.payment?.notes && paymentStatus !== 'verified' && (
                                    <div className="info-row">
                                        <strong>Notes:</strong>
                                        <span className="payment-notes">{order.payment.notes}</span>
                                    </div>
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