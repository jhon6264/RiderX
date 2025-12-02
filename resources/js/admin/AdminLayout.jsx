import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [paymentsOpen, setPaymentsOpen] = useState(false);
    const location = useLocation();

    // Auto-close dropdowns when sidebar is minimized
    useEffect(() => {
        if (!sidebarOpen) {
            setOrdersOpen(false);
            setPaymentsOpen(false);
        }
    }, [sidebarOpen]);

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
        return location.pathname === path;
    };

    const isOrdersActive = () => {
        return location.pathname.includes('/admin/orders');
    };

    const isPaymentsActive = () => {
        return location.pathname.includes('/admin/payments');
    };

    // Auto-open dropdown if on a subpage (only when sidebar is open)
    useEffect(() => {
        if (sidebarOpen) {
            if (isOrdersActive()) {
                setOrdersOpen(true);
            }
            if (isPaymentsActive()) {
                setPaymentsOpen(true);
            }
        }
    }, [location.pathname, sidebarOpen]);

    // FIXED: Handle dropdown click in minimized mode
    const handleDropdownClick = (dropdownType) => {
        if (!sidebarOpen) {
            // If sidebar is minimized, first expand it
            setSidebarOpen(true);
            // Then open the dropdown after a short delay for transition
            setTimeout(() => {
                if (dropdownType === 'orders') {
                    setOrdersOpen(true);
                } else if (dropdownType === 'payments') {
                    setPaymentsOpen(true);
                }
            }, 300); // Match CSS transition duration
        } else {
            // If sidebar is already open, just toggle the dropdown
            if (dropdownType === 'orders') {
                setOrdersOpen(!ordersOpen);
            } else if (dropdownType === 'payments') {
                setPaymentsOpen(!paymentsOpen);
            }
        }
    };

    // SVG Icons Components - All 20x20 with consistent styling
    const DashboardIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 14 4-4"/>
            <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
        </svg>
    );

    const ProductsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
        </svg>
    );

    const AdminIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
            <path d="M6.376 18.91a6 6 0 0 1 11.249.003"/>
            <circle cx="12" cy="11" r="4"/>
        </svg>
    );

    const OrdersIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
            <path d="M12 22V12"/>
            <polyline points="3.29 7 12 12 20.71 7"/>
            <path d="m7.5 4.27 9 5.15"/>
        </svg>
    );

    const PaymentsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
            <path d="M12 18V6"/>
        </svg>
    );

    const LogoutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 17 5-5-5-5"/>
            <path d="M21 12H9"/>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        </svg>
    );

    const SidebarToggleIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M12 3v18"/>
        </svg>
    );

    const DropdownArrow = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
        </svg>
    );

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <span className="brand-primary">RiderX</span>
                        <span className="brand-secondary">Admin Panel</span>
                    </div>
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <SidebarToggleIcon />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {/* ============================================
                        UPDATED SEQUENCE: 
                        Dashboard → Products → Admin Management → Orders → Payments
                       ============================================ */}
                    
                    {/* 1. Dashboard */}
                    <Link 
                        to="/admin/dashboard" 
                        className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
                        data-tooltip="Dashboard"
                    >
                        <span className="nav-icon">
                            <DashboardIcon />
                        </span>
                        <span className="nav-text">Dashboard</span>
                    </Link>
                    
                    {/* 2. Products */}
                    <Link 
                        to="/admin/products" 
                        className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
                        data-tooltip="Products"
                    >
                        <span className="nav-icon">
                            <ProductsIcon />
                        </span>
                        <span className="nav-text">Products</span>
                    </Link>

                    {/* 3. Admin Management */}
                    <Link 
                        to="/admin/admins" 
                        className={`nav-item ${isActive('/admin/admins') ? 'active' : ''}`}
                        data-tooltip="Admin Management"
                    >
                        <span className="nav-icon">
                            <AdminIcon />
                        </span>
                        <span className="nav-text">Admin Management</span>
                    </Link>
                    
                    {/* 4. Orders Dropdown */}
                    <div className={`nav-dropdown ${isOrdersActive() ? 'active' : ''}`}>
                        <button 
                            className="nav-dropdown-btn"
                            onClick={() => handleDropdownClick('orders')}
                            aria-expanded={ordersOpen && sidebarOpen}
                            data-tooltip="Orders"
                        >
                            <span className="nav-icon">
                                <OrdersIcon />
                            </span>
                            <span className="nav-text">Orders</span>
                            <span className={`dropdown-arrow ${ordersOpen && sidebarOpen ? 'open' : ''}`}>
                                <DropdownArrow />
                            </span>
                        </button>
                        <div className={`nav-dropdown-content ${ordersOpen && sidebarOpen ? 'open' : ''}`}>
                            <Link 
                                to="/admin/orders/all" 
                                className={`nav-subitem ${isActive('/admin/orders/all') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">All Orders</span>
                            </Link>
                            <Link 
                                to="/admin/orders/pending" 
                                className={`nav-subitem ${isActive('/admin/orders/pending') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Pending Orders</span>
                            </Link>
                            <Link 
                                to="/admin/orders/to-ship" 
                                className={`nav-subitem ${isActive('/admin/orders/to-ship') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Ready to Ship</span>
                            </Link>
                            <Link 
                                to="/admin/orders/shipped" 
                                className={`nav-subitem ${isActive('/admin/orders/shipped') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Shipped Orders</span>
                            </Link>
                            <Link 
                                to="/admin/orders/delivered" 
                                className={`nav-subitem ${isActive('/admin/orders/delivered') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Delivered Orders</span>
                            </Link>
                            <Link 
                                to="/admin/orders/cancelled" 
                                className={`nav-subitem ${isActive('/admin/orders/cancelled') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Cancelled Orders</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* 5. Payments Dropdown */}
                    <div className={`nav-dropdown ${isPaymentsActive() ? 'active' : ''}`}>
                        <button 
                            className="nav-dropdown-btn"
                            onClick={() => handleDropdownClick('payments')}
                            aria-expanded={paymentsOpen && sidebarOpen}
                            data-tooltip="Payments"
                        >
                            <span className="nav-icon">
                                <PaymentsIcon />
                            </span>
                            <span className="nav-text">Payments</span>
                            <span className={`dropdown-arrow ${paymentsOpen && sidebarOpen ? 'open' : ''}`}>
                                <DropdownArrow />
                            </span>
                        </button>
                        <div className={`nav-dropdown-content ${paymentsOpen && sidebarOpen ? 'open' : ''}`}>
                            <Link 
                                to="/admin/payments/all" 
                                className={`nav-subitem ${isActive('/admin/payments/all') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">All Payments</span>
                            </Link>
                            <Link 
                                to="/admin/payments/pending" 
                                className={`nav-subitem ${isActive('/admin/payments/pending') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Pending Verification</span>
                            </Link>
                            <Link 
                                to="/admin/payments/approved" 
                                className={`nav-subitem ${isActive('/admin/payments/approved') ? 'active' : ''}`}
                            >
                                <span className="nav-subitem-text">Approved Payments</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn" data-tooltip="Logout">
                        <span className="logout-icon">
                            <LogoutIcon />
                        </span>
                        <span className="logout-text">Logout</span>
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