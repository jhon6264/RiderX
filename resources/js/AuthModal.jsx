import React, { useState } from 'react';


const AuthModal = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Form data states
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false
    });

    // CSRF Token function
    const getCsrfToken = async () => {
        await fetch('/sanctum/csrf-cookie', {
            credentials: 'include'
        });
    };

    // Switch between login and signup
    const switchToSignup = () => {
        setIsLoginView(false);
        setErrors({});
        setSuccessMessage('');
    };

    const switchToLogin = () => {
        setIsLoginView(true);
        setErrors({});
        setSuccessMessage('');
    };

    // Handle input changes
    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignupChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSignupData({
            ...signupData,
            [e.target.name]: value
        });
    };

    // Handle form submissions
   const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            // CHECK IF USER IS VERIFIED
            const userResponse = await fetch('/api/user');
            const userData = await userResponse.json();
            
            if (userData.authenticated && !userData.user.email_verified) {
                // User is NOT verified - log them out and show error
                await fetch('/api/logout', { method: 'POST' });
                setErrors({ message: 'Please verify your email address before logging in.' });
            } else {
                // User IS verified - proceed normally
                setSuccessMessage('Login successful!');
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1500);
            }
        } else {
            setErrors(data.errors || { message: 'Login failed' });
        }
    } catch (error) {
        setErrors({ message: 'Network error. Please try again.' });
    } finally {
        setLoading(false);
    }
};

   const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    // ADD THIS LINE:
    console.log('Sending signup data:', signupData);

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(signupData),
        });

        // ADD THESE TWO LINES:
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            // ADD THIS LINE:
            console.log('Registration successful!');
            setSuccessMessage('Registration successful! Please check your email for verification.');
            setTimeout(() => {
                switchToLogin();
            }, 10000);
        } else {
            // ADD THIS LINE:
            console.log('Registration failed:', data);
            setErrors(data.errors || { message: 'Registration failed' });
        }
    } catch (error) {
        // ADD THIS LINE:
        console.log('Network error:', error);
        setErrors({ message: 'Network error. Please try again.' });
    } finally {
        setLoading(false);
    }
};

    // Prevent modal close when clicking inside modal content
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Close modal when pressing Escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={handleModalClick}>
                
                {/* LOGIN FORM */}
                {isLoginView ? (
                    <div className="auth-form">
                        {/* Header */}
                        <div className="auth-modal-header">
                            <h2>Login</h2>
                            <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleLogin} className="auth-form-body">
                            {/* Success Message */}
                            {successMessage && (
                                <div className="success-message">
                                    {successMessage}
                                </div>
                            )}

                            {/* Error Messages */}
                            {errors.message && (
                                <div className="error-message">
                                    {errors.message}
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="login-email">Email Address</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                                {errors.email && <span className="field-error">{errors.email[0]}</span>}
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="login-password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="field-error">{errors.password[0]}</span>}
                            </div>

                            {/* Forgot Password */}
                            <div className="forgot-password">
                                <a href="#forgot">Forgot password?</a>
                            </div>

                            {/* Login Button */}
                            <button 
                                type="submit" 
                                className="btn btn-primary auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            {/* Divider */}
                            <div className="divider">
                                <span>or</span>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="social-login">
                                <button 
                                    type="button" 
                                    className="social-btn facebook-btn"
                                    disabled
                                    title="Unavailable"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <span>LOG IN WITH FACEBOOK</span>
                                </button>

                                <button 
                                    type="button" 
                                    className="social-btn google-btn"
                                    disabled
                                    title="Unavailable"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    <span>LOG IN WITH GOOGLE</span>
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="auth-modal-footer">
                            <p>
                                Don't have an account?{' '}
                                <a className="switch-link" onClick={switchToSignup}>
                                    Create Account
                                </a>
                            </p>
                        </div>
                    </div>
                ) : (
                    /* SIGNUP FORM */
                    <div className="auth-form">
                        {/* Header */}
                        <div className="auth-modal-header">
                            <h2>Sign up</h2>
                            <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSignup} className="auth-form-body">
                            {/* Success Message */}
                            {successMessage && (
                                <div className="success-message">
                                    {successMessage}
                                </div>
                            )}

                            {/* Error Messages */}
                            {errors.message && (
                                <div className="error-message">
                                    {errors.message}
                                </div>
                            )}

                            {/* Name Input */}
                            <div className="form-group">
                                <label htmlFor="signup-name">Full Name</label>
                                <input
                                    type="text"
                                    id="signup-name"
                                    name="name"
                                    value={signupData.name}
                                    onChange={handleSignupChange}
                                    placeholder="Enter your full name"
                                    required
                                    disabled={loading}
                                />
                                {errors.name && <span className="field-error">{errors.name[0]}</span>}
                            </div>

                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="signup-email">Email Address</label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    name="email"
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                                {errors.email && <span className="field-error">{errors.email[0]}</span>}
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="signup-password"
                                        name="password"
                                        value={signupData.password}
                                        onChange={handleSignupChange}
                                        placeholder="Create a password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.password && <span className="field-error">{errors.password[0]}</span>}
                            </div>

                            {/* Confirm Password Input */}
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm-password"
                                        name="password_confirmation"
                                        value={signupData.password_confirmation}
                                        onChange={handleSignupChange}
                                        placeholder="Confirm your password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="terms-checkbox">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="terms"
                                        checked={signupData.terms}
                                        onChange={handleSignupChange}
                                        required 
                                        disabled={loading}
                                    />
                                    <span>
                                        I agree to the{' '}
                                        <a href="#terms" className="terms-link">Terms and Conditions</a>
                                        {' '}and{' '}
                                        <a href="#privacy" className="terms-link">Privacy Policy</a>
                                    </span>
                                </label>
                                {errors.terms && <span className="field-error">{errors.terms[0]}</span>}
                            </div>

                            {/* Signup Button */}
                            <button 
                                type="submit" 
                                className="btn btn-primary auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="auth-modal-footer">
                            <p>
                                Already have an account?{' '}
                                <a className="switch-link" onClick={switchToLogin}>
                                    Log in
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;