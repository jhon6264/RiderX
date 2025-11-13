import React, { useState, useEffect } from 'react';

const Header = ({ onAuthModalOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPromo, setCurrentPromo] = useState(0);

    const promoMessages = [
        "Now we offer you to Pay in Gcash Directly! with Free Shipping!",
        "Every Holiday is Special Holiday Sale - Up to 50% Off!",
        "New Arrivals Just Dropped - Shop Now!",
        "Free Returns Within 3 Days"
    ];

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
        if (onAuthModalOpen) {
            onAuthModalOpen();
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
                            <button className="icon-btn cart-btn" aria-label="Shopping cart">
                                <svg className="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.2 16.5H17M17 13V16.5M9 19.5C9 20.3 8.3 21 7.5 21C6.7 21 6 20.3 6 19.5C6 18.7 6.7 18 7.5 18C8.3 18 9 18.7 9 19.5ZM18 19.5C18 20.3 17.3 21 16.5 21C15.7 21 15 20.3 15 19.5C15 18.7 15.7 18 16.5 18C17.3 18 18 18.7 18 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="cart-count">0</span>
                            </button>
                            <button 
                                className="icon-btn user-btn" 
                                aria-label="User account"
                                onClick={handleUserIconClick}
                            >
                                <svg className="user-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            
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
                            <a href="#" className="category-link active">Home</a>
                            <a href="#" className="category-link">Helmets</a>
                            <a href="#" className="category-link">Jackets</a>
                            <a href="#" className="category-link">Pants</a>
                            <a href="#" className="category-link">Boots</a>
                            <a href="#" className="category-link">Gloves</a>
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
                            <svg className="footer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="footer-text">Sign in</span>
                        </div>
                        <div className="mobile-footer-item">
                            <svg className="footer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM8 13H6V11H8V13ZM8 17H6V15H8V17ZM14 13H10V11H14V13ZM14 17H10V15H14V17ZM18 13H16V11H18V13ZM18 17H16V15H18V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="footer-text">Track order</span>
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