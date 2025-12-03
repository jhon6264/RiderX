// resources/js/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currencyFormatter';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
    const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
    const [removingIndex, setRemovingIndex] = useState(null);

    // Optimized animation variants
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.2 }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: { duration: 0.15 }
        }
    };

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        updateQuantity(index, newQuantity);
    };

    const handleRemoveItem = async (index) => {
        setRemovingIndex(index);
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 200));
        removeItem(index);
        setRemovingIndex(null);
    };

    const handleClearCart = () => {
        if (window.confirm('Clear all items from your cart?')) {
            clearCart();
        }
    };

    if (items.length === 0) {
        return (
            <motion.div 
                className="cart-page"
                initial="initial"
                animate="animate"
                variants={pageVariants}
            >
                <div className="cart-container">
                    <div className="cart-header">
                        <h1>Your Cart</h1>
                    </div>
                    
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some riding gear to get started!</p>
                        <Link to="/" className="btn-continue-shopping">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="cart-page"
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            <div className="cart-container">
                {/* Header */}
                <div className="cart-header">
                    <div className="header-content">
                        <h1>Your Cart</h1>
                        <span className="cart-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                    </div>
                    <button 
                        className="clear-cart-btn"
                        onClick={handleClearCart}
                    >
                        Clear All
                    </button>
                </div>

                {/* Main Content */}
                <div className="cart-content">
                    {/* Cart Items Section */}
                    <div className="cart-items-section">
                        <AnimatePresence initial={false}>
                            <div className="cart-items">
                                {items.map((item, index) => (
                                    <motion.div 
                                        key={`${item.productId}-${item.variantId}-${item.size}`}
                                        className={`cart-item ${removingIndex === index ? 'removing' : ''}`}
                                        variants={itemVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="cart-item-main-content">
                                            {/* Product Image */}
                                            <div className="item-image">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.productName}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/100x100/f8f9fa/666666?text=Product';
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="item-details">
                                                <h3 className="item-name">{item.productName}</h3>
                                                <p className="item-variant">{item.variantColor}</p>
                                                <p className="item-size">Size: {item.size}</p>
                                                <p className="item-price">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>

                                        {/* Controls Section */}
                                        <div className="cart-item-controls">
                                            <div className="quantity-section">
                                                <label>Quantity:</label>
                                                <div className="quantity-controls">
                                                    <button 
                                                        className="quantity-btn"
                                                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity-display">{item.quantity}</span>
                                                    <button 
                                                        className="quantity-btn"
                                                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                                        disabled={item.quantity >= 99}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="item-actions">
                                                <span className="item-total">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => handleRemoveItem(index)}
                                                    title="Remove item"
                                                    disabled={removingIndex === index}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Section - Professional Design */}
                    <div className="order-summary-section">
                        <div className="order-summary">
                            <h2 className="summary-title">Order Summary</h2>
                            
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                
                                <div className="summary-row shipping-row">
                                    <span>Shipping</span>
                                    <span className="free">FREE</span>
                                </div>
                                
                                <div className="summary-row tax-row">
                                    <span>Estimated Tax</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                
                                <div className="summary-divider"></div>
                                
                                <div className="summary-row total-row">
                                    <strong>Total</strong>
                                    <strong className="total-amount">{formatPrice(total)}</strong>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link to="/checkout" className="checkout-btn">
                                Proceed to Checkout
                            </Link>

                            {/* Continue Shopping */}
                            <Link to="/" className="continue-shopping">
                                ← Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="trust-badges">
                                <div className="trust-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="trust-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M8 12l3 3 5-5"/>
                                    </svg>
                                    <span>30-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;