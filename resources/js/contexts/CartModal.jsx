// C:\Users\User\Desktop\RiderX\resources\js\contexts\CartModal.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currencyFormatter';

const CartModal = ({ isOpen, onClose }) => {
    const { items, total, itemCount, updateQuantity, removeItem } = useCart();

    if (!isOpen) return null;

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(index, newQuantity);
    };

    const handleRemoveItem = (index) => {
        removeItem(index);
    };

    return (
        <div className="cart-modal-overlay center-modal" onClick={onClose}>
            <div className="cart-modal center-cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h3>Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h3>
                    <button className="cart-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="cart-modal-body">
                    {items.length === 0 ? (
                        <div className="empty-cart-message">
                            <div className="empty-cart-icon">🛒</div>
                            <p>Your cart is empty</p>
                            <button className="btn-continue-shopping" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-modal-items">
                                {items.map((item, index) => (
                                    <div key={index} className="cart-modal-item">
                                        <div className="cart-modal-item-content">
                                            <div className="cart-item-image">
                                                <img src={item.image} alt={item.productName} />
                                            </div>
                                            
                                            <div className="cart-item-details">
                                                <h4>{item.productName}</h4>
                                                <p className="item-variant">{item.variantColor}</p>
                                                <p className="item-size">Size: {item.size}</p>
                                                <p className="item-price">{formatPrice(item.price)}</p>
                                            </div>

                                            <div className="cart-item-controls-section">
                                                <div className="cart-item-quantity-full">
                                                    <label>Qty:</label>
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
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="cart-item-total-section">
                                                    <span className="cart-item-total-price">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                    <button 
                                                        className="remove-item-btn-simple"
                                                        onClick={() => handleRemoveItem(index)}
                                                        title="Remove item"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M10 11v6"/>
                                                            <path d="M14 11v6"/>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                                            <path d="M3 6h18"/>
                                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-modal-summary">
                                <div className="summary-row">
                                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="summary-row total-row">
                                    <strong>Total</strong>
                                    <strong>{formatPrice(total)}</strong>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="cart-modal-actions">
                            <button className="btn-continue-shopping" onClick={onClose}>
                                Continue Shopping
                            </button>
                            <Link to="/cart" className="btn-view-full-cart" onClick={onClose}>
                                View Full Cart
                            </Link>
                            <button className="btn-checkout">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;