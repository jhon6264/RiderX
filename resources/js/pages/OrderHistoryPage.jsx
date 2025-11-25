import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currencyFormatter';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/orders', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setOrders(data.orders);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#f59e0b', // Yellow - To Pay
            to_ship: '#3b82f6', // Blue - To Ship
            shipped: '#8b5cf6', // Purple - Shipped
            delivered: '#10b981', // Green - Delivered
            cancelled: '#ef4444' // Red - Cancelled
        };
        return statusColors[status] || '#6b7280';
    };

    const getStatusText = (status) => {
        const statusText = {
            pending: 'To Pay',
            to_ship: 'To Ship',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };
        return statusText[status] || status;
    };

    const filterOrders = (orders) => {
        if (activeFilter === 'all') return orders;
        return orders.filter(order => order.status === activeFilter);
    };

    const filteredOrders = filterOrders(orders);

    if (loading) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="loading">Loading your orders...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="error-message">
                        {error}
                        <button onClick={fetchOrders} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-history-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Orders</h1>
                    <p>Track and manage your purchases</p>
                </div>

                {/* Status Filters */}
                <div className="order-filters">
                    <button 
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Orders
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('pending')}
                    >
                        To Pay
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'to_ship' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('to_ship')}
                    >
                        To Ship
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('shipped')}
                    >
                        Shipped
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('delivered')}
                    >
                        Delivered
                    </button>
                </div>

                {/* Orders List */}
                <div className="orders-list">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-orders">
                            <div className="empty-icon">📦</div>
                            <h3>No orders found</h3>
                            <p>
                                {activeFilter === 'all' 
                                    ? "You haven't placed any orders yet."
                                    : `You don't have any ${getStatusText(activeFilter).toLowerCase()} orders.`
                                }
                            </p>
                            <Link to="/" className="btn-primary">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                getStatusColor={getStatusColor}
                                getStatusText={getStatusText}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Order Card Component
const OrderCard = ({ order, getStatusColor, getStatusText }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get first product image for preview
    const getFirstProductImage = () => {
        if (order.items && order.items.length > 0) {
            const firstItem = order.items[0];
            return firstItem.variant?.image_url || '/images/placeholder-product.jpg';
        }
        return '/images/placeholder-product.jpg';
    };

    const getProductCount = () => {
        if (!order.items) return 0;
        return order.items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="order-card">
            <div className="order-card-header">
                <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                </div>
                <div 
                    className="order-status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                >
                    {getStatusText(order.status)}
                </div>
            </div>

            <div className="order-card-body">
                <div className="order-preview">
                    <div className="product-preview">
                        <img 
                            src={getFirstProductImage()} 
                            alt="Product" 
                            className="preview-image"
                        />
                        {getProductCount() > 1 && (
                            <div className="product-count">+{getProductCount() - 1} more</div>
                        )}
                    </div>
                    
                    <div className="order-summary">
                        <p className="item-count">{getProductCount()} items</p>
                        <p className="order-total">{formatPrice(order.total_amount)}</p>
                    </div>
                </div>

                <div className="order-actions">
                    <Link to={`/orders/${order.id}`} className="view-details-btn">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;