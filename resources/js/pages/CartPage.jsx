// C:\Users\User\Desktop\RiderX\resources\js\pages\CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currencyFormatter';

const CartPage = () => {
    const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="cart-header">
                        <h1>Shopping Cart</h1>
                    </div>
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <Link to="/" className="btn-continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleQuantityChange = (index, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(index, newQuantity);
    };

    const handleRemoveItem = (index) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            removeItem(index);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
                    <button 
                        className="clear-cart-btn"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear your entire cart?')) {
                                clearCart();
                            }
                        }}
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items-section">
                        <div className="cart-items">
                            {items.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="cart-item-main-content">
                                        <div className="item-image">
                                            <img src={item.image} alt={item.productName} />
                                        </div>
                                        
                                        <div className="item-details">
                                            <h3 className="item-name">{item.productName}</h3>
                                            <p className="item-variant">{item.variantColor}</p>
                                            <p className="item-size">Size: {item.size}</p>
                                            <p className="item-price">{formatPrice(item.price)}</p>
                                        </div>

                                        <div className="cart-item-controls-full">
                                            <div className="cart-item-quantity-expanded">
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
                                            
                                            <div className="cart-item-total-expanded">
                                                <span className="cart-item-final-price">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                                <button 
                                                    className="remove-btn-simple"
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
                    </div>

                    <div className="order-summary-section">
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            
                            <div className="summary-row">
                                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>Calculated at checkout</span>
                            </div>
                            
                            <div className="summary-divider"></div>
                            
                            <div className="summary-row total-row">
                                <strong>Total</strong>
                                <strong>{formatPrice(total)}</strong>
                            </div>

                            
                                <Link to="/checkout" className="checkout-btn">
                                    Proceed to Checkout
                                </Link>

                            <Link to="/" className="continue-shopping-link">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;