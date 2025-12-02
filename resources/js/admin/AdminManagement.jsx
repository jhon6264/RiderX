import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        from: 0,
        to: 0
    });
    const [stats, setStats] = useState({
        total_users: 0,
        total_admins: 0,
        online_now: 0,
        active_today: 0
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [isPolling, setIsPolling] = useState(false);

    // Fetch users with proper parameters
    const fetchUsers = async (page = 1, search = '', filter = 'all') => {
        try {
            setLoading(true);
            setError(null);
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            // Build query parameters matching backend expectations
            const params = new URLSearchParams({
                page: page,
                per_page: 20
            });
            
            if (search) params.append('search', search);
            if (filter && filter !== 'all') params.append('filter', filter);
            
            const response = await fetch(`/admin/admin/users?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/admin/login';
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users || []);
                setPagination({
                    current_page: data.pagination?.current_page || 1,
                    last_page: data.pagination?.last_page || 1,
                    per_page: data.pagination?.per_page || 20,
                    total: data.pagination?.total || 0,
                    from: data.pagination?.from || 0,
                    to: data.pagination?.to || 0
                });
                
                if (data.stats) {
                    setStats({
                        total_users: data.stats.total_users || 0,
                        total_admins: data.stats.total_admins || 0,
                        online_now: data.stats.online_now || 0,
                        active_today: Math.floor((data.stats.total_users || 0) * 0.3)
                    });
                }
            } else {
                throw new Error(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setError(error.message);
            setToast({
                type: 'error',
                message: 'Failed to load users. Please try again.',
                title: 'Error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Update user statuses via polling
    const updateUserStatuses = async () => {
        if (users.length === 0 || isPolling) return;
        
        try {
            setIsPolling(true);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const userIds = users.map(user => user.id);
            
            const response = await fetch('/admin/admin/users/status-updates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ user_ids: userIds }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.statuses) {
                    setUsers(prevUsers => prevUsers.map(user => ({
                        ...user,
                        status: data.statuses[user.id] || user.status
                    })));
                }
            }
        } catch (error) {
            console.error('Failed to update statuses:', error);
        } finally {
            setIsPolling(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchUsers(1, '', 'all');
        
        // Set up polling for status updates every 30 seconds
        const pollInterval = setInterval(() => {
            updateUserStatuses();
        }, 30000);
        
        return () => clearInterval(pollInterval);
    }, []);

    // Handle search changes with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers(1, searchTerm, filterRole);
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterRole]);

    // Handle admin toggle
    const handleToggleAdmin = async (user) => {
        setSelectedUser(user);
        setShowConfirmModal(true);
    };

    const confirmToggleAdmin = async () => {
        if (!selectedUser) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/admin/admin/users/${selectedUser.id}/toggle-admin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                credentials: 'include'
            });

            const data = await response.json();
            
            if (data.success) {
                // Update user in list
                setUsers(prevUsers => prevUsers.map(user => 
                    user.id === selectedUser.id 
                        ? { ...user, is_admin: !user.is_admin }
                        : user
                ));
                
                // Update stats
                setStats(prevStats => ({
                    ...prevStats,
                    total_admins: prevStats.total_admins + (selectedUser.is_admin ? -1 : 1)
                }));
                
                // Show success toast
                setToast({
                    type: 'success',
                    message: data.message || `Successfully ${selectedUser.is_admin ? 'removed admin access from' : 'granted admin access to'} ${selectedUser.name}`,
                    title: 'Success'
                });
            } else {
                setToast({
                    type: 'error',
                    message: data.message || 'Failed to update admin status',
                    title: 'Error'
                });
            }
        } catch (error) {
            console.error('Failed to toggle admin:', error);
            setToast({
                type: 'error',
                message: 'Failed to update admin status. Please try again.',
                title: 'Error'
            });
        } finally {
            setShowConfirmModal(false);
            setSelectedUser(null);
            
            // Auto-hide toast after 5 seconds
            setTimeout(() => setToast(null), 5000);
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    // Format time helper
    const formatTime = (dateString) => {
        if (!dateString) return 'Never';
        
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return `Today ${date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    // Pagination handlers
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            fetchUsers(page, searchTerm, filterRole);
        }
    };

    // Get status color
    const getStatusColor = (statusData) => {
        if (!statusData) return '#9ca3af';
        if (typeof statusData === 'string') {
            // Handle string status
            switch(statusData) {
                case 'active': return '#10b981';
                case 'away': return '#f59e0b';
                case 'offline': return '#9ca3af';
                case 'never': return '#9ca3af';
                default: return '#9ca3af';
            }
        }
        // Handle object status from backend
        return statusData.color || '#9ca3af';
    };

    // Get status text
    const getStatusText = (statusData) => {
        if (!statusData) return 'Offline';
        if (typeof statusData === 'string') {
            switch(statusData) {
                case 'active': return 'Active';
                case 'away': return 'Away';
                case 'offline': return 'Offline';
                case 'never': return 'Never Active';
                default: return statusData;
            }
        }
        return statusData.text || 'Offline';
    };

    // Get status type
    const getStatusType = (statusData) => {
        if (!statusData) return 'offline';
        if (typeof statusData === 'string') return statusData;
        return statusData.status || 'offline';
    };

    // Skeleton loading component
    const SkeletonRow = () => (
        <tr className="skeleton-row">
            <td>
                <div className="skeleton-user">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-details">
                        <div className="skeleton-name"></div>
                        <div className="skeleton-email"></div>
                    </div>
                </div>
            </td>
            <td><div className="skeleton-status"></div></td>
            <td><div className="skeleton-activity"></div></td>
            <td><div className="skeleton-login"></div></td>
            <td><div className="skeleton-role"></div></td>
            <td><div className="skeleton-action"></div></td>
        </tr>
    );

    return (
        <div className="admin-dashboard">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`toast toast-${toast.type}`}
                    >
                        <div className="toast-header">
                            <strong>{toast.title}</strong>
                            <button 
                                className="toast-close"
                                onClick={() => setToast(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="toast-body">
                            {toast.message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="dashboard-header"
            >
                <div className="header-title">
                    <h1>Admin Management</h1>
                    <p>Manage user admin access and permissions</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="stats-grid"
            >
                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-number">{stats.total_users}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-number">{stats.total_admins}</div>
                        <div className="stat-label">Admins</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-number">{stats.online_now}</div>
                        <div className="stat-label">Online Now</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <div className="stat-number">{stats.active_today}</div>
                        <div className="stat-label">Active Today</div>
                    </div>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="dashboard-controls"
            >
                <div className="controls-left">
                    <div className="search-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="controls-right">
                    <select 
                        className="filter-select"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Users</option>
                        <option value="admin">Admins Only</option>
                        <option value="user">Users Only</option>
                    </select>
                    <div className="results-count">
                        Showing {pagination.from}-{pagination.to} of {pagination.total} users
                    </div>
                </div>
            </motion.div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="error-banner"
                    >
                        <svg className="error-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 7V10M10 13H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="error-text">{error}</span>
                        <button 
                            onClick={() => fetchUsers(1, searchTerm, filterRole)} 
                            className="retry-button"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Users Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="table-container"
            >
                {loading ? (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Status</th>
                                <th>Last Activity</th>
                                <th>Login Count</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <SkeletonRow key={index} />
                            ))}
                        </tbody>
                    </table>
                ) : error ? (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3>Error Loading Users</h3>
                        <p>{error}</p>
                        <button 
                            onClick={() => fetchUsers(1, searchTerm, filterRole)} 
                            className="retry-button"
                        >
                            Try Again
                        </button>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3>No Users Found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Status</th>
                                <th>Last Activity</th>
                                <th>Login Count</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {users.map((user, index) => (
                                    <motion.tr 
                                        key={user.id} 
                                        className="table-row"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <td>
                                            <div className="user-info">
                                                <div 
                                                    className="user-avatar"
                                                    style={{ 
                                                        background: `linear-gradient(135deg, ${user.is_admin ? '#e63946' : '#3b82f6'}, ${user.is_admin ? '#d32f2f' : '#2563eb'})`
                                                    }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="user-details">
                                                    <div className="user-name">
                                                        {user.name || 'Unknown User'}
                                                        {user.email_verified_at && (
                                                            <span className="verified-badge">
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="user-email">{user.email || 'No email'}</div>
                                                    <div className="user-join">Joined {formatDate(user.created_at)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-indicator">
                                                <div 
                                                    className="status-dot"
                                                    style={{ 
                                                        backgroundColor: getStatusColor(user.status),
                                                        animation: getStatusType(user.status) === 'active' ? 'pulse 2s infinite' : 'none'
                                                    }}
                                                ></div>
                                                <span>{getStatusText(user.status)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="activity-info">
                                                <div className="last-login">
                                                    {formatTime(user.last_login_at)}
                                                </div>
                                                <div className="last-logout">
                                                    {user.last_logout_at ? `Last logout: ${formatDate(user.last_logout_at)}` : 'Never logged out'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="login-count">
                                                <span className="count-number">{user.login_count || 0}</span>
                                                <span className="count-label">logins</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`role-badge ${user.is_admin ? 'admin' : 'user'}`}>
                                                {user.is_admin ? 'Admin' : 'User'}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className={`action-button ${user.is_admin ? 'remove-admin' : 'make-admin'}`}
                                                onClick={() => handleToggleAdmin(user)}
                                            >
                                                {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </motion.div>

            {/* Pagination */}
            {pagination.last_page > 1 && !loading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="pagination"
                >
                    <button
                        onClick={() => goToPage(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="pagination-button prev"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Previous
                    </button>
                    
                    <div className="pagination-numbers">
                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                            .filter(page => 
                                page === 1 || 
                                page === pagination.last_page || 
                                Math.abs(page - pagination.current_page) <= 1
                            )
                            .map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span className="pagination-ellipsis">...</span>
                                    )}
                                    <button
                                        onClick={() => goToPage(page)}
                                        className={`pagination-number ${pagination.current_page === page ? 'active' : ''}`}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))
                        }
                    </div>
                    
                    <button
                        onClick={() => goToPage(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="pagination-button next"
                    >
                        Next
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </motion.div>
            )}

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>Confirm Role Change</h3>
                                <button 
                                    className="modal-close"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="role-change-info">
                                    <div className="current-role-section">
                                        <h4>User Information</h4>
                                        <div className="user-info-modal">
                                            <div className="user-name">{selectedUser.name}</div>
                                            <div className="user-email">{selectedUser.email}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="role-change-display">
                                        <div className="role-change-item">
                                            <span className="role-label">Current Role:</span>
                                            <span className={`current-role ${selectedUser.is_admin ? 'admin' : 'user'}`}>
                                                {selectedUser.is_admin ? 'Admin' : 'User'}
                                            </span>
                                        </div>
                                        
                                        <div className="role-change-arrow">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        
                                        <div className="role-change-item">
                                            <span className="role-label">New Role:</span>
                                            <span className={`new-role ${!selectedUser.is_admin ? 'admin' : 'user'}`}>
                                                {!selectedUser.is_admin ? 'Admin' : 'User'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-warning">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 7V10M10 13H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <strong>Note:</strong> {selectedUser.is_admin 
                                                ? 'This user will lose access to the admin panel and all admin privileges.' 
                                                : 'This user will gain access to the admin panel with full admin privileges.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`btn-primary ${selectedUser.is_admin ? 'danger' : 'success'}`}
                                    onClick={confirmToggleAdmin}
                                >
                                    {selectedUser.is_admin ? 'Remove Admin Access' : 'Grant Admin Access'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManagement;