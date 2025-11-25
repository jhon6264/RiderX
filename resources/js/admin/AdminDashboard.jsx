import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/admin/dashboard');
            const data = await response.json();
            
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Overview of your store performance</p>
            </div>

            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>{stats.total_orders}</h3>
                            <p>Total Orders</p>
                        </div>
                        <Link to="/admin/orders" className="stat-link">View All →</Link>
                    </div>

                    <div className="stat-card warning">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>{stats.pending_payments}</h3>
                            <p>Pending Payments</p>
                        </div>
                        <Link to="/admin/payments" className="stat-link">Verify Now →</Link>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🛍️</div>
                        <div className="stat-info">
                            <h3>{stats.total_products}</h3>
                            <p>Total Products</p>
                        </div>
                        <Link to="/admin/products" className="stat-link">Manage →</Link>
                    </div>

                    <div className="stat-card success">
                        <div className="stat-icon">💵</div>
                        <div className="stat-info">
                            <h3>₱{stats.revenue?.toLocaleString()}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/admin/payments" className="action-btn primary">
                        Verify Pending Payments
                    </Link>
                    <Link to="/admin/orders" className="action-btn">
                        Manage Orders
                    </Link>
                    <Link to="/admin/products" className="action-btn">
                        Update Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;