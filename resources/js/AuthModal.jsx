import React, { useState, useEffect } from 'react';
import Loading from './components/Loading'; 
const AuthModal = ({ 
    isOpen, 
    onClose, 
    resetData = { token: '', email: '' }, 
    verificationData = { verified: false, email: '' } 
}) => {
    console.log('AuthModal rendered - isOpen:', isOpen, 'resetData:', resetData);
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
    const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [countdown, setCountdown] = useState(6);
    const [verificationCountdown, setVerificationCountdown] = useState(5);
    
    // Reset password states
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetPasswordData, setResetPasswordData] = useState({
        email: '',
        password: '',
        password_confirmation: ''
    });

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

    // Password validation function
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        requirements: {
            minLength: password.length >= minLength,
            hasUpperCase,
            hasLowerCase, 
            hasNumbers,
            hasSpecialChar
        }
    };
};

    // Reset form when modal opens/closes or when reset data is provided
    useEffect(() => {
        if (resetData.token && resetData.email && isOpen) {
            console.log('Setting up reset form with email:', resetData.email);
            setShowResetForm(true);
            setShowForgotPassword(true);
            setResetPasswordData({
                email: resetData.email,
                password: '',
                password_confirmation: ''
            });
        } else if (isOpen) {
            // Reset to login view when opening normally
            setShowResetForm(false);
            setShowForgotPassword(false);
            setIsLoginView(true);
        }
    }, [resetData, isOpen]);


    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    const verified = urlParams.get('verified');
    
    if (token && email && !isOpen) {
        // If we have token/email in URL and modal isn't open, open it
        // This will be handled by the parent component through context
        // You might need to pass these as props or handle in App.jsx
    }
}, [isOpen]);

    // Clear all forms when modal closes
    useEffect(() => {
        if (!isOpen) {
            resetAllForms();
        }
    }, [isOpen]);
    // Cleanup countdown interval
useEffect(() => {
    return () => {
        // This will clean up any running intervals when component unmounts
        setCountdown(5);
    };
}, []);

            
        
