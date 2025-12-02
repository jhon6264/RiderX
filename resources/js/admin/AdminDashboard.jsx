import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartPeriod, setChartPeriod] = useState('week');

    useEffect(() => {
        fetchDashboardData();
    }, [chartPeriod]); // Refetch when period changes

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/admin/dashboard?period=${chartPeriod}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                credentials: 'include',
                cache: 'no-cache'
            });
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            const responseText = await response.text();
            
            if (!contentType || !contentType.includes('application/json')) {
                if (responseText.includes('login') || responseText.includes('Login')) {
                    throw new Error('Authentication required. Please log in again.');
                }
                
                if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
                    throw new Error('Server error. Please check Laravel logs.');
                }
                
                throw new Error(`Expected JSON but got ${contentType}`);
            }
            
            // Parse JSON
            const data = JSON.parse(responseText);
            
            if (data.success) {
                setStats({
                    stats: {
                        total_orders: data.stats?.total_orders || 0,
                        pending_payments: data.stats?.pending_payments || 0,
                        total_products: data.stats?.total_products || 0,
                        revenue: data.stats?.revenue || 0,
                        new_customers: data.stats?.new_customers || 0,
                        returning_customers: data.stats?.returning_customers || 0,
                        low_stock_items: data.stats?.low_stock_items || 0,
                        today_orders: data.stats?.today_orders || 0,
                        today_revenue: data.stats?.today_revenue || 0,
                        average_order_value: data.stats?.average_order_value || 0
                    },
                    salesData: data.sales_data || getFallbackSalesData(chartPeriod),
                    topProducts: data.top_products || [],
                    recentOrders: data.recent_orders || [],
                    lowStockAlerts: data.low_stock_alerts || [],
                    paymentSummary: data.payment_summary || getFallbackPaymentSummary(),
                    orderStatusDistribution: data.order_status_distribution || getFallbackOrderStatusDistribution()
                });
            } else {
                setError(data.message || 'Failed to load dashboard data');
                setFallbackData(chartPeriod);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            
            if (error.message.includes('Authentication') || error.message.includes('login')) {
                setError('Session expired. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 3000);
            } else {
                setError(error.message || 'Network error. Please check your connection.');
            }
            
            setFallbackData(chartPeriod);
        } finally {
            setLoading(false);
        }
    };

    // Fallback data functions
    const getFallbackSalesData = (period) => {
        switch(period) {
            case 'month':
                return Array.from({length: 4}, (_, i) => ({
                    day: `Week ${i + 1}`,
                    sales: 0,
                    orders: 0
                }));
            case 'year':
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.slice(-12).map(month => ({
                    day: month,
                    sales: 0,
                    orders: 0
                }));
            default: // week
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return days.map(day => ({
                    day,
                    sales: 0,
                    orders: 0
                }));
        }
    };

    const getFallbackTopProducts = () => {
        return [];
    };

    const getFallbackRecentOrders = () => {
        return [];
    };

    const getFallbackLowStockAlerts = () => {
        return [];
    };

    const getFallbackPaymentSummary = () => {
        return {
            total: 0,
            pending: 0,
            verified: 0,
            failed: 0,
            rejected: 0,
            verification_rate: 0
        };
    };

    const getFallbackOrderStatusDistribution = () => {
        return {
            total: 0,
            pending: 0,
            to_ship: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
            completion_rate: 0
        };
    };

    const setFallbackData = (period) => {
        setStats({
            stats: {
                total_orders: 0,
                pending_payments: 0,
                total_products: 0,
                revenue: 0,
                new_customers: 0,
                returning_customers: 0,
                low_stock_items: 0,
                today_orders: 0,
                today_revenue: 0,
                average_order_value: 0
            },
            salesData: getFallbackSalesData(period),
            topProducts: getFallbackTopProducts(),
            recentOrders: getFallbackRecentOrders(),
            lowStockAlerts: getFallbackLowStockAlerts(),
            paymentSummary: getFallbackPaymentSummary(),
            orderStatusDistribution: getFallbackOrderStatusDistribution()
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const chartVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.2
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return '#f59e0b';
            case 'processing': 
            case 'to_ship': return '#3b82f6';
            case 'shipped': return '#0ea5e9';
            case 'delivered': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'to_ship': return 'To Ship';
            case 'pending': return 'Pending';
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'delivered': return 'Delivered';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    // Skeleton Loading Component
    const SkeletonLoader = () => {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="stats-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="stat-card skeleton-card">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-info">
                                <div className="skeleton-stat"></div>
                                <div className="skeleton-label"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section Skeleton */}
                <div className="charts-section">
                    <div className="chart-container skeleton-chart">
                        <div className="skeleton-chart-header">
                            <div className="skeleton-chart-title"></div>
                            <div className="skeleton-period-buttons">
                                <div className="skeleton-period-btn"></div>
                                <div className="skeleton-period-btn"></div>
                                <div className="skeleton-period-btn"></div>
                            </div>
                        </div>
                        <div className="skeleton-chart-content"></div>
                    </div>
                    <div className="chart-container skeleton-chart">
                        <div className="skeleton-chart-header">
                            <div className="skeleton-chart-title"></div>
                        </div>
                        <div className="skeleton-chart-content"></div>
                    </div>
                </div>

                {/* Tables Section Skeleton */}
                <div className="tables-section">
                    <div className="table-container skeleton-table">
                        <div className="skeleton-table-header">
                            <div className="skeleton-table-title"></div>
                            <div className="skeleton-table-link"></div>
                        </div>
                        <div className="skeleton-table-content">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="skeleton-table-row"></div>
                            ))}
                        </div>
                    </div>
                    <div className="table-container skeleton-table">
                        <div className="skeleton-table-header">
                            <div className="skeleton-table-title"></div>
                            <div className="skeleton-table-link"></div>
                        </div>
                        <div className="skeleton-table-content">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="skeleton-table-row"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions Skeleton */}
                <div className="quick-actions skeleton-actions">
                    <div className="skeleton-actions-title"></div>
                    <div className="skeleton-action-buttons">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton-action-btn"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error && (!stats || !stats.stats)) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Overview of your store performance and analytics</p>
                </div>
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h3>Unable to Load Dashboard</h3>
                    <p>{error}</p>
                    <button onClick={fetchDashboardData} className="action-btn primary">
                        Retry Loading Data
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="admin-dashboard"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Dashboard Header */}
            <motion.div className="dashboard-header" variants={itemVariants}>
                <h1>Admin Dashboard</h1>
                <p>Overview of your store performance and analytics</p>
                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠️</span>
                        <span className="error-text">{error}</span>
                        <button onClick={fetchDashboardData} className="refresh-btn">Refresh</button>
                    </div>
                )}
            </motion.div>

            {/* Stats Grid - NO ICONS */}
           <motion.div className="stats-grid" variants={containerVariants}>
    {/* Total Orders */}
    <motion.div 
        className="stat-card" 
        variants={itemVariants}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
        <div className="stat-info">
            <h3>{stats.stats.total_orders.toLocaleString()}</h3>
            <p>TOTAL ORDERS</p>
            <div className="stat-change positive">
                +{stats.stats.today_orders} today
            </div>
        </div>
        <Link to="/admin/orders/all" className="stat-link">View</Link>
    </motion.div>

                   {/* Pending Payments */}
    <motion.div 
        className="stat-card warning" 
        variants={itemVariants}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
        <div className="stat-info">
            <h3>{stats.stats.pending_payments}</h3>
            <p>PENDING PAYMENTS</p>
            {stats.stats.pending_payments > 0 && (
                <div className="stat-change negative">
                    Needs attention
                </div>
            )}
        </div>
        <Link to="/admin/payments/pending" className="stat-link">Verify</Link>
    </motion.div>

               {/* Total Revenue */}
    <motion.div 
        className="stat-card success" 
        variants={itemVariants}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
        <div className="stat-info">
            <h3>{formatCurrency(stats.stats.revenue)}</h3>
            <p>TOTAL REVENUE</p>
            <div className="stat-change positive">
                +{formatCurrency(stats.stats.today_revenue)} today
            </div>
        </div>
    </motion.div>

                   {/* Active Customers */}
    <motion.div 
        className="stat-card" 
        variants={itemVariants}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
        <div className="stat-info">
            <h3>{(stats.stats.new_customers + stats.stats.returning_customers).toLocaleString()}</h3>
            <p>ACTIVE CUSTOMERS</p>
            <div className="stat-change positive">
                +{stats.stats.new_customers} new
            </div>
        </div>
        <Link to="/admin/users" className="stat-link">Manage</Link>
    </motion.div>
