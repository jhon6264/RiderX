// C:\Users\User\Desktop\RiderX\resources\js\components\home\Header.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import UserDropdown from '../../UserDropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../AuthModalContext';
import { useCart } from '../../contexts/CartContext';
import CartModal from '../../contexts/CartModal';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPromo, setCurrentPromo] = useState(0);
    const [authState, setAuthState] = useState({
        authenticated: false,
        user: null,
        loading: true
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [particleAnimationId, setParticleAnimationId] = useState(null);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { openAuthModal } = useAuthModal();
    const { itemCount } = useCart();
    const promoIntervalRef = useRef(null);
    const searchTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    const promoMessages = [
        "Now we offer you to Pay in Gcash Directly! with Free Shipping!",
        "Every Holiday is a Special Holiday Sale - Up to 50% Off!",
        "New Arrivals Just Dropped - Shop Now!",
        "Free Returns Within 3 Days"
    ];

    // ==================== PARTICLE SYSTEM ====================
    const initParticles = useCallback(() => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 2; // INCREASED: 2-4px (was 1-3px)
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.4 + 0.3; // INCREASED: 30-70% (was 10-40%)
                this.pulseSpeed = Math.random() * 0.03 + 0.02; // Faster pulsing
                this.pulseOffset = Math.random() * Math.PI * 2;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Enhanced pulse animation
                const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.7 + 0.7;
                this.currentOpacity = this.opacity * pulse;
                
                // Wrap around edges
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(230, 57, 70, ${this.currentOpacity})`; // Red color
                ctx.fill();
            }
        }
        
        // Create particles - MORE particles
        const particleCount = isScrolled ? 20 : 35; // More particles (was 15 and 25)
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        particlesRef.current = particles;
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(26, 26, 26, 0.95)');
            gradient.addColorStop(1, 'rgba(40, 40, 40, 0.95)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            const animationId = requestAnimationFrame(animate);
            setParticleAnimationId(animationId);
        };
        
        animate();
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (particleAnimationId) {
                cancelAnimationFrame(particleAnimationId);
            }
        };
    }, [isScrolled]);

    useEffect(() => {
        if (canvasRef.current) {
            const cleanup = initParticles();
            return cleanup;
        }
    }, [initParticles]);

    // ==================== FUZZY SEARCH ====================
    const fuseInstance = useMemo(() => {
        if (allProducts.length === 0) return null;
        
        const options = {
            keys: ['name', 'brand', 'category'],
            threshold: 0.3,
            includeScore: true,
            minMatchCharLength: 2,
            ignoreLocation: true,
            distance: 100
        };
        
        return new Fuse(allProducts, options);
    }, [allProducts]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                
                if (data.success && data.data) {
                    const flattenedProducts = data.data.flatMap(product => 
                        product.variants.map(variant => ({
                            id: product.id,
                            name: product.name,
                            brand: product.brand,
                            category: product.category,
                            base_price: product.base_price,
                            variant_id: variant.id,
                            color: variant.color,
                            image: variant.image,
                            price: variant.price
                        }))
                    );
                    setAllProducts(flattenedProducts);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        
        fetchProducts();
    }, []);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside to close search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && 
                !searchContainerRef.current.contains(event.target) &&
                !searchInputRef.current?.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActiveLink = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

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

    useEffect(() => {
        checkAuthStatus();
    }, [location.pathname]);

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
                setShowSearchResults(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Promo carousel
    useEffect(() => {
        promoIntervalRef.current = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promoMessages.length);
        }, 4000);

        return () => {
            if (promoIntervalRef.current) {
                clearInterval(promoIntervalRef.current);
            }
        };
    }, [promoMessages.length]);

    // Fuzzy search function
    const performSearch = useCallback((query) => {
        if (!query.trim() || query.length < 1) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        
        if (fuseInstance) {
            const results = fuseInstance.search(query);
            
            const formattedResults = results
                .slice(0, 4)
                .map(result => ({
                    ...result.item,
                    score: result.score
                }));
            
            setSearchResults(formattedResults);
            setShowSearchResults(formattedResults.length > 0);
        } else {
            const filteredResults = allProducts
                .filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase()) ||
                    product.brand.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 4);
            
            setSearchResults(filteredResults);
            setShowSearchResults(filteredResults.length > 0);
        }
        
        setIsSearching(false);
    }, [fuseInstance, allProducts]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSearchResults(false);
            setSearchQuery('');
        }
    };

    const handleResultClick = (product) => {
        navigate(`/product/${product.id}?variant=${product.variant_id}`);
        setShowSearchResults(false);
        setSearchQuery('');
        if (searchInputRef.current) {
            searchInputRef.current.blur();
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleCartIconClick = () => {
        setShowCartModal(true);
    };

    const handleCloseCartModal = () => {
        setShowCartModal(false);
    };

    const handleUserIconClick = () => {
        if (authState.authenticated) {
            setShowDropdown(!showDropdown);
        } else {
            openAuthModal();
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
                setAuthState({
                    authenticated: false,
                    user: null,
                    loading: false
                });
                setShowDropdown(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Animation variants
    const promoVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 }
    };

    const mobileMenuVariants = {
        closed: { x: '100%' },
        open: { x: 0 }
    };

    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const hamburgerVariants = {
        closed: { rotate: 0 },
        open: { rotate: 180 }
    };

    const cartBounceVariants = {
        normal: { scale: 1 },
        bounce: { 
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
        }
    };

    const searchResultsVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const searchResultItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            {/* Promo Banner */}
            <motion.div 
                className="promo-banner"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="promo-container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPromo}
                            className="promo-slide"
                            variants={promoVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                        >
                            {promoMessages[currentPromo]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Main Header with Particle Animation */}
            <motion.header 
                className={`header ${isScrolled ? 'scrolled' : ''}`}
                initial={false}
                animate={{ 
                    boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "0 2px 20px rgba(0,0,0,0.1)"
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Particle Canvas Background */}
                <canvas 
                    ref={canvasRef}
                    className="particle-canvas"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: -1
                    }}
                />
                
                {/* Main Header Section */}
                <div className="main-header">
                    <div className="header-container">
                        {/* Desktop: Logo - Search - Icons (single row) */}
                        {/* Mobile: Logo + Icons (row 1), Search (row 2) */}
                        
                        {/* Logo (Desktop: left, Mobile: left in first row) */}
                        <motion.div 
                            className="logo"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/">
                                <img src="/img/logo.png" alt="RiderX Logo" className="logo-img" />
                            </Link>
                        </motion.div>

                        {/* Search Bar (Desktop: middle, Mobile: second row) */}
                        <div className="search-container" ref={searchContainerRef}>
                            <form onSubmit={handleSearchSubmit} className="search-form">
                                <motion.div 
                                    className="search-box"
                                    whileFocus={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <input 
                                        ref={searchInputRef}
                                        type="text" 
                                        placeholder="Search jackets, helmets, gear..." 
                                        className="search-bar"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            type="button"
                                            className="search-clear"
                                            onClick={clearSearch}
                                            aria-label="Clear search"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="search-loading">
                                            <div className="loading-dot"></div>
                                            <div className="loading-dot"></div>
                                            <div className="loading-dot"></div>
                                        </div>
                                    )}
                                </motion.div>
                            </form>

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showSearchResults && searchResults.length > 0 && (
                                    <motion.div 
                                        className="search-results-dropdown"
                                        variants={searchResultsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <div className="search-results-header">
                                            <span className="results-count">
                                                Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="search-results-list">
                                            {searchResults.map((product, index) => (
                                                <motion.div
                                                    key={`${product.id}-${product.variant_id}`}
                                                    className="search-result-item"
                                                    variants={searchResultItemVariants}
                                                    whileHover={{ backgroundColor: 'rgba(230, 57, 70, 0.1)' }}
                                                    onClick={() => handleResultClick(product)}
                                                >
                                                    <div className="result-image">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/40x40/f8f9fa/666666?text=Product';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="result-info">
                                                        <div className="result-name">{product.name}</div>
                                                        <div className="result-details">
                                                            <span className="result-brand">{product.brand}</span>
                                                            <span className="result-category">{product.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="result-arrow">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M9 18l6-6-6-6"/>
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="search-results-footer">
                                            <button 
                                                className="view-all-results"
                                                onClick={() => {
                                                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                    setShowSearchResults(false);
                                                }}
                                            >
                                                View all results for "{searchQuery}"
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Header Icons Group (Desktop: right, Mobile: right in first row) */}
                        <div className="header-icons-group">
                            {/* Cart Icon */}
                            {authState.authenticated && (
                                <motion.button 
                                    className="icon-btn cart-btn" 
                                    aria-label="Shopping cart"
                                    onClick={handleCartIconClick}
                                    variants={cartBounceVariants}
                                    animate={itemCount > 0 ? "bounce" : "normal"}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg className="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="8" cy="21" r="1"/>
                                        <circle cx="19" cy="21" r="1"/>
                                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                    </svg>
                                    <motion.span 
                                        className="cart-count"
                                        key={itemCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    >
                                        {itemCount}
                                    </motion.span>
                                </motion.button>
                            )}

                            {/* Track Order Icon */}
                            {authState.authenticated && (
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Link to="/orders" className="icon-btn track-btn" aria-label="Track order">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3v6"/>
                                            <path d="M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z"/>
                                            <path d="M3.054 9.013h17.893"/>
                                        </svg>
                                    </Link>
                                </motion.div>
                            )}

                            {/* User Icon */}
                            <div className="user-icon-container">
                                <motion.button 
                                    className={`icon-btn user-btn ${showDropdown ? 'active' : ''}`}
                                    aria-label="User account"
                                    onClick={handleUserIconClick}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg className="user-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>

                                <AnimatePresence>
                                    {authState.authenticated && showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <UserDropdown 
                                                user={authState.user}
                                                onClose={handleCloseDropdown}
                                                onLogout={handleLogout}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            {/* Hamburger Menu (Mobile only) */}
                            <motion.button 
                                className="hamburger"
                                onClick={toggleMenu} 
                                aria-label="Toggle menu"
                                aria-expanded={isMenuOpen}
                                variants={hamburgerVariants}
                                animate={isMenuOpen ? "open" : "closed"}
                                whileTap={{ scale: 0.9 }}
                            >
                                <motion.span 
                                    animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.span 
                                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.span 
                                    animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Subheader with Categories */}
                <div className="subheader">
                    <div className="subheader-container">
                        <nav className="category-nav">
                            {['/', '/helmets', '/jackets', '/pants', '/boots', '/gloves'].map((path, index) => (
                                <motion.div
                                    key={path}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link 
                                        to={path === '/' ? '/' : path}
                                        className={`category-link ${isActiveLink(path) ? 'active' : ''}`}
                                    >
                                        {path === '/' ? 'Home' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div 
                            className="mobile-nav-overlay"
                            variants={overlayVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            onClick={closeMenu}
                        />
                        
                        <motion.div 
                            className="mobile-nav"
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Mobile Menu Header */}
                            <div className="mobile-nav-header">
                                <h2 className="mobile-nav-title">Menu</h2>
                                <motion.button 
                                    className="mobile-nav-close"
                                    onClick={closeMenu}
                                    aria-label="Close menu"
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </motion.button>
                            </div>

                            {/* Mobile Navigation List */}
                            <ul className="mobile-nav-menu">
                                {['/', '/helmets', '/jackets', '/pants', '/boots', '/gloves'].map((path, index) => (
                                    <motion.li
                                        key={path}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link 
                                            to={path === '/' ? '/' : path}
                                            className={`mobile-nav-link ${isActiveLink(path) ? 'active' : ''}`}
                                            onClick={closeMenu}
                                        >
                                            {path === '/' ? 'Home' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                            
                            {/* Mobile Menu Footer */}
                            <div className="mobile-nav-footer">
                                {['Order', 'Contact us'].map((text, index) => (
                                    <motion.div 
                                        key={text}
                                        className="mobile-footer-item"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.1) }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3v6"/>
                                            <path d="M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z"/>
                                            <path d="M3.054 9.013h17.893"/>
                                        </svg>
                                        <span className="footer-text">{text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Cart Modal */}
            <CartModal isOpen={showCartModal} onClose={handleCloseCartModal} />
        </>
    );
};

export default Header;