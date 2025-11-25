import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'X-Requested-With': 'XMLHttpRequest' // Important for Laravel
            },
            credentials: 'include', // Crucial for sessions
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            // Login successful - redirect to dashboard
            console.log('Admin login successful, redirecting...');
            window.location.href = '/admin/dashboard'; // Use window.location for session
        } else {
            // Login failed - show error message
            setError(data.message);
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('Network error. Please try again.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>RiderX Admin</h1>
                        <p>Access the admin dashboard</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="admin@riderx.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>RiderX E-Commerce Admin Panel</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;