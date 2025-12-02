import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OrderTableRow from './OrderTableRow';

const AdminOrders = () => {
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filter state (only for /all page)
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Determine active tab from URL
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/pending')) return 'pending';
        if (path.includes('/to-ship')) return 'to-ship';
        if (path.includes('/shipped')) return 'shipped';
        if (path.includes('/delivered')) return 'delivered';
        if (path.includes('/cancelled')) return 'cancelled';
        return 'all';
    };

    const activeTab = getActiveTab();

    // Enhanced stats state for all tabs
    const [enhancedStats, setEnhancedStats] = useState({
        // For /all page
        total_orders: 0,
        pending_orders: 0,
        to_ship_orders: 0,
        shipped_orders: 0,
        delivered_orders: 0,
        total_revenue: 0,
        pending_percentage: 0,
        to_ship_percentage: 0,
        shipped_percentage: 0,
        delivered_percentage: 0,
        
        // For individual tabs
        tab_stats: {
            total: 0,
            today: 0,
            avg_time: 0,
            urgent: 0
        },
        
        // Insights for /all page
        insights: {
            success_rate: 0,
            avg_processing_time: 0,
            todays_activity: 0
        }
    });

    useEffect(() => {
        fetchOrders();
    }, [activeTab, currentPage, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        
        try {
            let endpoint = '/admin/orders/all';
            let params = new URLSearchParams({
                page: currentPage,
                per_page: itemsPerPage
            });

            // Add filters only for /all page
            if (activeTab === 'all') {
                if (searchTerm) {
                    params.append('search', searchTerm);
                }
                if (statusFilter !== 'all') {
                    params.append('status', statusFilter);
                }
            } else {
                endpoint = `/admin/orders/${activeTab}`;
            }

            const response = await fetch(`${endpoint}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            // Handle authentication redirects
            if (response.status === 401 || response.redirected) {
                window.location.href = '/admin/login';
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setOrders(data.orders || []);
                setTotalPages(data.total_pages || Math.ceil(data.orders?.length / itemsPerPage) || 1);
                
                // Update enhanced stats
                updateEnhancedStats(data.stats || {}, data.orders || []);
            } else {
                setError(data.message || 'Failed to load orders');
            }
        } catch (err) {
            console.error('❌ Fetch orders error:', err);
            setError('Failed to load orders: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateEnhancedStats = (stats, orders) => {
        if (activeTab === 'all') {
            // Calculate percentages for /all page
            const total = stats.total_orders || orders.length;
            const pending = stats.pending_orders || 0;
            const toShip = stats.to_ship_orders || 0;
            const shipped = stats.shipped_orders || 0;
            const delivered = stats.delivered_orders || 0;
            
            setEnhancedStats({
                ...enhancedStats,
                total_orders: total,
                pending_orders: pending,
                to_ship_orders: toShip,
                shipped_orders: shipped,
                delivered_orders: delivered,
                total_revenue: stats.total_revenue || 0,
                pending_percentage: total > 0 ? Math.round((pending / total) * 100) : 0,
                to_ship_percentage: total > 0 ? Math.round((toShip / total) * 100) : 0,
                shipped_percentage: total > 0 ? Math.round((shipped / total) * 100) : 0,
                delivered_percentage: total > 0 ? Math.round((delivered / total) * 100) : 0,
                insights: {
                    success_rate: total > 0 ? Math.round((delivered / total) * 100) : 0,
                    avg_processing_time: stats.avg_processing_time || 24,
                    todays_activity: stats.todays_activity || 0
                }
            });
        } else {
            // Calculate stats for specific tab
            const today = new Date().toISOString().split('T')[0];
            const todayCount = orders.filter(order => 
                order.created_at && order.created_at.startsWith(today)
            ).length;
            
            const urgentCount = orders.filter(order => {
                if (!order.created_at) return false;
                const orderDate = new Date(order.created_at);
                const now = new Date();
                const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
                return hoursDiff > 48;
            }).length;
            
            setEnhancedStats({
                ...enhancedStats,
                tab_stats: {
                    total: orders.length,
                    today: todayCount,
                    avg_time: getAverageTimeForTab(orders),
                    urgent: urgentCount
                }
            });
        }
    };

    const getAverageTimeForTab = (orders) => {
        if (orders.length === 0) return 0;
        
        // Calculate average hours since creation for this tab
        const now = new Date();
        const totalHours = orders.reduce((sum, order) => {
            if (!order.created_at) return sum;
            const orderDate = new Date(order.created_at);
            const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
            return sum + hoursDiff;
        }, 0);
        
        return Math.round(totalHours / orders.length);
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        // Refresh stats after update
        setTimeout(() => fetchOrders(), 500);
    };

    const handleOrderCancelled = (orderId) => {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        // Refresh stats after cancellation
        setTimeout(() => fetchOrders(), 500);
    };

    const toggleRowExpand = (orderId) => {
        setExpandedRow(expandedRow === orderId ? null : orderId);
    };

    const getPageTitle = () => {
        const titles = {
            'all': 'All Orders',
            'pending': 'Pending Orders',
            'to-ship': 'Ready to Ship',
            'shipped': 'Shipped Orders',
            'delivered': 'Delivered Orders',
            'cancelled': 'Cancelled Orders'
        };
        return titles[activeTab] || 'Orders';
    };

    const getPageDescription = () => {
        const descriptions = {
            'all': 'View and manage all customer orders',
            'pending': 'Orders awaiting payment verification',
            'to-ship': 'Orders ready for shipping',
            'shipped': 'Orders currently in transit',
            'delivered': 'Successfully delivered orders',
            'cancelled': 'Cancelled and refunded orders'
        };
        return descriptions[activeTab] || 'Manage customer orders';
    };

    const getStatCardsForTab = () => {
        if (activeTab === 'all') {
            return [
                {
                    key: 'total',
                    title: 'Total Orders',
                    value: enhancedStats.total_orders,
                    type: 'total',
                    percentage: null,
                    health: 'neutral',
                    tooltip: 'All orders in system'
                },
                {
                    key: 'pending',
                    title: 'Pending',
                    value: enhancedStats.pending_orders,
                    type: 'pending',
                    percentage: enhancedStats.pending_percentage,
                    health: enhancedStats.pending_percentage < 20 ? 'good' : enhancedStats.pending_percentage < 40 ? 'average' : 'poor',
                    tooltip: 'Awaiting payment verification'
                },
                {
                    key: 'ready',
                    title: 'Ready to Ship',
                    value: enhancedStats.to_ship_orders,
                    type: 'ready',
                    percentage: enhancedStats.to_ship_percentage,
                    health: enhancedStats.to_ship_percentage > 30 ? 'good' : enhancedStats.to_ship_percentage > 10 ? 'average' : 'poor',
                    tooltip: 'Ready for shipping'
                },
                {
                    key: 'shipped',
                    title: 'Shipped',
                    value: enhancedStats.shipped_orders,
                    type: 'shipped',
                    percentage: enhancedStats.shipped_percentage,
                    health: enhancedStats.shipped_percentage > 40 ? 'good' : enhancedStats.shipped_percentage > 20 ? 'average' : 'poor',
                    tooltip: 'Currently in transit'
                },
                {
                    key: 'delivered',
                    title: 'Delivered',
                    value: enhancedStats.delivered_orders,
                    type: 'delivered',
                    percentage: enhancedStats.delivered_percentage,
                    health: enhancedStats.delivered_percentage > 60 ? 'good' : enhancedStats.delivered_percentage > 40 ? 'average' : 'poor',
                    tooltip: 'Successfully delivered'
                },
                {
                    key: 'revenue',
                    title: 'Total Revenue',
                    value: `₱${enhancedStats.total_revenue?.toLocaleString() || '0'}`,
                    type: 'revenue',
                    percentage: null,
                    health: 'neutral',
                    tooltip: 'Total revenue from delivered orders'
                }
            ];
        }

        // Stats for specific tabs
        const tabStats = enhancedStats.tab_stats;
        const baseCards = [
            {
                key: 'total',
                title: `Total ${getPageTitle()}`,
                value: tabStats.total,
                type: activeTab,
                percentage: null,
                health: 'neutral',
                tooltip: `Total ${getPageTitle().toLowerCase()}`
            },
            {
                key: 'today',
                title: 'Today',
                value: tabStats.today,
                type: activeTab,
                percentage: tabStats.total > 0 ? Math.round((tabStats.today / tabStats.total) * 100) : 0,
                health: tabStats.today > 0 ? 'good' : 'average',
                tooltip: `${getPageTitle()} created today`
            }
        ];

        if (activeTab === 'pending') {
            baseCards.push(
                {
                    key: 'avg_time',
                    title: 'Avg Age',
                    value: `${tabStats.avg_time}h`,
                    type: activeTab,
                    percentage: null,
                    health: tabStats.avg_time < 24 ? 'good' : tabStats.avg_time < 48 ? 'average' : 'poor',
                    tooltip: 'Average hours pending'
                },
                {
                    key: 'urgent',
                    title: 'Urgent',
                    value: tabStats.urgent,
                    type: activeTab,
                    percentage: tabStats.total > 0 ? Math.round((tabStats.urgent / tabStats.total) * 100) : 0,
                    health: tabStats.urgent === 0 ? 'good' : tabStats.urgent < 5 ? 'average' : 'poor',
                    tooltip: 'Pending >48 hours'
                }
            );
        } else if (activeTab === 'to-ship') {
            baseCards.push(
                {
                    key: 'avg_time',
                    title: 'Avg Ready Time',
                    value: `${tabStats.avg_time}h`,
                    type: activeTab,
                    percentage: null,
                    health: tabStats.avg_time < 12 ? 'good' : tabStats.avg_time < 24 ? 'average' : 'poor',
                    tooltip: 'Average hours ready to ship'
                },
                {
                    key: 'urgent',
                    title: 'Priority',
                    value: tabStats.urgent,
                    type: activeTab,
                    percentage: tabStats.total > 0 ? Math.round((tabStats.urgent / tabStats.total) * 100) : 0,
                    health: tabStats.urgent === 0 ? 'good' : tabStats.urgent < 5 ? 'average' : 'poor',
                    tooltip: 'Ready >24 hours'
                }
            );
        } else if (activeTab === 'shipped') {
            baseCards.push(
                {
                    key: 'avg_time',
                    title: 'Avg Transit',
                    value: `${tabStats.avg_time}h`,
                    type: activeTab,
                    percentage: null,
                    health: tabStats.avg_time < 48 ? 'good' : tabStats.avg_time < 72 ? 'average' : 'poor',
                    tooltip: 'Average hours in transit'
                },
                {
                    key: 'urgent',
                    title: 'Expected Today',
                    value: tabStats.urgent,
                    type: activeTab,
                    percentage: null,
                    health: 'neutral',
                    tooltip: 'Expected deliveries today'
                }
            );
        } else {
            baseCards.push(
                {
                    key: 'avg_time',
                    title: 'Avg Delivery',
                    value: `${tabStats.avg_time}h`,
                    type: activeTab,
                    percentage: null,
                    health: tabStats.avg_time < 72 ? 'good' : tabStats.avg_time < 96 ? 'average' : 'poor',
                    tooltip: 'Average hours to delivery'
                },
                {
                    key: 'urgent',
                    title: 'Success Rate',
                    value: `${tabStats.urgent}%`,
                    type: activeTab,
                    percentage: null,
                    health: tabStats.urgent > 95 ? 'good' : tabStats.urgent > 90 ? 'average' : 'poor',
                    tooltip: 'Delivery success rate'
                }
            );
        }

        return baseCards;
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Render skeleton loading
    const renderSkeleton = () => (
        <div className="admin-orders">
            {/* Modern Header Skeleton */}
            <div className="modern-header">
                <div className="header-content">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-subtitle"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="enhanced-stats-grid">
                {[...Array(activeTab === 'all' ? 6 : 4)].map((_, i) => (
                    <div key={i} className="stat-card-enhanced skeleton-stat">
                        <div className="stat-header">
                            <div className="skeleton skeleton-stat-title"></div>
                            <div className="skeleton skeleton-health"></div>
                        </div>
                        <div className="skeleton skeleton-stat-number"></div>
                        <div className="progress-container">
                            <div className="skeleton skeleton-progress"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Insights Skeleton (only for /all) */}
            {activeTab === 'all' && (
                <div className="stats-insights skeleton-insights">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="insight-item">
                            <div className="skeleton skeleton-insight-label"></div>
                            <div className="skeleton skeleton-insight-value"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Controls Skeleton (only for /all) */}
            {activeTab === 'all' && (
                <div className="modern-controls">
                    <div className="controls-left">
                        <div className="skeleton skeleton-search"></div>
                    </div>
                    <div className="controls-right">
                        <div className="skeleton skeleton-filter"></div>
                        <div className="skeleton skeleton-results"></div>
                    </div>
                </div>
            )}

            {/* Table Skeleton */}
            <div className="modern-table-container">
                <div className="loading-modern">
                    <div className="loading-spinner"></div>
                    <span>Loading orders...</span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return renderSkeleton();
    }

    return (
        <div className="admin-orders">
            {/* Modern Header */}
            <div className="modern-header">
                <div className="header-content">
                    <h1>{getPageTitle()}</h1>
                    <p>{getPageDescription()}</p>
                </div>
            </div>

            {/* ENHANCED Stats Grid */}
            <div className="enhanced-stats-grid">
                {getStatCardsForTab().map(stat => (
                    <div 
                        key={stat.key} 
                        className={`stat-card-enhanced ${stat.type} ${activeTab === 'all' ? 'clickable' : ''}`}
                        onClick={() => activeTab === 'all' && handleStatClick(stat.key)}
                        title={stat.tooltip}
                    >
                        <div className="stat-header">
                            <div className="stat-title">{stat.title}</div>
                            {stat.health !== 'neutral' && (
                                <div className={`health-indicator ${stat.health}`}>
                                    {stat.percentage ? `${stat.percentage}%` : '—'}
                                </div>
                            )}
                        </div>
                        <div className="stat-number">{stat.value}</div>
                        {stat.percentage !== null && (
                            <div className="progress-container">
                                <div 
                                    className={`progress-bar ${stat.type}`}
                                    style={{ width: `${stat.percentage}%` }}
                                >
                                    <span className="progress-text">{stat.percentage}%</span>
                                </div>
                            </div>
                        )}
                        <div className="stat-tooltip">{stat.tooltip}</div>
                    </div>
                ))}
            </div>

            {/* Stats Insights Bar (Only for /all page) */}
            {activeTab === 'all' && (
                <div className="stats-insights">
                    <div className="insight-item">
                        <span className="insight-label">Success Rate:</span>
                        <span className={`insight-value ${enhancedStats.insights.success_rate >= 95 ? 'good' : enhancedStats.insights.success_rate >= 90 ? 'average' : 'poor'}`}>
                            {enhancedStats.insights.success_rate}%
                        </span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Avg Processing Time:</span>
                        <span className={`insight-value ${enhancedStats.insights.avg_processing_time < 24 ? 'good' : enhancedStats.insights.avg_processing_time < 48 ? 'average' : 'poor'}`}>
                            {enhancedStats.insights.avg_processing_time}h
                        </span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Today's Activity:</span>
                        <span className={`insight-value ${enhancedStats.insights.todays_activity > 10 ? 'good' : enhancedStats.insights.todays_activity > 5 ? 'average' : 'poor'}`}>
                            {enhancedStats.insights.todays_activity} orders
                        </span>
                    </div>
                </div>
            )}

            {/* Modern Controls (Only for /all page) */}
            {activeTab === 'all' ? (
                <div className="modern-controls">
                    <div className="controls-left">
                        <div className="search-modern">
                            <div className="search-icon">🔍</div>
                            <input
                                type="text"
                                className="search-input-modern"
                                placeholder="Search by order ID, customer name, or email..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="controls-right">
                        <select 
                            className="filter-modern"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="to-ship">Ready to Ship</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="results-modern">
                            {orders.length} orders
                        </div>
                    </div>
                </div>
            ) : (
                <div className="modern-controls">
                    <div className="controls-left"></div>
                    <div className="controls-right">
                        <div className="results-modern">
                            {orders.length} {getPageTitle().toLowerCase()}
                        </div>
                    </div>
                </div>
            )}

            {/* Modern Table Container */}
            <div className="modern-table-container">
                {error ? (
                    <div className="error-modern">
                        <div className="error-icon">⚠️</div>
                        <div className="error-content">
                            <h4>Unable to load orders</h4>
                            <p>{error}</p>
                            <button onClick={fetchOrders} className="btn-modern-secondary">
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-modern">
                        <div className="empty-icon">
                            {activeTab === 'pending' ? '⏳' : 
                             activeTab === 'to-ship' ? '📦' :
                             activeTab === 'shipped' ? '🚚' :
                             activeTab === 'delivered' ? '✅' :
                             activeTab === 'cancelled' ? '❌' : '📋'}
                        </div>
                        <h3>No orders found</h3>
                        <p>
                            {activeTab === 'all' && searchTerm 
                                ? `No orders matching "${searchTerm}"`
                                : activeTab === 'all' && statusFilter !== 'all'
                                ? `No ${statusFilter} orders`
                                : `No ${getPageTitle().toLowerCase()} at the moment`
                            }
                        </p>
                        {activeTab === 'all' && (searchTerm || statusFilter !== 'all') && (
                            <button 
                                className="btn-modern-secondary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Actions</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <OrderTableRow
                                    key={order.id}
                                    order={order}
                                    isExpanded={expandedRow === order.id}
                                    onToggleExpand={toggleRowExpand}
                                    onStatusUpdate={handleStatusUpdate}
                                    onOrderCancelled={handleOrderCancelled}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
                <div className="pagination-modern">
                    <button 
                        className="pagination-btn-modern"
                        disabled={currentPage === 1}
                        onClick={prevPage}
                    >
                        ← Previous
                    </button>
                    
                    <div className="pagination-numbers-modern">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`pagination-number-modern ${currentPage === page ? 'active' : ''}`}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        className="pagination-btn-modern"
                        disabled={currentPage === totalPages}
                        onClick={nextPage}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

// Helper function for stat card clicks (only for /all page)
const handleStatClick = (statKey) => {
    // This would filter the table based on stat click
    // For now, just log it
    console.log(`Clicked stat: ${statKey}`);
    // In a real implementation, you would filter the orders here
};

export default AdminOrders;