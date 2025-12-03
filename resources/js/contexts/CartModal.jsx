// resources/js/contexts/CartModal.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currencyFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const CartModal = ({ isOpen, onClose }) => {
    const { items, total, itemCount, updateQuantity, removeItem } = useCart();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(index, newQuantity);
    };

    const handleRemoveItem = (index) => {
        // Animate removal first, then remove from state
        removeItem(index);
    };

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            y: 20,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8
            }
        },
        exit: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            x: -20,
            scale: 0.9 
        },
        visible: (i) => ({ 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: { 
                delay: i * 0.05,
                duration: 0.3,
                ease: "easeOut"
            }
        }),
        exit: {
            opacity: 0,
            x: 20,
            height: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            transition: { 
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const quantityVariants = {
        tap: { scale: 0.9 },
        hover: { scale: 1.1 }
    };

    const buttonHover = {
        scale: 1.02,
        transition: { duration: 0.2 }
    };

    const buttonTap = {
        scale: 0.98,
        transition: { duration: 0.1 }
    };

    const bounceVariants = {
        initial: { scale: 1 },
        bounce: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 0.3,
                times: [0, 0.5, 1]
            }
        }
    };

    if (!isOpen) return null;

    // Use portal to render modal at body level for proper z-index
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="cart-modal-overlay center-modal"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div 
                        className="cart-modal center-cart-modal"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <motion.div 
                            className="cart-modal-header"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3>
                                Your Cart 
                                <motion.span 
                                    className="cart-count-badge"
                                    key={itemCount}
                                    variants={bounceVariants}
                                    initial="initial"
                                    animate="bounce"
                                >
                                    {itemCount}
                                </motion.span>
                                {itemCount === 1 ? ' item' : ' items'}
                            </h3>
                            <motion.button 
                                className="cart-modal-close"
                                onClick={onClose}
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close cart"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </motion.button>
                        </motion.div>

                        {/* Body */}
                        <div className="cart-modal-body">
                            {items.length === 0 ? (
                                <motion.div 
                                    className="empty-cart-message"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <motion.div 
                                        className="empty-cart-icon"
                                        animate={{ 
                                            y: [0, -5, 0],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        🛒
                                    </motion.div>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Your cart is empty
                                    </motion.p>
                                    <motion.p
                                        className="empty-cart-subtitle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Add some riding gear to get started!
                                    </motion.p>
                                    <motion.button 
                                        className="btn-continue-shopping"
                                        onClick={onClose}
                                        whileHover={buttonHover}
                                        whileTap={buttonTap}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Continue Shopping
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="cart-modal-items">
                                        <AnimatePresence initial={false}>
                                            {items.map((item, index) => (
                                                <motion.div 
                                                    key={`${item.productId}-${item.variantId}-${item.size}`}
                                                    className="cart-modal-item"
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    custom={index}
                                                    layout
                                                    layoutId={`cart-item-${index}`}
                                                >
                                                    <div className="cart-modal-item-content">
                                                        {/* Product Image */}
                                                        <motion.div 
                                                            className="cart-item-image"
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.productName}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/80x80/f8f9fa/666666?text=Product';
                                                                }}
                                                            />
                                                        </motion.div>
                                                        
                                                        {/* Product Details */}
                                                        <div className="cart-item-details">
                                                            <motion.h4
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: index * 0.05 + 0.1 }}
                                                            >
                                                                {item.productName}
                                                            </motion.h4>
                                                            <motion.p 
                                                                className="item-variant"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: index * 0.05 + 0.15 }}
                                                            >
                                                                {item.variantColor}
                                                            </motion.p>
                                                            <motion.p 
                                                                className="item-size"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: index * 0.05 + 0.2 }}
                                                            >
                                                                Size: {item.size}
                                                            </motion.p>
                                                            <motion.p 
                                                                className="item-price"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: index * 0.05 + 0.25 }}
                                                            >
                                                                {formatPrice(item.price)}
                                                            </motion.p>
                                                        </div>

                                                        {/* Quantity Controls */}
                                                        <div className="cart-item-controls-section">
                                                            <div className="cart-item-quantity-full">
                                                                <label>Qty:</label>
                                                                <motion.div 
                                                                    className="quantity-controls"
                                                                    whileHover={{ scale: 1.02 }}
                                                                >
                                                                    <motion.button 
                                                                        className="quantity-btn"
                                                                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                                                        disabled={item.quantity <= 1}
                                                                        variants={quantityVariants}
                                                                        whileHover="hover"
                                                                        whileTap="tap"
                                                                        aria-label="Decrease quantity"
                                                                    >
                                                                        −
                                                                    </motion.button>
                                                                    <motion.span 
                                                                        className="quantity-display"
                                                                        key={item.quantity}
                                                                        initial={{ scale: 0.8 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 500 }}
                                                                    >
                                                                        {item.quantity}
                                                                    </motion.span>
                                                                    <motion.button 
                                                                        className="quantity-btn"
                                                                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                                                        variants={quantityVariants}
                                                                        whileHover="hover"
                                                                        whileTap="tap"
                                                                        aria-label="Increase quantity"
                                                                    >
                                                                        +
                                                                    </motion.button>
                                                                </motion.div>
                                                            </div>
                                                            
                                                            {/* Total & Remove */}
                                                            <div className="cart-item-total-section">
                                                                <motion.span 
                                                                    className="cart-item-total-price"
                                                                    key={`${item.price * item.quantity}`}
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 400 }}
                                                                >
                                                                    {formatPrice(item.price * item.quantity)}
                                                                </motion.span>
                                                                <motion.button 
                                                                    className="remove-item-btn-simple"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    title="Remove item"
                                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    aria-label="Remove item from cart"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M10 11v6"/>
                                                                        <path d="M14 11v6"/>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                                                        <path d="M3 6h18"/>
                                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                                    </svg>
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Cart Summary */}
                                    <motion.div 
                                        className="cart-modal-summary"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: items.length * 0.05 + 0.1 }}
                                    >
                                        <div className="summary-row">
                                            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <motion.div 
                                            className="summary-row total-row"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: items.length * 0.05 + 0.2 }}
                                        >
                                            <strong>Total</strong>
                                            <strong>{formatPrice(total)}</strong>
                                        </motion.div>
                                    </motion.div>
                                </>
                            )}
                        </div>

                        {/* Footer - Only show when cart has items */}
                        {items.length > 0 && (
                            <motion.div 
                                className="cart-modal-footer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: items.length * 0.05 + 0.3 }}
                            >
                                <div className="cart-modal-actions">
                                    <motion.button 
                                        className="btn-continue-shopping"
                                        onClick={onClose}
                                        whileHover={buttonHover}
                                        whileTap={buttonTap}
                                    >
                                        Continue Shopping
                                    </motion.button>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link 
                                            to="/cart" 
                                            className="btn-view-full-cart" 
                                            onClick={onClose}
                                        >
                                            View Full Cart
                                        </Link>
                                    </motion.div>
                                    <motion.button 
                                        className="btn-checkout"
                                        whileHover={buttonHover}
                                        whileTap={buttonTap}
                                        onClick={() => {
                                            onClose();
                                            // In a real app, you would navigate to checkout
                                            // navigate('/checkout');
                                        }}
                                    >
                                        Proceed to Checkout
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CartModal;