</motion.div>

            {/* Charts Section */}
            <motion.div className="charts-section" variants={containerVariants}>
                {/* Sales Chart */}
                <motion.div 
                    className="chart-container" 
                    variants={chartVariants}
                    whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="chart-header">
                        <h2>Sales Overview</h2>
                        <div className="chart-period">
                            <button 
                                className={`period-btn ${chartPeriod === 'week' ? 'active' : ''}`}
                                onClick={() => setChartPeriod('week')}
                            >
                                Week
                            </button>
                            <button 
                                className={`period-btn ${chartPeriod === 'month' ? 'active' : ''}`}
                                onClick={() => setChartPeriod('month')}
                            >
                                Month
                            </button>
                            <button 
                                className={`period-btn ${chartPeriod === 'year' ? 'active' : ''}`}
                                onClick={() => setChartPeriod('year')}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        {stats.salesData && stats.salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
                                <LineChart data={stats.salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="day" 
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280' }}
                                    />
                                    <YAxis 
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280' }}
                                        tickFormatter={(value) => `₱${value.toLocaleString()}`}
                                    />
                                    <Tooltip 
                                        formatter={(value, name) => {
                                            if (name === 'sales') return [`₱${value.toLocaleString()}`, 'Sales'];
                                            if (name === 'orders') return [value, 'Orders'];
                                            return [value, name];
                                        }}
                                        labelStyle={{ color: '#1f2937', fontWeight: '500' }}
                                        contentStyle={{ 
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="sales" 
                                        name="Sales (PHP)"
                                        stroke="#e63946"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#e63946' }}
                                        activeDot={{ r: 6, fill: '#c1121f' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="orders" 
                                        name="Orders"
                                        stroke="#1a1a1a" 
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#1a1a1a' }}
                                        activeDot={{ r: 6, fill: '#000000' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3v18h18"/>
                                    <path d="M7 16l4-4 4 4 6-6"/>
                                </svg>
                                <p>No sales data available</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Top Products Chart */}
                <motion.div 
                    className="chart-container" 
                    variants={chartVariants}
                    whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="chart-header">
                        <h2>Top Products</h2>
                    </div>
                    <div className="chart-wrapper">
                        {stats.topProducts && stats.topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={300}>
                                <BarChart data={stats.topProducts}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={60} 
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                    />
                                    <YAxis 
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280' }}
                                    />
                                    <Tooltip 
                                        formatter={(value, name) => {
                                            if (name === 'sales') return [value, 'Units Sold'];
                                            if (name === 'revenue') return [`₱${value.toLocaleString()}`, 'Revenue'];
                                            return [value, name];
                                        }}
                                        labelStyle={{ color: '#1f2937', fontWeight: '500' }}
                                        contentStyle={{ 
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="sales" 
                                        name="Units Sold"
                                        fill="#e63946" 
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                                <p>No product sales data</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Tables Section */}
            <motion.div className="tables-section" variants={containerVariants}>
                {/* Recent Orders Table */}
                <motion.div 
                    className="table-container" 
                    variants={itemVariants}
                    whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="table-header">
                        <h2>Recent Orders</h2>
                        <Link to="/admin/orders/all" className="view-all-link">View All →</Link>
                    </div>
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order, index) => (
                                    <motion.tr 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ 
                                            backgroundColor: 'rgba(230, 57, 70, 0.05)',
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <td className="order-id">{order.id}</td>
                                        <td>{order.customer || 'N/A'}</td>
                                        <td>{formatCurrency(order.amount)}</td>
                                        <td>
                                            <span 
                                                className="order-status"
                                                style={{
                                                    backgroundColor: `${getStatusColor(order.status)}20`,
                                                    color: getStatusColor(order.status),
                                                    border: `1px solid ${getStatusColor(order.status)}40`
                                                }}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>{order.date}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            <p>No recent orders found</p>
                        </div>
                    )}
                </motion.div>

                {/* Low Stock Alerts */}
                <motion.div 
                    className="table-container" 
                    variants={itemVariants}
                    whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className="table-header">
                        <h2>Low Stock Alerts</h2>
                        <Link to="/admin/products" className="view-all-link">Manage →</Link>
                    </div>
                    {stats.lowStockAlerts && stats.lowStockAlerts.length > 0 ? (
                        <ul className="alerts-list">
                            {stats.lowStockAlerts.map((alert, index) => (
                                <motion.li 
                                    key={index} 
                                    className="alert-item"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ 
                                        backgroundColor: 'rgba(230, 57, 70, 0.05)',
                                        transform: 'translateX(5px)',
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <div className="alert-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                            <line x1="12" y1="9" x2="12" y2="13"/>
                                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                                        </svg>
                                    </div>
                                    <div className="alert-info">
                                        <h4>{alert.product}</h4>
                                        <p>{alert.sku}</p>
                                        <div className="alert-stock">
                                            Stock: {alert.stock} (Min: {alert.min_stock})
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            <p>All products are sufficiently stocked</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
                className="quick-actions" 
                variants={itemVariants}
                whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
            >
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/admin/products" className="action-btn primary">
                            Add New Product
                        </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/admin/payments/pending" className="action-btn success">
                            Verify Payments ({stats.stats.pending_payments})
                        </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/admin/orders/pending" className="action-btn">
                            Process Orders
                        </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/admin/products" className="action-btn">
                            Manage Inventory
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;