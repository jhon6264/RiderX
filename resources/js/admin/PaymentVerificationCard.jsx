import React, { useState } from 'react';

const PaymentVerificationCard = ({ payment, onVerified, onRejected, showActions = true }) => {
    const [verifying, setVerifying] = useState(false);
    const [showVerifyForm, setShowVerifyForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [showScreenshotModal, setShowScreenshotModal] = useState(false);
    const [formData, setFormData] = useState({
        actual_amount_received: payment.order?.total_amount || 0,
        notes: '',
        rejection_reason: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setError('');

        try {
            const response = await fetch('/admin/payments/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    payment_id: payment.id,
                    actual_amount_received: parseFloat(formData.actual_amount_received),
                    notes: formData.notes
                })
            });

            const data = await response.json();

            if (data.success) {
                onVerified(payment.id);
                setShowVerifyForm(false);
                setFormData({
                    actual_amount_received: payment.order?.total_amount || 0,
                    notes: '',
                    rejection_reason: ''
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to verify payment');
        } finally {
            setVerifying(false);
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();
        if (!formData.rejection_reason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }

        setVerifying(true);
        setError('');

        try {
            const response = await fetch('/admin/payments/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    payment_id: payment.id,
                    rejection_reason: formData.rejection_reason
                })
            });

            const data = await response.json();

            if (data.success) {
                onRejected(payment.id);
                setShowRejectForm(false);
                setFormData({
                    actual_amount_received: payment.order?.total_amount || 0,
                    notes: '',
                    rejection_reason: ''
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to reject payment');
        } finally {
            setVerifying(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { text: 'Pending', class: 'pending' },
            verified: { text: 'Approved', class: 'verified' },
            rejected: { text: 'Rejected', class: 'rejected' },
            failed: { text: 'Failed', class: 'failed' }
        };

        const config = statusConfig[status] || { text: status, class: 'pending' };
        
        return (
            <span className={`payment-status ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const expectedAmount = payment.order?.total_amount || 0;
    const hasScreenshot = payment.screenshot_path;

    return (
        <div className="payment-card">
            {/* Screenshot Modal */}
            {showScreenshotModal && (
                <div className="modal-overlay" onClick={() => setShowScreenshotModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Payment Screenshot</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowScreenshotModal(false)}
                            >
                                ×
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

            <div className="payment-header">
                <div className="payment-info">
                    <h3>Payment #{payment.id}</h3>
                    <span className="payment-date">
                        Created: {formatDate(payment.created_at)}
                    </span>
                    {payment.verified_at && (
                        <span className="payment-date">
                            {payment.status === 'verified' ? 'Approved' : 'Rejected'}: {formatDate(payment.verified_at)} by {payment.verified_by}
                        </span>
                    )}
                </div>
                <div className="payment-amount">
                    <span className="expected-amount">₱{expectedAmount.toLocaleString()}</span>
                    {getStatusBadge(payment.status)}
                </div>
            </div>

            <div className="payment-details">
                <div className="detail-section">
                    <h4>Order Information</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="label">Order ID:</span>
                            <span className="value">#{payment.order_id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Customer:</span>
                            <span className="value">{payment.order?.user?.name || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Customer Email:</span>
                            <span className="value">{payment.order?.user?.email || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Reference No:</span>
                            <span className="value">{payment.reference_number}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>GCash Details</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="label">GCash Number:</span>
                            <span className="value">{payment.gcash_number || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">QR Code Used:</span>
                            <span className="value">#{payment.qr_number}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Expected Amount:</span>
                            <span className="value expected">₱{expectedAmount.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Payment Proof:</span>
                            <span className="value">
                                {hasScreenshot ? (
                                    <button 
                                        onClick={() => setShowScreenshotModal(true)}
                                        className="screenshot-btn"
                                    >
                                        📷 View Screenshot
                                    </button>
                                ) : (
                                    <span className="no-proof">No screenshot uploaded</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {payment.notes && (
                    <div className="detail-section">
                        <h4>Admin Notes</h4>
                        <div className="notes-content">
                            {payment.notes}
                        </div>
                    </div>
                )}

                <div className="detail-section">
                    <h4>Order Items</h4>
                    <div className="order-items">
                        {payment.order?.items?.map((item, index) => (
                            <div key={index} className="order-item">
                                <span className="item-name">
                                    {item.variant?.product?.name || 'Product'} - {item.variant?.color || 'Standard'}
                                </span>
                                <span className="item-quantity">Qty: {item.quantity}</span>
                                <span className="item-price">₱{item.price?.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons - Only show for pending payments */}
            {showActions && payment.status === 'pending' && !showVerifyForm && !showRejectForm && (
                <div className="payment-actions">
                    <button 
                        onClick={() => setShowVerifyForm(true)}
                        className="verify-btn primary"
                    >
                        Approve Payment
                    </button>
                    <button 
                        onClick={() => setShowRejectForm(true)}
                        className="verify-btn secondary"
                    >
                        Reject Payment
                    </button>
                </div>
            )}

            {/* Verify Form */}
            {showVerifyForm && (
                <div className="verification-form">
                    <h4>Approve Payment</h4>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label>Actual Amount Received *</label>
                            <input
                                type="number"
                                name="actual_amount_received"
                                value={formData.actual_amount_received}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                required
                                placeholder="Enter actual amount received"
                            />
                            <small>
                                Expected: ₱{expectedAmount.toLocaleString()}
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Add any notes about this payment..."
                                rows="3"
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowVerifyForm(false);
                                    setError('');
                                }}
                                className="cancel-btn"
                                disabled={verifying}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="confirm-btn"
                                disabled={verifying}
                            >
                                {verifying ? 'Approving...' : 'Confirm Approval'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reject Form */}
            {showRejectForm && (
                <div className="verification-form">
                    <h4>Reject Payment</h4>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleReject}>
                        <div className="form-group">
                            <label>Rejection Reason *</label>
                            <textarea
                                name="rejection_reason"
                                value={formData.rejection_reason}
                                onChange={handleInputChange}
                                placeholder="Explain why this payment is being rejected..."
                                rows="3"
                                required
                            />
                            <small>
                                This reason will be visible to the customer.
                            </small>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button"
                                onClick={() => {
                                    setShowRejectForm(false);
                                    setError('');
                                }}
                                className="cancel-btn"
                                disabled={verifying}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="reject-btn"
                                disabled={verifying}
                            >
                                {verifying ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PaymentVerificationCard;