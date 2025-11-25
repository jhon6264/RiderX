import React, { useState } from 'react';

const PaymentDetailsCard = ({ payment, onVerified, onRejected, showActions }) => {
    const [showVerifyForm, setShowVerifyForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [formData, setFormData] = useState({
        actual_amount_received: payment.order?.total_amount || 0,
        notes: '',
        rejection_reason: ''
    });
    const [verifying, setVerifying] = useState(false);
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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
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
            setError('Failed to verify payment: ' + err.message);
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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
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
            setError('Failed to reject payment: ' + err.message);
        } finally {
            setVerifying(false);
        }
    };

    const expectedAmount = payment.order?.total_amount || 0;

    // SVG Icons
    const XIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    );

    return (
        <div className="payment-details-card">
            <div className="details-grid">
                <div className="detail-section">
                    <h4>Order Information</h4>
                    <div className="detail-list">
                        <div className="detail-item">
                            <strong>Order ID:</strong> #{payment.order_id}
                        </div>
                        <div className="detail-item">
                            <strong>Customer:</strong> {payment.order?.user?.name || 'N/A'}
                        </div>
                        <div className="detail-item">
                            <strong>Email:</strong> {payment.order?.user?.email || 'N/A'}
                        </div>
                        <div className="detail-item">
                            <strong>Reference No:</strong> {payment.reference_number}
                        </div>
                        <div className="detail-item">
                            <strong>Status:</strong> 
                            <span className={`status-badge status-${payment.status}`}>
                                {payment.status === 'verified' ? 'Approved' : 
                                 payment.status === 'pending' ? 'Pending' : 
                                 payment.status === 'rejected' ? 'Rejected' : 
                                 payment.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>GCash Details</h4>
                    <div className="detail-list">
                        <div className="detail-item">
                            <strong>GCash Number:</strong> {payment.gcash_number || 'Not provided'}
                        </div>
                        <div className="detail-item">
                            <strong>QR Code Used:</strong> #{payment.qr_number}
                        </div>
                        <div className="detail-item">
                            <strong>Expected Amount:</strong> ₱{expectedAmount.toLocaleString()}
                        </div>
                        <div className="detail-item">
                            <strong>Screenshot:</strong> 
                            {payment.screenshot_path ? (
                                <a 
                                    href={`/uploads/payment-screenshots/${payment.screenshot_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="screenshot-link"
                                >
                                    View Proof
                                </a>
                            ) : (
                                <span className="no-screenshot">No screenshot</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Order Items</h4>
                    <div className="order-items-list">
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

                {payment.notes && (
                    <div className="detail-section">
                        <h4>Admin Notes</h4>
                        <div className="notes-content">
                            {payment.notes}
                        </div>
                    </div>
                )}

                {payment.verified_by && (
                    <div className="detail-section">
                        <h4>Verification Details</h4>
                        <div className="detail-list">
                            <div className="detail-item">
                                <strong>Verified By:</strong> {payment.verified_by}
                            </div>
                            <div className="detail-item">
                                <strong>Verified At:</strong> {new Date(payment.verified_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Forms */}
            {showActions && payment.status === 'pending' && (
                <div className="action-forms">
                    {!showVerifyForm && !showRejectForm ? (
                        <div className="quick-actions">
                            <button 
                                onClick={() => setShowVerifyForm(true)}
                                className="btn-primary"
                            >
                                Approve Payment
                            </button>
                            <button 
                                onClick={() => setShowRejectForm(true)}
                                className="btn-secondary"
                            >
                                Reject Payment
                            </button>
                        </div>
                    ) : showVerifyForm ? (
                        <div className="verification-form">
                            <h4>Approve Payment</h4>
                            {error && <div className="error-message">{error}</div>}
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
                                    />
                                    <small>Expected: ₱{expectedAmount.toLocaleString()}</small>
                                </div>
                                <div className="form-group">
                                    <label>Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Add any notes about this payment verification..."
                                    />
                                </div>
                                <div className="form-actions">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowVerifyForm(false);
                                            setError('');
                                        }}
                                        className="btn-secondary"
                                        disabled={verifying}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn-primary"
                                        disabled={verifying}
                                    >
                                        {verifying ? 'Approving...' : 'Confirm Approval'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="verification-form">
                            <h4>Reject Payment</h4>
                            {error && <div className="error-message">{error}</div>}
                            <form onSubmit={handleReject}>
                                <div className="form-group">
                                    <label>Rejection Reason *</label>
                                    <textarea
                                        name="rejection_reason"
                                        value={formData.rejection_reason}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                        placeholder="Explain why this payment is being rejected..."
                                    />
                                    <small>This reason will be visible to the customer.</small>
                                </div>
                                <div className="form-actions">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setShowRejectForm(false);
                                            setError('');
                                        }}
                                        className="btn-secondary"
                                        disabled={verifying}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn-reject"
                                        disabled={verifying}
                                    >
                                        {verifying ? 'Rejecting...' : 'Confirm Rejection'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentDetailsCard;