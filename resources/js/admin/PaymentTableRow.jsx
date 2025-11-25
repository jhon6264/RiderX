import React, { useState } from 'react';
import PaymentDetailsCard from './PaymentDetailsCard';

const PaymentTableRow = ({ 
    payment, 
    isExpanded, 
    onToggleExpand, 
    onVerified, 
    onRejected, 
    showActions 
}) => {
    const [showScreenshotModal, setShowScreenshotModal] = useState(false);
    const [processing, setProcessing] = useState(false);

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
            verified: { text: 'Approved', class: 'status-approved' },
            rejected: { text: 'Rejected', class: 'status-rejected' },
            failed: { text: 'Failed', class: 'status-rejected' }
        };

        const config = statusConfig[status] || { text: status, class: 'status-pending' };
        
        return (
            <span className={`status-badge ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const hasScreenshot = payment.screenshot_path;

    // SVG Icons
    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
        </svg>
    );

    const XIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    );

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

    const handleApprove = async () => {
        if (processing) return;
        
        setProcessing(true);
        try {
            const response = await fetch('/admin/payments/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    payment_id: payment.id,
                    actual_amount_received: payment.order?.total_amount || 0,
                    notes: 'Payment approved via quick action'
                })
            });

            const data = await response.json();

            if (data.success) {
                onVerified(payment.id);
            } else {
                alert('Failed to approve payment: ' + data.message);
            }
        } catch (err) {
            console.error('Approve payment error:', err);
            alert('Failed to approve payment');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (processing) return;
        
        const reason = prompt('Please enter rejection reason:');
        if (!reason) return;

        setProcessing(true);
        try {
            const response = await fetch('/admin/payments/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    payment_id: payment.id,
                    rejection_reason: reason
                })
            });

            const data = await response.json();

            if (data.success) {
                onRejected(payment.id);
            } else {
                alert('Failed to reject payment: ' + data.message);
            }
        } catch (err) {
            console.error('Reject payment error:', err);
            alert('Failed to reject payment');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            {/* Main Table Row */}
            <tr className={`payment-row ${isExpanded ? 'expanded' : ''}`}>
                <td className="payment-id">#{payment.id}</td>
                <td className="customer-info">
                    <div className="customer-name">{payment.order?.user?.name || 'N/A'}</div>
                    <div className="customer-email">{payment.order?.user?.email || 'N/A'}</div>
                </td>
                <td className="amount">
                    <span className="amount-value">₱{(payment.order?.total_amount || 0).toLocaleString()}</span>
                </td>
                <td className="status">
                    {getStatusBadge(payment.status)}
                </td>
                <td className="date">
                    <div className="date-main">{formatDate(payment.created_at)}</div>
                    <div className="date-time">{formatTime(payment.created_at)}</div>
                </td>
                <td className="screenshot">
                    {hasScreenshot ? (
                        <button 
                            onClick={() => setShowScreenshotModal(true)}
                            className="screenshot-btn"
                            title="View payment screenshot"
                        >
                            View Screenshot
                        </button>
                    ) : (
                        <span className="no-screenshot">No image</span>
                    )}
                </td>
                
                {/* Actions Column */}
                {showActions && (
                    <td className="actions">
                        <div className="action-buttons">
                            <button 
                                onClick={handleApprove}
                                className="action-btn approve-btn"
                                title="Approve payment"
                                disabled={processing}
                            >
                                <CheckIcon />
                            </button>
                            <button 
                                onClick={handleReject}
                                className="action-btn reject-btn"
                                title="Reject payment"
                                disabled={processing}
                            >
                                <XIcon />
                            </button>
                        </div>
                    </td>
                )}

                {/* Expand Button */}
                <td className="expand">
                    <button 
                        onClick={() => onToggleExpand(payment.id)}
                        className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
                    >
                        {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                    </button>
                </td>
            </tr>

            {/* Expanded Details Row */}
            {isExpanded && (
                <tr className="details-row">
                    <td colSpan={showActions ? 8 : 7}>
                        <PaymentDetailsCard 
                            payment={payment}
                            onVerified={onVerified}
                            onRejected={onRejected}
                            showActions={showActions}
                        />
                    </td>
                </tr>
            )}

            {/* Screenshot Modal */}
            {showScreenshotModal && (
                <div className="modal-overlay" onClick={() => setShowScreenshotModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Payment Screenshot - Order #{payment.order_id}</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowScreenshotModal(false)}
                            >
                                <XIcon />
                            </button>
                        </div>
                        <div className="modal-body">
                            {hasScreenshot ? (
                                <img 
                                    src={`/uploads/payment-screenshots/${payment.screenshot_path}`}
                                    alt="Payment screenshot"
                                    className="screenshot-full"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder-image.jpg';
                                    }}
                                />
                            ) : (
                                <div className="no-screenshot">
                                    <div className="no-screenshot-icon">📷</div>
                                    <p>No screenshot available</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => setShowScreenshotModal(false)}
                                className="btn-primary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaymentTableRow;