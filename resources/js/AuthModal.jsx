import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Switch between login and signup
    const switchToSignup = () => {
        setIsLoginView(false);
    };

    const switchToLogin = () => {
        setIsLoginView(true);
    };

    // Prevent modal close when clicking inside modal content
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Handle form submissions
    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login submitted');
    };

    const handleSignup = (e) => {
        e.preventDefault();
        console.log('Signup submitted');
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
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset'; // Re-enable scroll
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
                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="login-email">Email Address</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="login-password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
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
                            </div>

                            {/* Forgot Password */}
                            <div className="forgot-password">
                                <a href="#forgot">Forgot password?</a>
                            </div>

                            {/* Login Button */}
                            <button type="submit" className="btn btn-primary auth-submit-btn">
                                Login
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
                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="signup-email">Email Address</label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="signup-password"
                                        placeholder="Create a password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm-password"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="terms-checkbox">
                                <label>
                                    <input type="checkbox" required />
                                    <span>
                                        I agree to the{' '}
                                        <a href="#terms" className="terms-link">Terms and Conditions</a>
                                        {' '}and{' '}
                                        <a href="#privacy" className="terms-link">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            {/* Signup Button */}
                            <button type="submit" className="btn btn-primary auth-submit-btn">
                                Create Account
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