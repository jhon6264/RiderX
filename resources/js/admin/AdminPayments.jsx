import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentTableRow from './PaymentTableRow';
import Loading from '../components/Loading';

const AdminPayments = () => {
    const location = useLocation();
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Search/filter state (ONLY for /all page)
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Enhanced stats for modern UI
    const [enhancedStats, setEnhancedStats] = useState({
        pendingPercentage: 0,
        approvedPercentage: 0,
        rejectedPercentage: 0,
        successRate: 0,
        averagePendingTime: 0,
        pendingToday: 0,
        approvedToday: 0
    });

    // Filter state for clickable stats (ONLY for /all page)
    const [activeStatFilter, setActiveStatFilter] = useState(null);

    // Determine active tab from URL
    const getActiveTab = () => {
        if (location.pathname.includes('/pending')) return 'pending';
        if (location.pathname.includes('/approved')) return 'approved';
        return 'all';
    };

    const activeTab = getActiveTab();

    // Enhanced stats calculation
    const calculateEnhancedStats = (paymentsData, statsData) => {
        const totalPayments = paymentsData.length;
        
        if (totalPayments === 0) {
            setEnhancedStats({
                pendingPercentage: 0,
                approvedPercentage: 0,
                rejectedPercentage: 0,
                successRate: 0,
                averagePendingTime: 0,
                pendingToday: 0,
                approvedToday: 0
            });
            return;
        }

        // Calculate percentages for /all page
        const pendingCount = paymentsData.filter(p => p.status === 'pending').length;
        const approvedCount = paymentsData.filter(p => p.status === 'verified').length;
        const rejectedCount = paymentsData.filter(p => p.status === 'rejected').length;
        
        const pendingPercentage = Math.round((pendingCount / totalPayments) * 100);
        const approvedPercentage = Math.round((approvedCount / totalPayments) * 100);
        const rejectedPercentage = Math.round((rejectedCount / totalPayments) * 100);
        
        // Calculate success rate (approved / (approved + rejected))
        const successRate = approvedCount + rejectedCount > 0 
            ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100)
            : 0;

        // Calculate time-based metrics
        const today = new Date().toISOString().split('T')[0];
        const pendingToday = paymentsData.filter(p => 
            p.status === 'pending' && 
            p.created_at.startsWith(today)
        ).length;
        
        const approvedToday = paymentsData.filter(p => 
            p.status === 'verified' && 
            p.created_at.startsWith(today)
        ).length;

        // Calculate average pending time (in hours)
        const pendingPayments = paymentsData.filter(p => p.status === 'pending');
        let totalPendingHours = 0;
        
        if (pendingPayments.length > 0) {
            const now = new Date();
            pendingPayments.forEach(payment => {
                const created = new Date(payment.created_at);
                const hoursDiff = (now - created) / (1000 * 60 * 60);
                totalPendingHours += hoursDiff;
            });
        }
        
        const averagePendingTime = pendingPayments.length > 0 
            ? Math.round(totalPendingHours / pendingPayments.length)
            : 0;

        setEnhancedStats({
            pendingPercentage,
            approvedPercentage,
            rejectedPercentage,
            successRate,
            averagePendingTime,
            pendingToday,
            approvedToday
        });
    };

    useEffect(() => {
        fetchPayments();
        if (activeTab === 'all') {
            fetchStats();
        }
    }, [activeTab, currentPage]);

    // Filter payments based on search and filters (ONLY for /all page)
    const filteredPayments = activeTab === 'all' 
        ? payments.filter(payment => {
            const matchesSearch = searchTerm === '' || 
                payment.order?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.order?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        })
        : payments; // For pending/approved pages, use all payments (already filtered by backend)

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    const fetchPayments = async () => {
        setLoading(true);
        setError('');
        
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'all':
                    endpoint = '/admin/payments/all';
                    break;
                case 'pending':
                    endpoint = '/admin/payments/pending';
                    break;
                case 'approved':
                    endpoint = '/admin/payments/approved';
                    break;
                default:
                    endpoint = '/admin/payments/all';
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (response.redirected) {
                setError('Session expired. Please login again.');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                setPayments(data.payments);
                calculateEnhancedStats(data.payments, data.stats);
                setCurrentPage(1); // Reset to first page when data changes
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Fetch payments error:', err);
            setError('Failed to load payments: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/admin/payments/stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (!response.ok) return;
            const data = await response.json();
            if (data.success) setStats(data.stats);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    // Handle stat card clicks to filter table (ONLY for /all page)
    const handleStatClick = (filterType) => {
        if (activeTab !== 'all') return; // Only clickable on /all page
        
        setActiveStatFilter(filterType);
        
        switch(filterType) {
            case 'total':
                setStatusFilter('all');
                setSearchTerm('');
                break;
            case 'pending':
                setStatusFilter('pending');
                setSearchTerm('');
                break;
            case 'approved':
                setStatusFilter('verified');
                setSearchTerm('');
                break;
            case 'rejected':
                setStatusFilter('rejected');
                setSearchTerm('');
                break;
            default:
                setStatusFilter('all');
                setSearchTerm('');
        }
    };

    const handlePaymentVerified = (paymentId) => {
        setPayments(prev => prev.filter(p => p.id !== paymentId));
        if (activeTab === 'all') {
            fetchStats();
        }
        calculateEnhancedStats(payments.filter(p => p.id !== paymentId), stats);
    };

    const handlePaymentRejected = (paymentId) => {
        setPayments(prev => prev.filter(p => p.id !== paymentId));
        if (activeTab === 'all') {
            fetchStats();
        }
        calculateEnhancedStats(payments.filter(p => p.id !== paymentId), stats);
    };

    const toggleRowExpand = (paymentId) => {
        setExpandedRow(expandedRow === paymentId ? null : paymentId);
    };

    const getPageTitle = () => {
        switch (activeTab) {
            case 'all': return 'All Payments';
            case 'pending': return 'Pending Verification';
            case 'approved': return 'Approved Payments';
            default: return 'Payments';
        }
    };

    const getPageDescription = () => {
        switch (activeTab) {
            case 'all': return 'View and manage all payment transactions';
            case 'pending': return 'Payments awaiting verification and approval';
            case 'approved': return 'Successfully verified and approved payments';
            default: return 'Manage payment transactions';
        }
    };

    // Get health indicator for success rate
    const getSuccessRateHealth = () => {
        if (enhancedStats.successRate >= 90) return 'good';
        if (enhancedStats.successRate >= 75) return 'average';
        return 'poor';
    };

    // Get health indicator for pending time
    const getPendingTimeHealth = () => {
        if (enhancedStats.averagePendingTime <= 2) return 'good';
        if (enhancedStats.averagePendingTime <= 12) return 'average';
        return 'poor';
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

    if (loading) {
        return (
            <div className="admin-payments">
                <Loading type="progress" message="Loading payments..." />
            </div>
        );
    }

    return (
        <div className="admin-payments">
            {/* Modern Header */}
            <div className="modern-header">
                <div className="header-content">
                    <h1>{getPageTitle()}</h1>
                    <p>{getPageDescription()}</p>
                </div>
            </div>

            {/* ENHANCED Stats Grid - Different for each page */}
            <div className="enhanced-stats-grid">
                {activeTab === 'all' ? (
                    /* All Payments Stats */
                    <>
                        {/* Total Payments Card */}
                        <div 
                            className={`stat-card-enhanced total ${activeStatFilter === 'total' ? 'active' : ''}`}
                            onClick={() => handleStatClick('total')}
                            title="Click to show all payments"
                        >
                            <div className="stat-header">
                                <div className="stat-title">Total Payments</div>
                                <div className="stat-indicator neutral"></div>
                            </div>
                            <div className="stat-number">{filteredPayments.length}</div>
                            <div className="stat-tooltip">All payment transactions</div>
                        </div>

                        {/* Pending Payments Card */}
                        <div 
                            className={`stat-card-enhanced pending ${activeStatFilter === 'pending' ? 'active' : ''}`}
                            onClick={() => handleStatClick('pending')}
                            title="Click to show pending payments only"
                        >
                            <div className="stat-header">
                                <div className="stat-title">Pending</div>
                                <div className={`health-indicator ${enhancedStats.pendingPercentage <= 10 ? 'good' : enhancedStats.pendingPercentage <= 20 ? 'average' : 'poor'}`}>
                                    {enhancedStats.pendingPercentage}%
                                </div>
                            </div>
                            <div className="stat-number">
                                {filteredPayments.filter(p => p.status === 'pending').length}
                            </div>
                            <div className="progress-container">
                                <div 
                                    className="progress-bar pending"
                                    style={{ width: `${enhancedStats.pendingPercentage}%` }}
                                >
                                    <span className="progress-text">{enhancedStats.pendingPercentage}%</span>
                                </div>
                            </div>
                            <div className="stat-tooltip">Payments awaiting verification</div>
                        </div>

                        {/* Approved Payments Card */}
                        <div 
                            className={`stat-card-enhanced approved ${activeStatFilter === 'approved' ? 'active' : ''}`}
                            onClick={() => handleStatClick('approved')}
                            title="Click to show approved payments only"
                        >
                            <div className="stat-header">
                                <div className="stat-title">Approved</div>
                                <div className={`health-indicator ${enhancedStats.approvedPercentage >= 70 ? 'good' : enhancedStats.approvedPercentage >= 50 ? 'average' : 'poor'}`}>
                                    {enhancedStats.approvedPercentage}%
                                </div>
                            </div>
                            <div className="stat-number">
                                {filteredPayments.filter(p => p.status === 'verified').length}
                            </div>
                            <div className="progress-container">
                                <div 
                                    className="progress-bar approved"
                                    style={{ width: `${enhancedStats.approvedPercentage}%` }}
                                >
                                    <span className="progress-text">{enhancedStats.approvedPercentage}%</span>
                                </div>
                            </div>
                            <div className="stat-tooltip">Successfully verified payments</div>
                        </div>

                        {/* Rejected Payments Card */}
                        <div 
                            className={`stat-card-enhanced rejected ${activeStatFilter === 'rejected' ? 'active' : ''}`}
                            onClick={() => handleStatClick('rejected')}
                            title="Click to show rejected payments only"
                        >
                            <div className="stat-header">
                                <div className="stat-title">Rejected</div>
                                <div className={`health-indicator ${enhancedStats.rejectedPercentage <= 5 ? 'good' : enhancedStats.rejectedPercentage <= 10 ? 'average' : 'poor'}`}>
                                    {enhancedStats.rejectedPercentage}%
                                </div>
                            </div>
                            <div className="stat-number">
                                {filteredPayments.filter(p => p.status === 'rejected').length}
                            </div>
                            <div className="progress-container">
                                <div 
                                    className="progress-bar rejected"
                                    style={{ width: `${enhancedStats.rejectedPercentage}%` }}
                                >
                                    <span className="progress-text">{enhancedStats.rejectedPercentage}%</span>
                                </div>
                            </div>
                            <div className="stat-tooltip">Payments that failed verification</div>
                        </div>
                    </>
                ) : activeTab === 'pending' ? (
                    /* Pending Payments Stats */
                    <>
                        <div className="stat-card-enhanced pending">
                            <div className="stat-header">
                                <div className="stat-title">Pending Total</div>
                                <div className="health-indicator neutral">
                                    {filteredPayments.length}
                                </div>
                            </div>
                            <div className="stat-number">{filteredPayments.length}</div>
                            <div className="stat-tooltip">All pending payments</div>
                        </div>

                        <div className="stat-card-enhanced today">
                            <div className="stat-header">
                                <div className="stat-title">Pending Today</div>
                                <div className="health-indicator neutral">
                                    {enhancedStats.pendingToday}
                                </div>
                            </div>
                            <div className="stat-number">{enhancedStats.pendingToday}</div>
                            <div className="stat-tooltip">New pending payments today</div>
                        </div>

                        <div className="stat-card-enhanced time">
                            <div className="stat-header">
                                <div className="stat-title">Avg. Pending Time</div>
                                <div className={`health-indicator ${getPendingTimeHealth()}`}>
                                    {enhancedStats.averagePendingTime}h
                                </div>
                            </div>
                            <div className="stat-number">{enhancedStats.averagePendingTime}h</div>
                            <div className="stat-tooltip">Average time pending verification</div>
                        </div>

                        <div className="stat-card-enhanced priority">
                            <div className="stat-header">
                                <div className="stat-title">Priority</div>
                                <div className="health-indicator neutral">
                                    {enhancedStats.averagePendingTime > 24 ? 'High' : 'Normal'}
                                </div>
                            </div>
                            <div className="stat-number">
                                {enhancedStats.averagePendingTime > 24 ? 'High' : 'Normal'}
                            </div>
                            <div className="stat-tooltip">Based on average pending time</div>
                        </div>
                    </>
                ) : (
                    /* Approved Payments Stats */
                    <>
                        <div className="stat-card-enhanced approved">
                            <div className="stat-header">
                                <div className="stat-title">Approved Total</div>
                                <div className="health-indicator neutral">
                                    {filteredPayments.length}
                                </div>
                            </div>
                            <div className="stat-number">{filteredPayments.length}</div>
                            <div className="stat-tooltip">All approved payments</div>
                        </div>

                        <div className="stat-card-enhanced today">
                            <div className="stat-header">
                                <div className="stat-title">Approved Today</div>
                                <div className="health-indicator neutral">
                                    {enhancedStats.approvedToday}
                                </div>
                            </div>
                            <div className="stat-number">{enhancedStats.approvedToday}</div>
                            <div className="stat-tooltip">New approved payments today</div>
                        </div>

                        <div className="stat-card-enhanced rate">
                            <div className="stat-header">
                                <div className="stat-title">Success Rate</div>
                                <div className={`health-indicator ${getSuccessRateHealth()}`}>
                                    {enhancedStats.successRate}%
                                </div>
                            </div>
                            <div className="stat-number">{enhancedStats.successRate}%</div>
                            <div className="stat-tooltip">Approval success rate</div>
                        </div>

                        <div className="stat-card-enhanced trend">
                            <div className="stat-header">
                                <div className="stat-title">Trend</div>
                                <div className="health-indicator neutral">
                                    {enhancedStats.approvedToday > 5 ? '↑ High' : '→ Normal'}
                                </div>
                            </div>
                            <div className="stat-number">
                                {enhancedStats.approvedToday > 5 ? 'High' : 'Normal'}
                            </div>
                            <div className="stat-tooltip">Today's approval activity</div>
                        </div>
                    </>
                )}
            </div>

            {/* Stats Insights Bar - ONLY for /all page */}
            {activeTab === 'all' && (
                <div className="stats-insights">
                    <div className="insight-item">
                        <span className="insight-label">Success Rate:</span>
                        <span className={`insight-value ${getSuccessRateHealth()}`}>
                            {enhancedStats.successRate}%
                        </span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Pending Time:</span>
                        <span className={`insight-value ${getPendingTimeHealth()}`}>
                            {enhancedStats.averagePendingTime > 0 ? `${enhancedStats.averagePendingTime} hours avg.` : 'No pending'}
                        </span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Today's Activity:</span>
                        <span className="insight-value neutral">
                            {enhancedStats.pendingToday} pending, {enhancedStats.approvedToday} approved
                        </span>
                    </div>
                </div>
            )}

            {/* Modern Controls - ONLY for /all page */}
            {activeTab === 'all' && (
                <div className="modern-controls">
                    <div className="controls-left">
                        <div className="search-modern">
                            <div className="search-icon">🔍</div>
                            <input
                                type="text"
                                className="search-input-modern"
                                placeholder="Search payments by customer, email, or reference..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="controls-right">
                        <select 
                            className="filter-modern"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="failed">Failed</option>
                        </select>
                        <div className="results-modern">
                            {filteredPayments.length} payments
                        </div>
                    </div>
                </div>
            )}

            {/* Results Counter - For pending/approved pages */}
            {activeTab !== 'all' && (
                <div className="results-counter">
                    Showing {filteredPayments.length} {activeTab} payments
                </div>
            )}

            {/* Modern Table Container */}
            <div className="modern-table-container">
                {error ? (
                    <div className="error-modern">
                        <div className="error-icon">⚠️</div>
                        <div className="error-content">
                            <h4>Unable to load payments</h4>
                            <p>{error}</p>
                            <button onClick={() => fetchPayments()} className="btn-modern-secondary">
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : currentPayments.length === 0 ? (
                    <div className="empty-modern">
                        <div className="empty-icon">
                            {activeTab === 'pending' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>
                                </svg>
                            ) : activeTab === 'approved' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                                </svg>
                            )}
                        </div>
                        <h3>
                            {activeTab === 'all' && (searchTerm || statusFilter !== 'all') 
                                ? 'No matching payments found'
                                : activeTab === 'pending' ? 'No Pending Payments' :
                                  activeTab === 'approved' ? 'No Approved Payments' : 'No Payments Found'
                            }
                        </h3>
                        <p>
                            {activeTab === 'all' && (searchTerm || statusFilter !== 'all') 
                                ? 'Try adjusting your search or filters'
                                : activeTab === 'pending' ? 'All payments have been verified.' :
                                  activeTab === 'approved' ? 'No payments have been approved yet.' : 
                                  'No payment records found.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="payments-table-wrapper">
                        <table className="payments-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Screenshot</th>
                                    {activeTab === 'pending' && <th>Actions</th>}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPayments.map(payment => (
                                    <PaymentTableRow
                                        key={payment.id}
                                        payment={payment}
                                        isExpanded={expandedRow === payment.id}
                                        onToggleExpand={toggleRowExpand}
                                        onVerified={handlePaymentVerified}
                                        onRejected={handlePaymentRejected}
                                        showActions={activeTab === 'pending'}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modern Pagination */}
            {totalPages > 1 && (
                <div className="pagination-modern">
                    <button 
                        className="pagination-btn-modern"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
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
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminPayments;