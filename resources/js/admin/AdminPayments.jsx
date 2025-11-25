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
    
    // Search/filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Determine active tab from URL
    const getActiveTab = () => {
        if (location.pathname.includes('/pending')) return 'pending';
        if (location.pathname.includes('/approved')) return 'approved';
        return 'all';
    };

    const activeTab = getActiveTab();

    useEffect(() => {
        fetchPayments();
        fetchStats();
    }, [activeTab, currentPage]);

    // Filter payments based on search and filters
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = searchTerm === '' || 
            payment.order?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.order?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

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

    const handlePaymentVerified = (paymentId) => {
        setPayments(prev => prev.filter(p => p.id !== paymentId));
        fetchStats();
    };

    const handlePaymentRejected = (paymentId) => {
        setPayments(prev => prev.filter(p => p.id !== paymentId));
        fetchStats();
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
            <div className="page-header">
                <h1>{getPageTitle()}</h1>
                {/* Removed descriptive text */}
            </div>

            {/* Stats Overview - Grid Cards */}
            {stats && (
                <div className="stats-grid-cards">
                    <div className="stat-card stat-pending">
                        <div className="stat-number">{stats.pending_count}</div>
                        <div className="stat-label">Pending</div>
                        
                    </div>
                    <div className="stat-card stat-approved">
                        <div className="stat-number">{stats.verified_count}</div>
                        <div className="stat-label">Approved</div>
                        
                    </div>
                    <div className="stat-card stat-rejected">
                        <div className="stat-number">{stats.rejected_count}</div>
                        <div className="stat-label">Rejected</div>
                        
                    </div>
                    <div className="stat-card stat-today">
                        <div className="stat-number">{stats.verified_today}</div>
                        <div className="stat-label">Approved Today</div>
                        
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="table-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by customer, email, or reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-box">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div className="results-count">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} payments
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={fetchPayments} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            {/* Payments Table */}
<div className="payments-table-container">
    {currentPayments.length === 0 ? (
        <div className="empty-state">
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
                {searchTerm || statusFilter !== 'all' 
                    ? 'No matching payments found'
                    : activeTab === 'pending' ? 'No Pending Payments' :
                      activeTab === 'approved' ? 'No Approved Payments' : 'No Payments Found'
                }
            </h3>
            <p>
                {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : activeTab === 'pending' ? 'All payments have been verified.' :
                      activeTab === 'approved' ? 'No payments have been approved yet.' : 
                      'No payment records found.'
                }
            </p>
        </div>
                ) : (
                    <>
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button 
                                    onClick={prevPage} 
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    Previous
                                </button>
                                
                                <div className="pagination-numbers">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={nextPage} 
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPayments;