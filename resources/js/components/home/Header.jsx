import React, { useState, useEffect } from 'react';
import UserDropdown from '../../UserDropdown';
import { Link } from 'react-router-dom';

const Header = ({ onAuthModalOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPromo, setCurrentPromo] = useState(0);
    const [authState, setAuthState] = useState({
        authenticated: false,
        user: null,
        loading: true
    });
    const [showDropdown, setShowDropdown] = useState(false);

    const promoMessages = [
        "Now we offer you to Pay in Gcash Directly! with Free Shipping!",
        "Every Holiday is a Special Holiday Sale - Up to 50% Off!",
        "New Arrivals Just Dropped - Shop Now!",
        "Free Returns Within 3 Days"
    ];

    // Check authentication status
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            
            setAuthState({
                authenticated: data.authenticated,
                user: data.user || null,
                loading: false
            });
        } catch (error) {
            console.error('Auth check failed:', error);
            setAuthState({
                authenticated: false,
                user: null,
                loading: false
            });
        }
    };

    // Check auth on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Promo carousel effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promoMessages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [promoMessages.length]);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleUserIconClick = () => {
        if (authState.authenticated) {
            // Show dropdown for logged-in users
            setShowDropdown(!showDropdown);
        } else {
            // Show auth modal for logged-out users
            if (onAuthModalOpen) {
                onAuthModalOpen();
            }
        }
    };

    const handleCloseDropdown = () => {
        setShowDropdown(false);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include'
            });

            if (response.ok) {
                // Update auth state
                setAuthState({
                    authenticated: false,
                    user: null,
                    loading: false
                });
                setShowDropdown(false);
                
                // Refresh the page to update the UI completely
                window.location.reload();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <>
            {/* Promo Banner - NOT FIXED, scrolls away */}
            <div className="promo-banner">
                <div className="promo-container">
                    <div className="promo-carousel">
                        {promoMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`promo-slide ${index === currentPromo ? 'active' : ''}`}
                            >
                                {message}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Header (fixed) */}
            <header className="header">
                {/* Main Header */}
                <div className="main-header">
                    <div className="header-container">
                        {/* Logo */}
                        <div className="logo">
                            <img src="/img/logo.png" alt="Brand Logo" className="logo-img" />
                        </div>

                        {/* Box Style Search Bar */}
                        <div className="search-container">
                            <div className="search-box">
                                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L16.7 16.7M19 11C19 15.4 15.4 19 11 19C6.6 19 3 15.4 3 11C3 6.6 6.6 3 11 3C15.4 3 19 6.6 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <input 
                                    type="text" 
                                    placeholder="Search jackets, helmets, gear..." 
                                    className="search-bar"
                                />
                            </div>
                        </div>

                        {/* Header Icons Group */}
                        <div className="header-icons-group">
                            {/* Cart Icon - Only show when logged in */}
                            {authState.authenticated && (
                                <button className="icon-btn cart-btn" aria-label="Shopping cart">
                                    <svg className="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="8" cy="21" r="1"/>
  <circle cx="19" cy="21" r="1"/>
  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
</svg>
                                    <span className="cart-count">0</span>
                                </button>
                            )}

                            {/* Track Order Icon - Only show when logged in */}
                            {authState.authenticated && (
                                <button className="icon-btn track-btn" aria-label="Track order">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  <path d="M12 3v6"/>
  <path d="M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z"/>
  <path d="M3.054 9.013h17.893"/>
</svg>
                                </button>
                            )}

                            {/* User Icon - Always visible */}
                            <div className="user-icon-container">
                                <button 
                                    className={`icon-btn user-btn ${showDropdown ? 'active' : ''}`}
                                    aria-label="User account"
                                    onClick={handleUserIconClick}
                                >
                                    <svg className="user-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                         <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* User Dropdown - Only show when logged in and dropdown is open */}
                                {authState.authenticated && showDropdown && (
                                    <UserDropdown 
                                        user={authState.user}
                                        onClose={handleCloseDropdown}
                                        onLogout={handleLogout}
                                    />
                                )}
                            </div>
                            
                            {/* Hamburger Menu - Mobile Only */}
                            <button 
                                className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rest of your header code remains the same */}
                <div className="subheader">
                    <div className="subheader-container">
                        <nav className="category-nav">
                            <Link to="/" className="category-link active">Home</Link>
                            <Link to="/helmets" className="category-link">Helmets</Link>
                            <Link to="/jackets" className="category-link">Jackets</Link>
                            <Link to="/pants" className="category-link">Pants</Link>
                            <Link to="/boots" className="category-link">Boots</Link>
                            <Link to="/gloves" className="category-link">Gloves</Link>
                        </nav>
                    </div>
                </div>

                {/* Mobile Sliding Navigation */}
                <div 
                    className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`}
                    onClick={closeMenu}
                ></div>
                
                <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                    {/* Mobile Menu Header */}
                    <div className="mobile-nav-header">
                        <h2 className="mobile-nav-title">Menu</h2>
                        <button 
                            className="mobile-nav-close"
                            onClick={closeMenu}
                            aria-label="Close menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation List */}
                    <ul className="mobile-nav-menu">
                        <li>
                            <a href="#" className="mobile-nav-link active" onClick={closeMenu}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="mobile-nav-link" onClick={closeMenu}>
                                Helmets
                            </a>
                        </li>
                        <li>
                            <a href="#" className="mobile-nav-link" onClick={closeMenu}>
                                Jackets
                            </a>
                        </li>
                        <li>
                            <a href="#" className="mobile-nav-link" onClick={closeMenu}>
                                Pants
                            </a>
                        </li>
                        <li>
                            <a href="#" className="mobile-nav-link" onClick={closeMenu}>
                                Boots
                            </a>
                        </li>
                        <li>
                            <a href="#" className="mobile-nav-link" onClick={closeMenu}>
                                Gloves
                            </a>
                        </li>
                    </ul>
                    
                    {/* Mobile Menu Footer */}
                    <div className="mobile-nav-footer">
                        <div className="mobile-footer-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  <path d="M12 3v6"/>
  <path d="M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z"/>
  <path d="M3.054 9.013h17.893"/>
</svg>
                            <span className="footer-text">Order</span>
                        </div>
                        <div className="mobile-footer-item">
                            <svg className="footer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15C21 15.53 20.81 16.04 20.47 16.41C19.69 17.27 18.41 17.27 17.63 16.41C17.29 16.04 17.1 15.53 17.1 15C17.1 13.74 18.09 12.75 19.35 12.75C20.61 12.75 21.6 13.74 21.6 15H21ZM11.5 12C13.71 12 15.5 10.21 15.5 8C15.5 5.79 13.71 4 11.5 4C9.29 4 7.5 5.79 7.5 8C7.5 10.21 9.29 12 11.5 12ZM11.5 14C8.74 14 2 15.34 2 18V20H21V18C21 15.34 14.26 14 11.5 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="footer-text">Contact us</span>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;