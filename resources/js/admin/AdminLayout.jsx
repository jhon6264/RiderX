import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [paymentsOpen, setPaymentsOpen] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await fetch('/admin/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const isPaymentsActive = () => {
        return location.pathname.includes('/admin/payments');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>RiderX Admin</h2>
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard')}`}>
                        📊 Dashboard
                    </Link>
                    <Link to="/admin/orders" className={`nav-item ${isActive('/admin/orders')}`}>
                        📦 Orders
                    </Link>
                    
                    {/* Payments Dropdown */}
                    <div className={`nav-dropdown ${isPaymentsActive() ? 'active' : ''}`}>
                        <button 
                            className="nav-dropdown-btn"
                            onClick={() => setPaymentsOpen(!paymentsOpen)}
                        >
                            <span>💰 Payments</span>
                            <span className={`dropdown-arrow ${paymentsOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        <div className={`nav-dropdown-content ${paymentsOpen ? 'open' : ''}`}>
                            <Link 
                                to="/admin/payments/all" 
                                className={`nav-subitem ${isActive('/admin/payments/all')}`}
                            >
                                All Payments
                            </Link>
                            <Link 
                                to="/admin/payments/pending" 
                                className={`nav-subitem ${isActive('/admin/payments/pending')}`}
                            >
                                Pending Verification
                            </Link>
                            <Link 
                                to="/admin/payments/approved" 
                                className={`nav-subitem ${isActive('/admin/payments/approved')}`}
                            >
                                Approved Payments
                            </Link>
                        </div>
                    </div>

                    <Link to="/admin/products" className={`nav-item ${isActive('/admin/products')}`}>
                        🛍️ Products
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;