// Handle email verification success
useEffect(() => {
    if (verificationData.verified && verificationData.email && isOpen) {
        console.log('Email verification success for:', verificationData.email);
        setShowVerificationSuccess(true);
        setVerificationEmail(verificationData.email);
        setIsLoginView(false); // Show signup form initially
        setVerificationCountdown(5); // Reset countdown to 5
        
        // Start countdown interval
        const countdownInterval = setInterval(() => {
            setVerificationCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 5; // Reset for next time
                }
                return prev - 1;
            });
        }, 1000);
        
        // Auto-switch to login form after 5 seconds
        const timer = setTimeout(() => {
            setShowVerificationSuccess(false);
            setIsLoginView(true);
            // Pre-fill the login email
            setLoginData(prev => ({
                ...prev,
                email: verificationData.email
            }));
            setVerificationCountdown(5); // Reset countdown
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }
}, [verificationData, isOpen]);

    // Function to reset all form data
    const resetAllForms = () => {
        setLoginData({ email: '', password: '' });
        setSignupData({ 
            name: '', 
            email: '', 
            password: '', 
            password_confirmation: '', 
            terms: false 
        });
        setResetPasswordData({ 
            email: '', 
            password: '', 
            password_confirmation: '' 
        });
        setForgotPasswordEmail('');
        setErrors({});
        setSuccessMessage('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setShowResetForm(false);
        setShowForgotPassword(false);
        setIsLoginView(true);
        setForgotPasswordSuccess(false);
        setShowVerificationSuccess(false); // Add this
        setVerificationEmail(''); // Add this
    };

    // CSRF Token function
    const getCsrfToken = async () => {
        try {
            const response = await fetch('/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to get CSRF token');
            }
            
            return true;
        } catch (error) {
            console.error('CSRF token error:', error);
            throw error;
        }
    };

    // Switch between login and signup
    const switchToSignup = () => {
        setIsLoginView(false);
        setErrors({});
        setSuccessMessage('');
        // Clear signup form when switching
        setSignupData({ 
            name: '', 
            email: '', 
            password: '', 
            password_confirmation: '', 
            terms: false 
        });
    };

    const switchToLogin = () => {
        setIsLoginView(true);
        setErrors({});
        setSuccessMessage('');
        // Clear login form when switching
        setLoginData({ email: '', password: '' });
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

    const handleResetPasswordChange = (e) => {
        setResetPasswordData({
            ...resetPasswordData,
            [e.target.name]: e.target.value
        });
    };

    // Handle Forgot Password Submission
    const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setErrors({});
    setForgotPasswordSuccess(false);

    try {
        await getCsrfToken();
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                email: forgotPasswordEmail
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setForgotPasswordSuccess(true);
        } else {
            // RATE LIMITING ERROR HANDLING ADDED
            if (response.status === 429) {
                setErrors({ message: 'Too many password reset attempts. Please try again in a minute.' });
            } else if (data.message && data.message.includes('not found') || data.message && data.message.includes('not registered')) {
                setErrors({ message: 'This email address is not registered in our system.' });
            } else if (data.errors && data.errors.email) {
                setErrors({ message: data.errors.email[0] });
            } else {
                setErrors({ message: data.message || 'Failed to send reset link. Please try again.' });
            }
        }
    } catch (error) {
        setErrors({ message: 'Network error. Please try again.' });
    } finally {
        setForgotPasswordLoading(false);
    }
};

    // Handle Reset Password Submission
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    ...resetPasswordData,
                    token: resetData.token
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Password reset successfully! You can now login with your new password.');
                
                // Clear reset form and close modal after success
                setTimeout(() => {
                    resetAllForms();
                    onClose();
                }, 2000);
            } else {
                setErrors(data.errors || { message: data.message || 'Failed to reset password' });
            }
        } catch (error) {
            setErrors({ message: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
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
            const userResponse = await fetch('/api/user');
            const userData = await userResponse.json();
            
            if (userData.authenticated && !userData.user.email_verified) {
                await fetch('/api/logout', { method: 'POST' });
                setErrors({ message: 'Please verify your email address before logging in.' });
            } else {
                setSuccessMessage('Login successful!');
                setTimeout(() => {
                    resetAllForms();
                    onClose();
                    window.location.reload();
                }, 1500);
            }
        } else {
            // RATE LIMITING ERROR HANDLING ADDED
            if (response.status === 429) {
                setErrors({ message: 'Too many login attempts. Please try again in a minute.' });
            } else {
                setErrors(data.errors || { message: 'Login failed' });
            }
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

        const data = await response.json();

        if (response.ok) {
            setSuccessMessage('Registration successful! Please check your email for verification.');
            setCountdown(6); // Reset countdown to 6
            
            // Start countdown interval
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 6; // Reset for next time
                    }
                    return prev - 1;
                });
            }, 1000);
            
            // Clear signup form and switch to login after 6 seconds
            setTimeout(() => {
                setSignupData({ 
                    name: '', 
                    email: '', 
                    password: '', 
                    password_confirmation: '', 
                    terms: false 
                });
                switchToLogin();
                setCountdown(6); // Reset countdown
            }, 6000);
        } else {
            // RATE LIMITING ERROR HANDLING ADDED
            if (response.status === 429) {
                setErrors({ message: 'Too many registration attempts. Please try again in a minute.' });
            } else {
                setErrors(data.errors || { message: 'Registration failed' });
            }
        }
    } catch (error) {
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
    useEffect(() => {
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
                {isLoginView && !showForgotPassword ? (
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
                                    autoComplete="email"
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
                                        autoComplete="current-password"
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
                                <a href="#forgot" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>
                                    Forgot password?
                                </a>
                            </div>

                           {/* Login Button */}
   <button 
        type="submit" 
        className={`btn btn-primary auth-submit-btn ${loading ? 'button-loading' : ''}`}
        disabled={loading}
    >
        {loading ? (
            <Loading type="dots" size="small" />
        ) : (
            'Login'
        )}
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
                ) : !showForgotPassword ? (
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
        {/* EMAIL VERIFICATION SUCCESS MESSAGE - ADD THIS */}
        {showVerificationSuccess && (
            <div className="success-message" style={{background: '#d4edda', color: '#155724', borderColor: '#c3e6cb'}}>
                <div style={{textAlign: 'center'}}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{margin: '0 auto 0.5rem', display: 'block'}}>
                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 4L12 14.01L9 11.01" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3 style={{margin: '0.5rem 0', color: '#155724'}}>Email Verified Successfully!</h3>
                    <p style={{margin: '0.25rem 0'}}>
                        Your email <strong>{verificationEmail}</strong> has been verified.
                    </p>
                    <p style={{margin: '0.25rem 0 0 0', fontSize: '0.9rem'}}>
                        Redirecting to login in {verificationCountdown} second{verificationCountdown !== 1 ? 's' : ''}...
                    </p>
                </div>
            </div>
        )}

        {/* Success Message */}
                {successMessage && !showVerificationSuccess && (
            <div className="success-message" style={{background: '#d4edda', color: '#155724', borderColor: '#c3e6cb', textAlign: 'center'}}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{margin: '0 auto 0.5rem', display: 'block'}}>
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{margin: '0.5rem 0', color: '#155724'}}>Check Your Email!</h3>
                <p style={{margin: '0.25rem 0'}}>
                    We've sent a verification link to <strong>{signupData.email}</strong>
                </p>
                <p style={{margin: '0.25rem 0 0 0', fontSize: '0.9rem'}}>
                    Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
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
                disabled={loading || showVerificationSuccess}
                autoComplete="name"
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
                disabled={loading || showVerificationSuccess}
                autoComplete="email"
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
                    disabled={loading || showVerificationSuccess}
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || showVerificationSuccess}
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
                    disabled={loading || showVerificationSuccess}
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading || showVerificationSuccess}
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
                    disabled={loading || showVerificationSuccess}
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
        className={`btn btn-primary auth-submit-btn ${loading ? 'button-loading' : ''}`}
        disabled={loading || showVerificationSuccess}
    >
        {loading ? (
            <Loading type="dots" size="small" />
        ) : (
            'Create Account'
        )}
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
                ) : (
                    /* FORGOT PASSWORD / RESET PASSWORD MODAL */
                    <div className="auth-form">
                        {/* Header */}
                        <div className="auth-modal-header">
                            <h2>{showResetForm ? 'Reset Password' : 'Forgot Password'}</h2>
                            <button 
                                className="auth-modal-close" 
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setShowResetForm(false);
                                    resetAllForms();
                                }}
                                aria-label="Close modal"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="auth-form-body">
                            {showResetForm ? (
                                /* RESET PASSWORD FORM */
                                <form onSubmit={handleResetPassword}>
                                    <div className="success-message" style={{background: '#e3f2fd', color: '#1565c0', borderColor: '#bbdefb'}}>
                                        <p style={{margin: 0, textAlign: 'center'}}>
                                            Enter your new password below.
                                        </p>
                                    </div>

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

                                    {/* Email Input - READ ONLY */}
                                    <div className="form-group" style={{marginTop: '1.5rem'}}>
                                        <label htmlFor="reset-email">Email Address</label>
                                        <input
                                            type="email"
                                            id="reset-email"
                                            name="email"
                                            value={resetPasswordData.email}
                                            onChange={handleResetPasswordChange}
                                            placeholder="Enter your email address"
                                            required
                                            disabled={true}
                                            autoComplete="email"
                                            style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                        />
                                        <small style={{color: '#666', fontSize: '0.8rem', marginTop: '0.25rem'}}>
                                            This email is locked for security reasons.
                                        </small>
                                    </div>

                                    {/* New Password Input */}
                                    <div className="form-group">
                                        <label htmlFor="reset-password">New Password</label>
                                        <div className="password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="reset-password"
                                                name="password"
                                                value={resetPasswordData.password}
                                                onChange={handleResetPasswordChange}
                                                placeholder="Enter new password"
                                                required
                                                disabled={loading}
                                                autoComplete="new-password"
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
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="form-group">
                                        <label htmlFor="reset-password-confirm">Confirm New Password</label>
                                        <div className="password-input-container">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="reset-password-confirm"
                                                name="password_confirmation"
                                                value={resetPasswordData.password_confirmation}
                                                onChange={handleResetPasswordChange}
                                                placeholder="Confirm new password"
                                                required
                                                disabled={loading}
                                                autoComplete="new-password"
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

                                   {/* Reset Password Submit Button */}
    <button 
        type="submit" 
        className={`btn btn-primary auth-submit-btn ${loading ? 'button-loading' : ''}`}
        disabled={loading}
    >
        {loading ? (
            <Loading type="dots" size="small" />
        ) : (
            'Reset Password'
        )}
    </button>

                                    {/* Back to Login */}
                                    <div style={{textAlign: 'center', marginTop: '1rem'}}>
                                        <a 
                                            href="#back" 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                setShowResetForm(false);
                                                setShowForgotPassword(false);
                                                resetAllForms();
                                            }}
                                            style={{color: 'var(--racing-red)', textDecoration: 'none', fontSize: '0.9rem'}}
                                        >
                                            ← Back to Login
                                        </a>
                                    </div>
                                </form>
                            ) : forgotPasswordSuccess ? (
                                /* FORGOT PASSWORD SUCCESS */
                                <div className="success-message">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{margin: '0 auto 1rem', display: 'block'}}>
                                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 4L12 14.01L9 11.01" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <h3 style={{textAlign: 'center', marginBottom: '0.5rem', color: '#155724'}}>Check Your Email</h3>
                                    <p style={{textAlign: 'center', margin: 0}}>
                                        We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>
                                    </p>
                                    <p style={{textAlign: 'center', margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                                        Click the link in the email to reset your password.
                                    </p>
                                </div>
                            ) : (
                                /* FORGOT PASSWORD FORM */
                                <form onSubmit={handleForgotPasswordSubmit}>
                                    <div className="success-message" style={{background: '#e3f2fd', color: '#1565c0', borderColor: '#bbdefb'}}>
                                        <p style={{margin: 0, textAlign: 'center'}}>
                                            Enter your email address and we'll send you a link to reset your password.
                                        </p>
                                    </div>

                                    {/* Error Messages */}
                                    {errors.message && (
                                        <div className="error-message">
                                            {errors.message}
                                        </div>
                                    )}

                                    {/* Email Input */}
                                    <div className="form-group" style={{marginTop: '1.5rem'}}>
                                        <label htmlFor="forgot-email">Email Address</label>
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            value={forgotPasswordEmail}
                                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            required
                                            disabled={forgotPasswordLoading}
                                            autoComplete="email"
                                        />
                                    </div>

                                   {/* Forgot Password Submit Button */}
    <button 
        type="submit" 
        className={`btn btn-primary auth-submit-btn ${forgotPasswordLoading ? 'button-loading' : ''}`}
        disabled={forgotPasswordLoading}
    >
        {forgotPasswordLoading ? (
            <Loading type="dots" size="small" />
        ) : (
            'Send Reset Link'
        )}
    </button>

                                    {/* Back to Login */}
                                    <div style={{textAlign: 'center', marginTop: '1rem'}}>
                                        <a 
                                            href="#back" 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                setShowForgotPassword(false); 
                                                resetAllForms();
                                            }}
                                            style={{color: 'var(--racing-red)', textDecoration: 'none', fontSize: '0.9rem'}}
                                        >
                                            ← Back to Login
                                        </a>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

        
};


export default AuthModal;