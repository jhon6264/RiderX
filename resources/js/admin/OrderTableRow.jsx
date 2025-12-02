import React, { useState } from 'react';
import OrderDetailsCard from './OrderDetailsCard';

const OrderTableRow = ({ 
    order, 
    isExpanded, 
    onToggleExpand, 
    onStatusUpdate, 
    onOrderCancelled 
}) => {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { text: 'Pending', class: 'status-pending' },
            to_ship: { text: 'Ready to Ship', class: 'status-ready' },
            shipped: { text: 'Shipped', class: 'status-shipped' },
            delivered: { text: 'Delivered', class: 'status-delivered' },
            cancelled: { text: 'Cancelled', class: 'status-cancelled' }
        };

        const config = statusConfig[status] || { text: status, class: 'status-pending' };
        
        return (
            <span className={`status-badge ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const getPaymentStatus = (payment) => {
        if (!payment) return { text: 'No Payment', class: 'status-pending' };
        
        const statusConfig = {
            pending: { text: 'Pending', class: 'status-pending' },
            verified: { text: 'Approved', class: 'status-delivered' },
            rejected: { text: 'Rejected', class: 'status-cancelled' },
            failed: { text: 'Failed', class: 'status-cancelled' }
        };

        return statusConfig[payment.status] || { text: 'Unknown', class: 'status-pending' };
    };

    const handleStatusUpdate = async (newStatus) => {
        if (processing) return;
        
        setProcessing(true);
        try {
            const response = await fetch(`/admin/orders/${order.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus,
                    notes: `Status updated to ${newStatus}`
                })
            });

            const data = await response.json();

            if (data.success) {
                onStatusUpdate(order.id, newStatus);
                setShowStatusModal(false);
            } else {
                alert('Failed to update status: ' + data.message);
            }
        } catch (err) {
            console.error('Update status error:', err);
            alert('Failed to update order status');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelOrder = async () => {
        if (processing || !cancelReason.trim()) return;
        
        setProcessing(true);
        try {
            const response = await fetch(`/admin/orders/${order.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    cancellation_reason: cancelReason
                })
            });

            const data = await response.json();

            if (data.success) {
                onOrderCancelled(order.id);
                setShowCancelModal(false);
                setCancelReason('');
            } else {
                alert('Failed to cancel order: ' + data.message);
            }
        } catch (err) {
            console.error('Cancel order error:', err);
            alert('Failed to cancel order');
        } finally {
            setProcessing(false);
        }
    };

    const getNextStatusOptions = () => {
        const currentStatus = order.status;
        
        const transitions = {
            pending: ['to_ship', 'cancelled'],
            to_ship: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: [],
            cancelled: []
        };

        return transitions[currentStatus] || [];
    };

    const getStatusButtonText = (status) => {
        const texts = {
            to_ship: 'Mark Ready to Ship',
            shipped: 'Mark as Shipped',
            delivered: 'Mark as Delivered',
            cancelled: 'Cancel Order'
        };
        return texts[status] || status;
    };

    // SVG Icons
    const ExpandIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
        </svg>
    );

    const CollapseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
        </svg>
    );

    const EditIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
        </svg>
    );

    const CancelIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    );

    const paymentStatus = getPaymentStatus(order.payment);
    const nextStatusOptions = getNextStatusOptions();

    return (
        <>
            {/* Main Table Row */}
            <tr className={`order-row ${isExpanded ? 'expanded' : ''}`}>
                <td className="order-id">#{order.id}</td>
                <td className="customer-info">
                    <div className="customer-name">{order.user?.name || 'N/A'}</div>
                    <div className="customer-email">{order.user?.email || 'N/A'}</div>
                </td>
                <td className="amount">
                    <span className="amount-value">₱{order.total_amount?.toLocaleString()}</span>
                </td>
                <td className="status">
                    {getStatusBadge(order.status)}
                </td>
                <td className="date">
                    <div className="date-main">{formatDate(order.created_at)}</div>
                    <div className="date-time">{formatTime(order.created_at)}</div>
                </td>
                <td className="payment-status">
                    <span className={`status-badge ${paymentStatus.class}`}>
                        {paymentStatus.text}
                    </span>
                </td>
                <td className="actions">
                    <div className="action-buttons">
                        {nextStatusOptions.length > 0 && (
                            <button 
                                onClick={() => setShowStatusModal(true)}
                                className="action-btn edit-btn"
                                title="Update status"
                                disabled={processing}
                            >
                                <EditIcon />
                            </button>
                        )}
                        {order.status !== 'cancelled' && (
                            <button 
                                onClick={() => setShowCancelModal(true)}
                                className="action-btn cancel-btn"
                                title="Cancel order"
                                disabled={processing}
                            >
                                <CancelIcon />
                            </button>
                        )}
                    </div>
                </td>
                <td className="expand">
                    <button 
                        onClick={() => onToggleExpand(order.id)}
                        className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
                    >
                        {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                    </button>
                </td>
            </tr>

            {/* Expanded Details Row */}
            {isExpanded && (
                <tr className="details-row">
                    <td colSpan={8}>
                        <OrderDetailsCard 
                            order={order}
                        />
                    </td>
                </tr>
            )}

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Update Order Status</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowStatusModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Update status for Order #{order.id}</p>
                            <div className="status-options">
                                {nextStatusOptions.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`status-option-btn status-${status}`}
                                        disabled={processing}
                                    >
                                        {getStatusButtonText(status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => setShowStatusModal(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Cancel Order</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowCancelModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Cancel Order #{order.id} for {order.user?.name}</p>
                            <div className="form-group">
                                <label>Reason for Cancellation *</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Please provide a reason for cancelling this order..."
                                    rows="3"
                                    required
                                />
                                <small>This reason will be visible to the customer.</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                className="btn-secondary"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCancelOrder}
                                className="btn-reject"
                                disabled={processing || !cancelReason.trim()}
                            >
                                {processing ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTableRow;