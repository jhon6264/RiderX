import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currencyFormatter';

const CheckoutPage = () => {
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        shipping_address: '',
        contact_number: '',
        gcash_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [error, setError] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
    const [activeTab, setActiveTab] = useState('shipping');

    // Auto-scroll to top when tab changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleScreenshotChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setScreenshot(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setScreenshotPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const uploadScreenshot = async () => {
        if (!screenshot || !payment) return;

        setUploadingScreenshot(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const formData = new FormData();
            formData.append('payment_id', payment.payment_id);
            formData.append('screenshot', screenshot);

            const response = await fetch('/payments/upload-screenshot', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setPayment(prev => ({ ...prev, screenshot_uploaded: true }));
                // Don't clear screenshot state - keep it visible with X icon
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError('Failed to upload screenshot: ' + err.message);
        } finally {
            setUploadingScreenshot(false);
        }
    };

    const removeScreenshot = () => {
        setScreenshot(null);
        setScreenshotPreview(null);
        setPayment(prev => ({ ...prev, screenshot_uploaded: false }));
    };

    const getAnotherQR = async () => {
        if (!payment) return;

        setLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const response = await fetch('/payments/another-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    payment_id: payment.payment_id
                })
            });

            const data = await response.json();

            if (data.success) {
                setPayment(prev => ({ ...prev, qr_number: data.qr_number }));
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError('Failed to get another QR code: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async () => {
         console.log('Cart items structure:', items); // Add this line

    if (!formData.shipping_address || !formData.contact_number || !formData.gcash_number) {
        setError('Please fill in all fields');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // FIX: Use the correct property name for variant ID
        const orderItems = items.map(item => ({
            product_variant_id: item.variantId || item.productVariantId || item.id, // Try multiple possible property names
            quantity: item.quantity
        }));

        console.log('Sending order items:', orderItems); // Debug log

        const orderResponse = await fetch('/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({
                items: orderItems,
                shipping_address: formData.shipping_address,
                contact_number: formData.contact_number
            })
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            console.error('Order response error:', errorText);
            throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }

        const orderData = await orderResponse.json();

        if (!orderData.success) {
            throw new Error(orderData.message);
        }

        setOrder(orderData);

        const paymentResponse = await fetch('/payments/generate-qr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                order_id: orderData.order_id,
                gcash_number: formData.gcash_number
            })
        });

        if (!paymentResponse.ok) {
            throw new Error(`HTTP error! status: ${paymentResponse.status}`);
        }

        const paymentData = await paymentResponse.json();

        if (!paymentData.success) {
            throw new Error(paymentData.message);
        }

        setPayment(paymentData);
        setActiveTab('payment');

    } catch (err) {
        console.error('Order creation error:', err);
        setError(err.message || 'Failed to create order. Please try again.');
    } finally {
        setLoading(false);
    }
};

    const handleCheckout = async (e) => {
        e.preventDefault();
        await createOrder();
    };

    const handlePaymentComplete = () => {
        alert('Thank you for your order! We will verify your payment and ship your items soon.');
        clearCart();
        navigate('/');
    };

    const getQRNumber = (qrNumber) => {
        const qrNumbers = {
            1: '09389129262',
            2: '09123219087', 
            3: '09768767890'
        };
        return qrNumbers[qrNumber] || 'Number not available';
    };

    if (items.length === 0 && !order) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Add some items to your cart first.</p>
                        <button onClick={() => navigate('/cart')} className="btn-primary">
                            Go to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <div className="progress-steps">
                        <div className={`step ${activeTab === 'shipping' ? 'active' : ''} ${order ? 'completed' : ''}`}>
                            <div className="step-number">1</div>
                            <span className="step-label">Shipping</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`step ${activeTab === 'payment' ? 'active' : ''} ${payment ? 'completed' : ''}`}>
                            <div className="step-number">2</div>
                            <span className="step-label">Payment</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`step ${activeTab === 'confirmation' ? 'active' : ''} ${payment?.screenshot_uploaded ? 'completed' : ''}`}>
                            <div className="step-number">3</div>
                            <span className="step-label">Confirmation</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                    <form onSubmit={handleCheckout} className="checkout-form">
                        <div className="checkout-content">
                            <div className="shipping-section">
                                <h2>Shipping Information</h2>
                                
                                <div className="form-group">
                                    <label>Shipping Address *</label>
                                    <textarea
                                        name="shipping_address"
                                        value={formData.shipping_address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your complete shipping address"
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 09171234567"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Your GCash Number *</label>
                                    <input
                                        type="tel"
                                        name="gcash_number"
                                        value={formData.gcash_number}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 09171234567"
                                        required
                                    />
                                    <small className="form-hint">This is where you'll send the payment from</small>
                                </div>
                            </div>

                            <div className="order-summary-section">
                                <div className="order-summary-card">
                                    <h3>Order Summary</h3>
                                    
                                    <div className="order-items">
                                        {items.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <div className="item-info">
                                                    <span className="item-name">{item.productName}</span>
                                                    <span className="item-variant">{item.color}</span>
                                                    <span className="item-quantity">Qty: {item.quantity}</span>
                                                </div>
                                                <span className="item-total">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="summary-totals">
                                        <div className="total-row">
                                            <span>Subtotal:</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Shipping:</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="total-row grand-total">
                                            <span>Total:</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="checkout-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Continue to Payment'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && payment && (
                    <div className="payment-tab">
                        <div className="tab-header">
                            <h2>Payment Method</h2>
                            <p>Pay with GCash using one of our QR codes</p>
                        </div>

                        <div className="payment-content">
                            <div className="payment-grid">
                                {/* Left Column - Instructions */}
                                <div className="payment-left">
                                    <div className="instruction-card">
                                        <h3>Payment Instructions</h3>
                                        <ol className="steps-list">
                                            <li>Open your GCash app</li>
                                            <li>Tap "Scan QR" or "Send Money"</li>
                                            <li>Scan the QR code or send to the displayed number</li>
                                            <li>Enter the exact amount: <strong>{formatPrice(order.total_amount)}</strong></li>
                                            <li>Take a screenshot of your successful payment</li>
                                            <li>Proceed to confirmation to upload your proof</li>
                                        </ol>
                                    </div>
                                </div>

                                {/* Right Column - QR Code */}
                                <div className="payment-right">
                                    <div className="qr-display-section">
                                        <div className="qr-header">
                                            <h4>QR Code #{payment.qr_number}</h4>
                                        </div>
                                        
                                        <div className="qr-container">
                                            <div className="qr-card">
                                                <img 
                                                    src={`/img/QRcodes/qr${payment.qr_number}.jpg`} 
                                                    alt={`GCash QR Code ${payment.qr_number}`}
                                                    className="qr-image"
                                                />
                                                <div className="qr-details">
                                                    <div className="qr-amount">
                                                        Amount: <strong>{formatPrice(order.total_amount)}</strong>
                                                    </div>
                                                    <div className="qr-number-display">
                                                        GCash: <strong>{getQRNumber(payment.qr_number)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons aligned with QR code only */}
                                        <div className="qr-actions-group">
                                            <button 
                                                onClick={() => setActiveTab('shipping')}
                                                className="btn-black"
                                            >
                                                Back
                                            </button>
                                            <button 
                                                onClick={getAnotherQR}
                                                className="another-qr-btn"
                                                disabled={loading}
                                            >
                                                {loading ? 'Loading...' : 'Try Another QR'}
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab('confirmation')}
                                                className="btn-primary"
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Tab */}
                {activeTab === 'confirmation' && payment && (
                    <div className="confirmation-tab">
                        <div className="tab-header">
                            <h2>Order Confirmation</h2>
                            <p>Upload your payment proof to complete your order</p>
                        </div>

                        <div className="confirmation-content">
                            <div className="confirmation-grid">
                                {/* Left Column - Top: Order Details, Bottom: Warning */}
                                <div className="confirmation-left">
                                    <div className="order-details-card">
                                        <h3>Order Details</h3>
                                        <div className="details-list">
                                            <div className="detail-item">
                                                <span>Total Amount:</span>
                                                <strong>{formatPrice(order.total_amount)}</strong>
                                            </div>
                                            <div className="detail-item">
                                                <span>QR Code Used:</span>
                                                <strong>#{payment.qr_number} ({getQRNumber(payment.qr_number)})</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="warning-card">
                                        <div className="warning-icon">⚠️</div>
                                        <div className="warning-content">
                                            <h4>Important Notice</h4>
                                            <p>
                                                <strong>Your order will not be shipped if:</strong>
                                            </p>
                                            <ul>
                                                <li>The payment amount does not match the order total exactly</li>
                                                <li>No payment proof is uploaded</li>
                                                <li>The payment is sent to the wrong GCash number</li>
                                            </ul>
                                            <p className="warning-note">
                                                Please ensure you send the exact amount of <strong>{formatPrice(order.total_amount)}</strong> 
                                                to the correct GCash number shown during payment.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Top: Screenshot, Bottom: Actions */}
                                <div className="confirmation-right">
                                    <div className="screenshot-section">
                                        <h3>Upload Payment Proof</h3>
                                        <p className="section-description">
                                            Upload a clear screenshot of your successful GCash payment for verification
                                        </p>
                                        
                                        <div className="upload-area">
                                            {!screenshotPreview ? (
                                                <div className="upload-placeholder">
                                                    <input
                                                        type="file"
                                                        id="screenshot"
                                                        accept="image/*"
                                                        onChange={handleScreenshotChange}
                                                        className="file-input"
                                                    />
                                                    <label htmlFor="screenshot" className="upload-label">
                                                        <div className="upload-icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect width="18" height="18" x="3" y="3" rx="2"/>
                                                                <path d="M8 12h8"/>
                                                                <path d="M12 8v8"/>
                                                            </svg>
                                                        </div>
                                                        <div>Click to upload payment screenshot</div>
                                                    </label>
                                                    <p className="upload-hint">JPG, PNG, GIF, WebP (Max 5MB)</p>
                                                </div>
                                            ) : (
                                                <div className="screenshot-preview">
                                                    <div className="preview-header">
                                                        <h5>Screenshot Preview</h5>
                                                        <button 
                                                            onClick={removeScreenshot}
                                                            className="remove-icon-btn"
                                                            title="Remove screenshot"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M18 6 6 18"/>
                                                                <path d="m6 6 12 12"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="preview-image-container">
                                                        <img src={screenshotPreview} alt="Screenshot preview" />
                                                    </div>
                                                    {!payment.screenshot_uploaded && (
                                                        <div className="preview-actions">
                                                            <button 
                                                                onClick={uploadScreenshot}
                                                                disabled={uploadingScreenshot}
                                                                className="btn-primary"
                                                            >
                                                                {uploadingScreenshot ? 'Uploading...' : 'Confirm Upload'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="confirmation-actions">
                                        <button 
                                            onClick={() => setActiveTab('payment')}
                                            className="btn-black"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={handlePaymentComplete}
                                            className="btn-primary complete-btn"
                                            disabled={!payment.screenshot_uploaded}
                                        >
                                            {payment.screenshot_uploaded 
                                                ? " Complete Order" 
                                                : " Upload Payment Proof First"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;