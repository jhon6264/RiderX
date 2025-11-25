// C:\Users\User\Desktop\RiderX\resources\js\pages\ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../AuthModalContext';
import { useCart } from '../contexts/CartContext';
import Loading from '../components/Loading';
import { formatPrice } from '../utils/currencyFormatter';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [verticalCarouselIndex, setVerticalCarouselIndex] = useState(0);
    
    // Use auth modal context
    const { openAuthModal } = useAuthModal();
    
    // NEW: Use cart context and navigation
    const { addItem } = useCart();
    const navigate = useNavigate();
    
    // Separate loading states for each button
    const [cartLoading, setCartLoading] = useState(false);
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Size options by category
    const sizeOptions = {
        helmets: ['S', 'M', 'L', 'XL', '2XL'],
        jackets: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
        pants: ['24', '26', '28', '30', '32', '34', '36', '38'],
        boots: ['37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
        gloves: ['S', 'M', 'L', 'XL', '2XL']
    };

    // Detailed size charts for each category
    const sizeCharts = {
        helmets: {
            title: "Helmet Size Chart",
            instructions: "Measure around the fullest part of your head, about 1 inch above your eyebrows.",
            columns: ["Size", "Head Circumference (cm)", "Head Circumference (inches)"],
            data: [
                { size: "S", cm: "55-56", inches: "21½-22" },
                { size: "M", cm: "57-58", inches: "22½-22¾" },
                { size: "L", cm: "59-60", inches: "23¼-23½" },
                { size: "XL", cm: "61-62", inches: "24-24½" },
                { size: "2XL", cm: "63-64", inches: "24¾-25¼" }
            ]
        },
        jackets: {
            title: "Jacket Size Chart",
            instructions: "All measurements in inches. Chest: Measure around the fullest part of your chest.",
            columns: ["Size", "Chest (in)", "Waist (in)", "Sleeve (in)"],
            data: [
                { size: "XS", chest: "32-34", waist: "26-28", sleeve: "31" },
                { size: "S", chest: "34-36", waist: "28-30", sleeve: "32" },
                { size: "M", chest: "36-38", waist: "30-32", sleeve: "33" },
                { size: "L", chest: "38-40", waist: "32-34", sleeve: "34" },
                { size: "XL", chest: "40-42", waist: "34-36", sleeve: "35" },
                { size: "2XL", chest: "42-44", waist: "36-38", sleeve: "36" },
                { size: "3XL", chest: "44-46", waist: "38-40", sleeve: "37" },
                { size: "4XL", chest: "46-48", waist: "40-42", sleeve: "38" }
            ]
        },
        pants: {
            title: "Pant Size Chart",
            instructions: "Waist: Measure around your natural waistline. Inseam: Measure from crotch to ankle.",
            columns: ["Size", "Waist (in)", "Inseam (in)", "Hip (in)"],
            data: [
                { size: "24", waist: "24", inseam: "30", hip: "34" },
                { size: "26", waist: "26", inseam: "30", hip: "36" },
                { size: "28", waist: "28", inseam: "31", hip: "38" },
                { size: "30", waist: "30", inseam: "31", hip: "40" },
                { size: "32", waist: "32", inseam: "32", hip: "42" },
                { size: "34", waist: "34", inseam: "32", hip: "44" },
                { size: "36", waist: "36", inseam: "33", hip: "46" },
                { size: "38", waist: "38", inseam: "33", hip: "48" }
            ]
        },
        boots: {
            title: "Boot Size Chart",
            instructions: "Measure your foot length in centimeters for the most accurate fit.",
            columns: ["EU Size", "US Size", "Foot Length (cm)", "Foot Length (inches)"],
            data: [
                { eu: "37", us: "5.5", cm: "23.5", inches: "9.25" },
                { eu: "38", us: "6", cm: "24.1", inches: "9.5" },
                { eu: "39", us: "6.5", cm: "24.8", inches: "9.75" },
                { eu: "40", us: "7.5", cm: "25.4", inches: "10" },
                { eu: "41", us: "8", cm: "26", inches: "10.25" },
                { eu: "42", us: "9", cm: "26.7", inches: "10.5" },
                { eu: "43", us: "9.5", cm: "27.3", inches: "10.75" },
                { eu: "44", us: "10", cm: "28", inches: "11" },
                { eu: "45", us: "11", cm: "28.6", inches: "11.25" },
                { eu: "46", us: "12", cm: "29.3", inches: "11.5" }
            ]
        },
        gloves: {
            title: "Glove Size Chart",
            instructions: "Measure around your dominant hand at the widest part, excluding thumb.",
            columns: ["Size", "Hand Circumference (cm)", "Hand Circumference (inches)"],
            data: [
                { size: "S", cm: "18-19", inches: "7-7.5" },
                { size: "M", cm: "19-20", inches: "7.5-8" },
                { size: "L", cm: "20-21", inches: "8-8.25" },
                { size: "XL", cm: "21-22", inches: "8.25-8.75" },
                { size: "2XL", cm: "22-23", inches: "8.75-9" }
            ]
        }
    };

    // Scroll to top when component mounts AND when id changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/item/${id}`);
            const data = await response.json();
            
            if (data.success) {
                setProduct(data.data);
                setSelectedVariant(data.data.variants[0]);
                const defaultSize = sizeOptions[data.data.category]?.[0] || '';
                setSelectedSize(defaultSize);
                fetchRelatedProducts(data.data.category);
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    // Fetch 8 related products (we'll show 6 at a time)
    const fetchRelatedProducts = async (category) => {
        try {
            const response = await fetch(`/api/products/${category}`);
            const data = await response.json();
            if (data.success) {
                const filtered = data.data.filter(p => p.id !== parseInt(id));
                setRelatedProducts(filtered.slice(0, 8));
            }
        } catch (err) {
            console.error('Error fetching related products:', err);
        }
    };

    // Fetch random products
    const fetchRandomProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            if (data.success) {
                // Filter out current product and related products
                const excludedIds = [parseInt(id), ...relatedProducts.map(p => p.id)];
                const filteredProducts = data.data.filter(p => !excludedIds.includes(p.id));
                
                // Shuffle and take 5
                const shuffled = shuffleArray(filteredProducts).slice(0, 5);
                setRandomProducts(shuffled);
            }
        } catch (err) {
            console.error('Error fetching random products:', err);
        }
    };

    // Shuffle array function (from your ProductGrid)
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Color swatch logic (from your ProductGrid)
    const getColorSwatches = (variants) => {
        const uniqueHexCodes = [...new Set(variants.map(v => v.hex_code))];
        return uniqueHexCodes.slice(0, 4);
    };

    // Get border color for swatches (from your ProductGrid)
    const getBorderColor = (hexCode) => {
        if (!hexCode || typeof hexCode !== 'string') {
            return '#e5e7eb';
        }
        
        try {
            const lightColors = [
                '#ffffff', '#ffff00', '#fbbf24', '#eab308', 
                '#fefce8', '#f0e68c', '#fffdd0', '#f5f5dc', 
                '#d1d5db', '#f8f9fa'
            ];
            
            if (lightColors.includes(hexCode.toLowerCase())) {
                return '#e5e7eb';
            }
            
            return '#ffffff';
        } catch (error) {
            return '#e5e7eb';
        }
    };

    // Vertical carousel navigation for 6 products
    const handleVerticalScroll = (direction) => {
        if (direction === 'up' && verticalCarouselIndex > 0) {
            setVerticalCarouselIndex(verticalCarouselIndex - 1);
        } else if (direction === 'down' && verticalCarouselIndex < relatedProducts.length - 6) {
            setVerticalCarouselIndex(verticalCarouselIndex + 1);
        }
    };

    // Update fetchProduct to also fetch random products
    useEffect(() => {
        if (product && relatedProducts.length > 0) {
            fetchRandomProducts();
        }
    }, [product, relatedProducts]);

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    // UPDATED: Separate auth check functions for each button
    const checkAuthAndAddToCart = async () => {
        setCartLoading(true);
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            
            if (data.authenticated) {
                await handleAddToCart();
            } else {
                openAuthModal();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            alert('Error checking authentication. Please try again.');
        } finally {
            setCartLoading(false);
        }
    };

    // UPDATED: Buy Now - redirects to cart page immediately
    const checkAuthAndBuyNow = async () => {
        setBuyNowLoading(true);
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            
            if (data.authenticated) {
                await handleBuyNow();
            } else {
                openAuthModal();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            alert('Error checking authentication. Please try again.');
        } finally {
            setBuyNowLoading(false);
        }
    };

    // UPDATED: handleAddToCart - adds to cart and shows beautiful modal
    const handleAddToCart = async () => {
        if (!product || !selectedVariant) return;

        const cartItem = {
            productId: product.id,
            variantId: selectedVariant.id,
            size: selectedSize,
            quantity: quantity,
            productName: product.name,
            variantColor: selectedVariant.color,
            price: selectedVariant?.price || product.base_price,
            image: selectedVariant.image
        };

        // Add to cart using context
        addItem(cartItem);
        
        // Show beautiful success modal
        setSuccessMessage(`${quantity} ${product.name} (${selectedVariant.color}, Size: ${selectedSize}) added to cart!`);
        setShowSuccessModal(true);
    };

    // UPDATED: handleBuyNow - adds to cart and redirects immediately
    const handleBuyNow = async () => {
        if (!product || !selectedVariant) return;

        const cartItem = {
            productId: product.id,
            variantId: selectedVariant.id,
            size: selectedSize,
            quantity: quantity,
            productName: product.name,
            variantColor: selectedVariant.color,
            price: selectedVariant?.price || product.base_price,
            image: selectedVariant.image
        };

        // Add to cart using context
        addItem(cartItem);
        
        // Immediately redirect to cart page
        navigate('/cart');
    };

    const openSizeChart = () => {
        setShowSizeChart(true);
    };

    const closeSizeChart = () => {
        setShowSizeChart(false);
    };

