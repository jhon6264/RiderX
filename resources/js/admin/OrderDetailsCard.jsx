import React from 'react';

const OrderDetailsCard = ({ order }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusTimeline = () => {
        const timeline = [
            { event: 'Order Placed', date: order.created_at, status: 'created' }
        ];

        if (order.shipped_at) {
            timeline.push({ event: 'Shipped', date: order.shipped_at, status: 'shipped' });
        }

        if (order.delivered_at) {
            timeline.push({ event: 'Delivered', date: order.delivered_at, status: 'delivered' });
        }

        if (order.cancelled_at) {
            timeline.push({ event: 'Cancelled', date: order.cancelled_at, status: 'cancelled' });
        }

        return timeline;
    };

    const getPaymentStatusBadge = (payment) => {
        if (!payment) return { text: 'No Payment', class: 'status-pending' };
        
        const statusConfig = {
            pending: { text: 'Pending Verification', class: 'status-pending' },
            verified: { text: 'Approved', class: 'status-delivered' },
            rejected: { text: 'Rejected', class: 'status-cancelled' },
            failed: { text: 'Failed', class: 'status-cancelled' }
        };

        const config = statusConfig[payment.status] || { text: 'Unknown', class: 'status-pending' };
        
        return (
            <span className={`status-badge ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const timeline = getStatusTimeline();

    // SVG Icons
    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    );

    const PhoneIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    );

    const LocationIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    );

    const PaymentIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
        </svg>
    );

    const TimelineIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    );

    return (
        <div className="order-details-card">
            <div className="details-grid">
                {/* Customer Information */}
                <div className="detail-section">
                    <h4>
                        <UserIcon />
                        Customer Information
                    </h4>
                    <div className="detail-list">
                        <div className="detail-item">
                            <strong>Name:</strong> {order.user?.name || 'N/A'}
                        </div>
                        <div className="detail-item">
                            <strong>Email:</strong> {order.user?.email || 'N/A'}
                        </div>
                        <div className="detail-item">
                            <strong>User ID:</strong> #{order.user_id}
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="detail-section">
                    <h4>
                        <LocationIcon />
                        Shipping Information
                    </h4>
                    <div className="detail-list">
                        <div className="detail-item">
                            <strong>Shipping Address:</strong>
                            <div className="address-text">{order.shipping_address}</div>
                        </div>
                        <div className="detail-item">
                            <strong>
                                <PhoneIcon />
                                Contact Number:
                            </strong> 
                            {order.contact_number}
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="detail-section">
                    <h4>
                        <PaymentIcon />
                        Payment Information
                    </h4>
                    <div className="detail-list">
                        {order.payment ? (
                            <>
                                <div className="detail-item">
                                    <strong>Status:</strong> 
                                    {getPaymentStatusBadge(order.payment)}
                                </div>
                                <div className="detail-item">
                                    <strong>Reference No:</strong> {order.payment.reference_number}
                                </div>
                                <div className="detail-item">
                                    <strong>GCash Number:</strong> {order.payment.gcash_number}
                                </div>
                                <div className="detail-item">
                                    <strong>QR Code Used:</strong> #{order.payment.qr_number}
                                </div>
                                {order.payment.verified_by && (
                                    <div className="detail-item">
                                        <strong>Verified By:</strong> {order.payment.verified_by}
                                    </div>
                                )}
                                {order.payment.verified_at && (
                                    <div className="detail-item">
                                        <strong>Verified At:</strong> {formatDate(order.payment.verified_at)}
                                    </div>
                                )}
                                {order.payment.notes && (
                                    <div className="detail-item">
                                        <strong>Notes:</strong> 
                                        <div className="notes-text">{order.payment.notes}</div>
                                    </div>
                                )}
                                {order.payment.screenshot_path && (
                                    <div className="detail-item">
                                        <strong>Payment Proof:</strong>
                                        <a 
                                            href={`/uploads/payment-screenshots/${order.payment.screenshot_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="screenshot-link"
                                        >
                                            View Screenshot
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="detail-item">
                                <strong>Status:</strong> 
                                <span className="status-badge status-pending">No Payment Record</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Timeline */}
                <div className="detail-section">
                    <h4>
                        <TimelineIcon />
                        Order Timeline
                    </h4>
                    <div className="timeline">
                        {timeline.map((item, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <div className="timeline-event">{item.event}</div>
                                    <div className="timeline-date">{formatDate(item.date)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cancellation Details */}
                {order.cancellation_reason && (
                    <div className="detail-section">
                        <h4>Cancellation Details</h4>
                        <div className="cancellation-info">
                            <div className="detail-item">
                                <strong>Cancelled At:</strong> {formatDate(order.cancelled_at)}
                            </div>
                            <div className="detail-item">
                                <strong>Reason:</strong>
                                <div className="cancellation-reason">{order.cancellation_reason}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="detail-section full-width">
                    <h4>Order Items</h4>
                    <div className="order-items-list">
                        {order.items?.map((item, index) => (
                            <div key={index} className="order-item">
                                <div className="item-image">
                                    {item.variant?.image_url ? (
                                        <img 
                                            src={item.variant.image_url} 
                                            alt={item.variant.product?.name}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder-product.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="image-placeholder">📦</div>
                                    )}
                                </div>
                                <div className="item-details">
                                    <div className="item-name">
                                        {item.variant?.product?.name || 'Product'} - {item.variant?.color || 'Standard'}
                                    </div>
                                    <div className="item-sku">
                                        SKU: {item.variant?.sku || 'N/A'}
                                    </div>
                                </div>
                                <div className="item-quantity">
                                    Qty: {item.quantity}
                                </div>
                                <div className="item-price">
                                    ₱{item.price?.toLocaleString()} each
                                </div>
                                <div className="item-total">
                                    ₱{item.total?.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="order-summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₱{order.total_amount?.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row grand-total">
                            <span>Total:</span>
                            <span>₱{order.total_amount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsCard;