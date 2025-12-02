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

    useEffect(() => {
        // Update the active tab underline position
        const updateTabUnderline = () => {
            const tabsContainer = document.querySelector('.filter-tabs');
            if (tabsContainer) {
                const activeIndex = ['all', 'pending', 'to_ship', 'shipped', 'delivered'].indexOf(activeFilter);
                tabsContainer.setAttribute('data-active-tab', activeIndex);
            }
        };

        updateTabUnderline();
    }, [activeFilter]);

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
            cancelled: '#6b7280' // Gray - Cancelled
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

    const getStatusIcon = (status) => {
        const icons = {
            pending: '⏰',
            to_ship: '📦',
            shipped: '🚚',
            delivered: '✅',
            cancelled: '❌'
        };
        return icons[status] || '📋';
    };

    const filterOrders = (orders) => {
        if (activeFilter === 'all') return orders;
        return orders.filter(order => order.status === activeFilter);
    };

    // Count orders for each status
    const getOrderCount = (status) => {
        if (status === 'all') return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    const filteredOrders = filterOrders(orders);

    if (loading) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
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
                {/* Header Section */}
                <div className="page-header">
                    <div className="header-content">
                        <h1>Order History</h1>
                        <p>Track and manage your purchases</p>
                    </div>
                    <div className="orders-count">
                        <span className="count">{filteredOrders.length}</span>
                        <span className="label">{filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
                    </div>
                </div>

                {/* Minimalist Filter Tabs with Count Badges */}
                <div className="filter-tabs">
                    <button 
                        className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Orders
                        <span className="tab-badge">{getOrderCount('all')}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('pending')}
                    >
                        To Pay
                        <span className="tab-badge">{getOrderCount('pending')}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeFilter === 'to_ship' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('to_ship')}
                    >
                        To Ship
                        <span className="tab-badge">{getOrderCount('to_ship')}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeFilter === 'shipped' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('shipped')}
                    >
                        Shipped
                        <span className="tab-badge">{getOrderCount('shipped')}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('delivered')}
                    >
                        Delivered
                        <span className="tab-badge">{getOrderCount('delivered')}</span>
                    </button>
                </div>

                {/* Orders Grid */}
                <div className="orders-grid">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No orders found</h3>
                            <p>
                                {activeFilter === 'all' 
                                    ? "You haven't placed any orders yet."
                                    : `You don't have any ${getStatusText(activeFilter).toLowerCase()} orders.`
                                }
                            </p>
                            <Link to="/" className="primary-btn">
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
                                getStatusIcon={getStatusIcon}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Modern Order Card Component
const OrderCard = ({ order, getStatusColor, getStatusText, getStatusIcon }) => {
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

    const getMainProductName = () => {
        if (order.items && order.items.length > 0) {
            return order.items[0].product?.name || 'Product';
        }
        return 'Product';
    };

    return (
        <div className="order-card">
            {/* Card Header */}
            <div className="card-header">
                <div className="order-meta">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                </div>
                <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                >
                    <span className="status-icon">{getStatusIcon(order.status)}</span>
                    {getStatusText(order.status)}
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
                <div className="product-preview">
                    <div className="product-image">
                        <img 
                            src={getFirstProductImage()} 
                            alt="Product" 
                            className="preview-img"
                        />
                        {getProductCount() > 1 && (
                            <div className="items-count">+{getProductCount() - 1}</div>
                        )}
                    </div>
                    <div className="product-info">
                        <h4 className="product-name">{getMainProductName()}</h4>
                        <p className="product-meta">{getProductCount()} items • {formatPrice(order.total_amount)}</p>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="card-footer">
                <div className="order-actions">
                    <Link to={`/orders/${order.id}`} className="view-details-btn">
                        View Details
                    </Link>
                    {order.status === 'delivered' && (
                        <button className="reorder-btn">
                            Buy Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;