// UPDATED: Beautiful Center Success Confirmation Modal Component with Vertical Table
const SuccessModal = () => {
    if (!showSuccessModal || !product) return null;

    return (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
            <div className="success-modal-center" onClick={(e) => e.stopPropagation()}>
                <div className="success-modal-body">
                    <div className="success-product-image">
                        <img 
                            src={selectedVariant?.image} 
                            alt={product.name}
                        />
                    </div>
                    
                    <div className="success-product-info">
                        <h4 className="success-product-name">{product.name}</h4>
                        
                        {/* VERTICAL TABLE STYLE */}
                        <div className="success-product-details-table">
                            <div className="detail-row">
                                <span className="detail-label">Color:</span>
                                <span className="detail-value">{selectedVariant?.color}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Size:</span>
                                <span className="detail-value">{selectedSize}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Quantity:</span>
                                <span className="detail-value">{quantity}</span>
                            </div>
                            <div className="detail-row price-row">
                                <span className="detail-label">Price:</span>
                                <span className="detail-value">
                                    {formatPrice((selectedVariant?.price || product.base_price) * quantity)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="success-modal-footer">
                        <button 
                            className="btn-continue-shopping"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Continue Shopping
                        </button>
                        <button 
                            className="btn-view-cart"
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate('/cart');
                            }}
                        >
                            View Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

    // Vertical Carousel Component (Desktop only)
    const VerticalCarousel = () => {
        if (relatedProducts.length === 0) return null;

        const visibleProducts = relatedProducts.slice(verticalCarouselIndex, verticalCarouselIndex + 6);
        const canScrollUp = verticalCarouselIndex > 0;
        const canScrollDown = verticalCarouselIndex < relatedProducts.length - 6;

        return (
            <div className="vertical-carousel">
                <h3 className="vertical-carousel-title">Related Products</h3>
                <div className="vertical-carousel-container">
                    {/* Top Arrow */}
                    <button 
                        className="carousel-arrow"
                        onClick={() => handleVerticalScroll('up')}
                        disabled={!canScrollUp}
                    >
                        ↑
                    </button>
                    
                    {/* Products */}
                    <div className="vertical-carousel-items">
                        {visibleProducts.map((relatedProduct) => (
                            <Link 
                                key={relatedProduct.id} 
                                to={`/product/${relatedProduct.id}`}
                                className="vertical-product-card"
                            >
                                <img 
                                    src={relatedProduct.variants[0]?.image} 
                                    alt={relatedProduct.name}
                                    className="vertical-product-image"
                                />
                                <div className="vertical-product-info">
                                    <h4>{relatedProduct.name}</h4>
                                    <p className="product-card-brand">{relatedProduct.brand}</p>
                                    <div className="product-card-price">{formatPrice(relatedProduct.base_price)}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {/* Bottom Arrow */}
                    <button 
                        className="carousel-arrow"
                        onClick={() => handleVerticalScroll('down')}
                        disabled={!canScrollDown}
                    >
                        ↓
                    </button>
                </div>
            </div>
        );
    };

    // Related Products Section for Mobile (same design as random products)
    const RelatedProductsSection = () => {
        if (relatedProducts.length === 0) return null;

        return (
            <div className="related-products-section">
                <h2>Related Products</h2>
                <div className="horizontal-carousel">
                    <div className="horizontal-carousel-container">
                        {relatedProducts.slice(0, 5).map((relatedProduct) => {
                            const colorSwatches = getColorSwatches(relatedProduct.variants);
                            const hasMoreColors = relatedProduct.variants.length > 4;
                            
                            return (
                                <Link 
                                    key={relatedProduct.id} 
                                    to={`/product/${relatedProduct.id}`}
                                    className="horizontal-product-card"
                                >
                                    <img 
                                        src={relatedProduct.variants[0]?.image} 
                                        alt={relatedProduct.name}
                                        className="horizontal-product-image"
                                    />
                                    <div className="horizontal-product-content">
                                        <h4>{relatedProduct.name}</h4>
                                        <p className="product-card-brand">{relatedProduct.brand}</p>
                                        
                                        {/* Color Swatches */}
                                        <div className="product-card-colors">
                                            {colorSwatches.map((hexCode, index) => {
                                                const variantWithThisColor = relatedProduct.variants.find(v => v.hex_code === hexCode);
                                                const colorName = variantWithThisColor?.color || `Color ${index + 1}`;
                                                
                                                return (
                                                    <div 
                                                        key={index}
                                                        className="color-swatch"
                                                        style={{ 
                                                            backgroundColor: hexCode || '#6b7280',
                                                            borderColor: getBorderColor(hexCode)
                                                        }}
                                                        title={colorName}
                                                    />
                                                );
                                            })}
                                            {hasMoreColors && (
                                                <div className="color-swatch-more" title={`+${relatedProduct.variants.length - 4} more colors`}>
                                                    +
                                                </div>
                                            )}
                                        </div>
                                        
                                       <div className="product-card-price">{formatPrice(relatedProduct.base_price)}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Random Products Section
    const RandomProductsSection = () => {
        if (randomProducts.length === 0) return null;

        return (
            <div className="random-products-section">
                <h2>You Might Also Like</h2>
                <div className="horizontal-carousel">
                    <div className="horizontal-carousel-container">
                        {randomProducts.map((randomProduct) => {
                            const colorSwatches = getColorSwatches(randomProduct.variants);
                            const hasMoreColors = randomProduct.variants.length > 4;
                            
                            return (
                                <Link 
                                    key={randomProduct.id} 
                                    to={`/product/${randomProduct.id}`}
                                    className="horizontal-product-card"
                                >
                                    <img 
                                        src={randomProduct.variants[0]?.image} 
                                        alt={randomProduct.name}
                                        className="horizontal-product-image"
                                    />
                                    <div className="horizontal-product-content">
                                        <h4>{randomProduct.name}</h4>
                                        <p className="product-card-brand">{randomProduct.brand}</p>
                                        
                                        {/* Color Swatches */}
                                        <div className="product-card-colors">
                                            {colorSwatches.map((hexCode, index) => {
                                                const variantWithThisColor = randomProduct.variants.find(v => v.hex_code === hexCode);
                                                const colorName = variantWithThisColor?.color || `Color ${index + 1}`;
                                                
                                                return (
                                                    <div 
                                                        key={index}
                                                        className="color-swatch"
                                                        style={{ 
                                                            backgroundColor: hexCode || '#6b7280',
                                                            borderColor: getBorderColor(hexCode)
                                                        }}
                                                        title={colorName}
                                                    />
                                                );
                                            })}
                                            {hasMoreColors && (
                                                <div className="color-swatch-more" title={`+${randomProduct.variants.length - 4} more colors`}>
                                                    +
                                                </div>
                                            )}
                                        </div>
                                        
                                       <div className="product-card-price">{formatPrice(randomProduct.base_price)}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Tabs Component
    const ProductTabs = () => (
        <div className="product-tabs">
            <div className="tabs-header">
                <button 
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews & Ratings
                </button>
            </div>
            
            <div className="tabs-content">
                <div className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
                    <div className="product-description">
                        <h3>Product Description</h3>
                        <p>{product?.description}</p>
                    </div>
                    
                    <div className="product-specifications">
                        <h3>Specifications</h3>
                        <div className="specs-grid">
                            <div className="spec-item">
                                <strong>Brand:</strong> {product?.brand}
                            </div>
                            <div className="spec-item">
                                <strong>Category:</strong> {product?.category}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={`tab-content ${activeTab === 'reviews' ? 'active' : ''}`}>
                    <div className="reviews-section">
                        <h3>Customer Reviews</h3>
                        <div className="reviews-summary">
                            <div className="overall-rating">
                                <div className="rating-stars">
                                    {'★'.repeat(5)}
                                </div>
                                <span className="rating-text">4.8 out of 5</span>
                                <span className="review-count">(124 reviews)</span>
                            </div>
                        </div>
                        <div className="reviews-list">
                            <p>No reviews yet. Be the first to review this product!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Size Chart Modal Component
    const SizeChartModal = () => {
        const [isVisible, setIsVisible] = useState(false);
        const [shouldRender, setShouldRender] = useState(false);

        useEffect(() => {
            if (showSizeChart) {
                setShouldRender(true);
                setTimeout(() => setIsVisible(true), 10);
            } else {
                setIsVisible(false);
                setTimeout(() => setShouldRender(false), 300);
            }
        }, [showSizeChart]);

        if (!shouldRender || !product) return null;

        const chart = sizeCharts[product.category];
        if (!chart) return null;

        return (
            <div className={`size-chart-overlay ${isVisible ? 'visible' : ''}`} onClick={closeSizeChart}>
                <div className="size-chart-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="size-chart-header">
                        <h2>{chart.title}</h2>
                        <button className="close-button" onClick={closeSizeChart}>×</button>
                    </div>
                    <div className="size-chart-content">
                        <p className="size-chart-instructions">{chart.instructions}</p>
                        <div className="size-chart-table">
                            <table>
                                <thead>
                                    <tr>
                                        {chart.columns.map((column, index) => (
                                            <th key={index}>{column}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {chart.data.map((row, index) => (
                                        <tr key={index}>
                                            {chart.columns.map((column, colIndex) => (
                                                <td key={colIndex}>
                                                    {row[column.toLowerCase().replace(/[^a-z]/g, '')] || row[Object.keys(row)[colIndex]]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="size-chart-tips">
                            <h4>Fitting Tips:</h4>
                            <ul>
                                <li>Always measure yourself while wearing typical riding gear</li>
                                <li>If between sizes, we recommend sizing up for comfort</li>
                                <li>Consider the type of riding you'll be doing when choosing fit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-loading">
                    <Loading 
                        type="progress" 
                        message="Gearing up your product..." 
                        size="large" 
                    />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-error">
                    <h2>Product Not Found</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-to-home">Back to Home</Link>
                </div>
            </div>
        );
    }

    const currentSizes = sizeOptions[product.category] || [];

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Breadcrumb Navigation */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span> / </span>
                    <Link to={`/${product.category}`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Link>
                    <span> / </span>
                    <span>{product.name}</span>
                </nav>

                {/* NEW 2-COLUMN LAYOUT */}
                <div className="product-detail-content">
                    {/* Vertical Related Products Carousel - SEPARATE COLUMN (Desktop only) */}
                    <VerticalCarousel />
                    
                    {/* MAIN CONTENT AREA - VERTICAL STACK */}
                    <div className="main-content-area">
                        {/* Product Images and Info - SIDE BY SIDE */}
                        <div className="product-main-section">
                            {/* Product Images Section - LARGER */}
                            <div className="product-images">
                                <div className="main-image">
                                    <img 
                                        src={selectedVariant?.image} 
                                        alt={product.name}
                                        className="product-main-image"
                                    />
                                </div>
                            </div>

                            {/* Product Info Section */}
                            <div className="product-info">
                                <h1 className="product-title">{product.name}</h1>
                                <p className="product-brand">{product.brand}</p>
                                
                                <div className="product-price">
                                    {formatPrice(selectedVariant?.price || product.base_price)}
                                </div>

                                {/* Star Rating */}
                                <div className="product-rating">
                                    <div className="stars">
                                        {'★'.repeat(5)}
                                        <span className="rating-text">(4.8) 124 Reviews</span>
                                    </div>
                                </div>

                                {/* Variant Image Gallery */}
                                <div className="variant-gallery">
                                    <div className="color-indicator">
                                        <strong>Color: </strong>
                                        {selectedVariant?.color}
                                    </div>
                                    <div className="variant-images">
                                        {product.variants.map((variant) => (
                                            <div
                                                key={variant.id}
                                                className={`variant-image-box ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                                                onClick={() => handleVariantSelect(variant)}
                                            >
                                                <img 
                                                    src={variant.image} 
                                                    alt={variant.color}
                                                    className="variant-thumbnail"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector */}
                                {currentSizes.length > 0 && (
                                    <div className="size-selector">
                                        <div className="size-header">
                                            <div className="size-indicator">
                                                <strong>Size: </strong>
                                                {selectedSize}
                                            </div>
                                            <button 
                                                className="size-guide-link"
                                                onClick={openSizeChart}
                                            >
                                                Size Guide
                                            </button>
                                        </div>
                                        <div className="size-options">
                                            {currentSizes.map((size) => (
                                                <button
                                                    key={size}
                                                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                                    onClick={() => handleSizeSelect(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* UPDATED: Action Buttons with Independent Loading */}
                                <div className="action-buttons-row">
                                    <div className="quantity-selector">
                                        <label htmlFor="quantity">Qty:</label>
                                        <select 
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        >
                                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button 
                                        className={`add-to-cart-btn ${cartLoading ? 'button-loading' : ''}`}
                                        onClick={checkAuthAndAddToCart}
                                        disabled={cartLoading || buyNowLoading}
                                    >
                                        {cartLoading ? (
                                            <Loading type="dots" size="small" />
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>

                                    <button 
                                        className={`buy-now-btn ${buyNowLoading ? 'button-loading' : ''}`}
                                        onClick={checkAuthAndBuyNow}
                                        disabled={buyNowLoading || cartLoading}
                                    >
                                        {buyNowLoading ? (
                                            <Loading type="dots" size="small" />
                                        ) : (
                                            'Buy Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <ProductTabs />

                        {/* Related Products Section - MOBILE ONLY (FIRST) */}
                        <RelatedProductsSection />

                        {/* Random Products Section - MOBILE (SECOND) */}
                        <RandomProductsSection />
                    </div>
                </div>
            </div>

            {/* Size Chart Modal */}
            <SizeChartModal />

            {/* UPDATED: Beautiful Center Success Confirmation Modal */}
            <SuccessModal />
        </div>
    );
};

export default ProductDetailPage;