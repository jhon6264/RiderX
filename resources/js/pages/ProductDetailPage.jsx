import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../AuthModalContext';
import { useCart } from '../contexts/CartContext';
import Loading from '../components/Loading';
import { formatPrice } from '../utils/currencyFormatter';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom'; // NEW: Import createPortal

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

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const slideUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const scaleUp = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.3 }
        }
    };

    const buttonHover = {
        scale: 1.05,
        transition: { duration: 0.2 }
    };

    const buttonTap = {
        scale: 0.95,
        transition: { duration: 0.1 }
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

    // Fetch 8 related products (we'll show 8 in grid)
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

    // ===== SKELETON LOADING COMPONENTS =====
    const SkeletonImage = () => (
        <div className="skeleton-image">
            <div className="skeleton-shimmer"></div>
        </div>
    );

    const SkeletonText = ({ width = '100%', height = '1rem' }) => (
        <div className="skeleton-text" style={{ width, height }}>
            <div className="skeleton-shimmer"></div>
        </div>
    );

    const SkeletonButton = ({ width = '100px', height = '2.5rem' }) => (
        <div className="skeleton-button" style={{ width, height }}>
            <div className="skeleton-shimmer"></div>
        </div>
    );

    const SkeletonVariant = () => (
        <div className="skeleton-variant">
            <div className="skeleton-shimmer"></div>
        </div>
    );

    const SkeletonSize = () => (
        <div className="skeleton-size">
            <div className="skeleton-shimmer"></div>
        </div>
    );

    const ProductSkeleton = () => (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Breadcrumb Skeleton */}
                <div className="breadcrumb skeleton">
                    <SkeletonText width="60%" height="0.8rem" />
                </div>

                <div className="product-detail-content">
                    {/* Vertical Carousel Skeleton */}
                    <div className="vertical-carousel skeleton">
                        <SkeletonText width="150px" height="1.1rem" />
                        <div className="vertical-carousel-container">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="vertical-product-card skeleton">
                                    <SkeletonImage />
                                    <div className="vertical-product-info">
                                        <SkeletonText width="80%" height="0.8rem" />
                                        <SkeletonText width="60%" height="0.7rem" />
                                        <SkeletonText width="40%" height="0.9rem" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="main-content-area">
                        <div className="product-main-section">
                            {/* Product Images Skeleton */}
                            <div className="product-images">
                                <div className="main-image skeleton">
                                    <SkeletonImage />
                                </div>
                            </div>

                            {/* Product Info Skeleton */}
                            <div className="product-info skeleton">
                                <SkeletonText width="80%" height="1.6rem" />
                                <SkeletonText width="40%" height="0.9rem" />
                                <SkeletonText width="30%" height="2.2rem" />
                                
                                {/* Star Rating Skeleton */}
                                <div className="product-rating">
                                    <SkeletonText width="100px" height="1.1rem" />
                                </div>

                                {/* Variant Gallery Skeleton */}
                                <div className="variant-gallery">
                                    <SkeletonText width="60px" height="0.9rem" />
                                    <div className="variant-images">
                                        {[...Array(4)].map((_, i) => (
                                            <SkeletonVariant key={i} />
                                        ))}
                                    </div>
                                </div>

                                {/* Size Selector Skeleton */}
                                <div className="size-selector">
                                    <SkeletonText width="100px" height="0.9rem" />
                                    <div className="size-options">
                                        {[...Array(5)].map((_, i) => (
                                            <SkeletonSize key={i} />
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons Skeleton */}
                                <div className="action-buttons-row">
                                    <div className="quantity-selector">
                                        <SkeletonText width="30px" height="0.9rem" />
                                        <SkeletonText width="60px" height="2rem" />
                                    </div>
                                    <SkeletonButton width="120px" height="2.5rem" />
                                    <SkeletonButton width="120px" height="2.5rem" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ===== UPDATED: Beautiful Center Success Confirmation Modal Component =====
    const SuccessModal = () => {
        if (!showSuccessModal || !product) return null;

        // Use portal to render directly in body
        return createPortal(
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div 
                        className="success-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSuccessModal(false)}
                    >
                        <motion.div 
                            className="success-modal-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="success-modal-body">
                                <motion.div 
                                    className="success-product-image"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                >
                                    <img 
                                        src={selectedVariant?.image} 
                                        alt={product.name}
                                    />
                                </motion.div>
                                
                                <motion.div 
                                    className="success-product-info"
                                    variants={fadeIn}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <h4 className="success-product-name">{product.name}</h4>
                                    
                                    {/* VERTICAL TABLE STYLE */}
                                    <div className="success-product-details-table">
                                        <motion.div 
                                            className="detail-row"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <span className="detail-label">Color:</span>
                                            <span className="detail-value">{selectedVariant?.color}</span>
                                        </motion.div>
                                        <motion.div 
                                            className="detail-row"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <span className="detail-label">Size:</span>
                                            <span className="detail-value">{selectedSize}</span>
                                        </motion.div>
                                        <motion.div 
                                            className="detail-row"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <span className="detail-label">Quantity:</span>
                                            <span className="detail-value">{quantity}</span>
                                        </motion.div>
                                        <motion.div 
                                            className="detail-row price-row"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <span className="detail-label">Price:</span>
                                            <span className="detail-value">
                                                {formatPrice((selectedVariant?.price || product.base_price) * quantity)}
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    className="success-modal-footer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.button 
                                        className="btn-continue-shopping"
                                        onClick={() => setShowSuccessModal(false)}
                                        whileHover={buttonHover}
                                        whileTap={buttonTap}
                                    >
                                        Continue Shopping
                                    </motion.button>
                                    <motion.button 
                                        className="btn-view-cart"
                                        onClick={() => {
                                            setShowSuccessModal(false);
                                            navigate('/cart');
                                        }}
                                        whileHover={buttonHover}
                                        whileTap={buttonTap}
                                    >
                                        View Cart
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
        );
    };

    // ===== UPDATED: Related Products Grid Component (Desktop only) =====
    const RelatedProductsGrid = () => {
        if (relatedProducts.length === 0) return null;

        return (
            <motion.div 
                className="related-products-grid"
                variants={slideUp}
                initial="hidden"
                animate="visible"
            >
                <h3 className="grid-title">Related Products</h3>
                <div className="grid-container">
                    {relatedProducts.map((relatedProduct, index) => (
                        <motion.div
                            key={relatedProduct.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link 
                                to={`/product/${relatedProduct.id}`}
                                className="grid-product-card"
                            >
                                <div className="grid-product-image">
                                    <img 
                                        src={relatedProduct.variants[0]?.image} 
                                        alt={relatedProduct.name}
                                    />
                                </div>
                                <div className="grid-product-info">
                                    <h4 className="grid-product-name">{relatedProduct.name}</h4>
                                    <p className="grid-product-brand">{relatedProduct.brand}</p>
                                    <div className="grid-product-price">
                                        {formatPrice(relatedProduct.base_price)}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    // Related Products Section for Mobile (same design as random products)
    const RelatedProductsSection = () => {
        if (relatedProducts.length === 0) return null;

        return (
            <motion.div 
                className="related-products-section"
                variants={slideUp}
                initial="hidden"
                animate="visible"
            >
                <h2>Related Products</h2>
                <div className="horizontal-carousel">
                    <div className="horizontal-carousel-container">
                        {relatedProducts.slice(0, 5).map((relatedProduct, index) => {
                            const colorSwatches = getColorSwatches(relatedProduct.variants);
                            const hasMoreColors = relatedProduct.variants.length > 4;
                            
                            return (
                                <motion.div
                                    key={relatedProduct.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link 
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
                                                {colorSwatches.map((hexCode, colorIndex) => {
                                                    const variantWithThisColor = relatedProduct.variants.find(v => v.hex_code === hexCode);
                                                    const colorName = variantWithThisColor?.color || `Color ${colorIndex + 1}`;
                                                    
                                                    return (
                                                        <div 
                                                            key={colorIndex}
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
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    };

    // Random Products Section
    const RandomProductsSection = () => {
        if (randomProducts.length === 0) return null;

        return (
            <motion.div 
                className="random-products-section"
                variants={slideUp}
                initial="hidden"
                animate="visible"
            >
                <h2>You Might Also Like</h2>
                <div className="horizontal-carousel">
                    <div className="horizontal-carousel-container">
                        {randomProducts.map((randomProduct, index) => {
                            const colorSwatches = getColorSwatches(randomProduct.variants);
                            const hasMoreColors = randomProduct.variants.length > 4;
                            
                            return (
                                <motion.div
                                    key={randomProduct.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link 
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
                                                {colorSwatches.map((hexCode, colorIndex) => {
                                                    const variantWithThisColor = randomProduct.variants.find(v => v.hex_code === hexCode);
                                                    const colorName = variantWithThisColor?.color || `Color ${colorIndex + 1}`;
                                                    
                                                    return (
                                                        <div 
                                                            key={colorIndex}
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
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    };

    // Tabs Component
    const ProductTabs = () => (
        <motion.div 
            className="product-tabs"
            variants={slideUp}
            initial="hidden"
            animate="visible"
        >
            <div className="tabs-header">
                <motion.button 
                    className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                >
                    Overview
                </motion.button>
                <motion.button 
                    className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                >
                    Reviews & Ratings
                </motion.button>
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' ? (
                        <>
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
                        </>
                    ) : (
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
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );

    // ===== UPDATED: Size Chart Modal with Portal =====
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

        // Use portal to render directly in body
        return createPortal(
            <AnimatePresence>
                {showSizeChart && (
                    <motion.div 
                        className={`size-chart-overlay ${isVisible ? 'visible' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSizeChart}
                    >
                        <motion.div 
                            className="size-chart-modal"
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="size-chart-header">
                                <h2>{chart.title}</h2>
                                <motion.button 
                                    className="close-button"
                                    onClick={closeSizeChart}
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    ×
                                </motion.button>
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
                                                <motion.tr 
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {chart.columns.map((column, colIndex) => (
                                                        <td key={colIndex}>
                                                            {row[column.toLowerCase().replace(/[^a-z]/g, '')] || row[Object.keys(row)[colIndex]]}
                                                        </td>
                                                    ))}
                                                </motion.tr>
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
        );
    };

    if (loading) {
        return <ProductSkeleton />;
    }

    if (error || !product) {
        return (
            <motion.div 
                className="product-detail-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="product-detail-error">
                    <h2>Product Not Found</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-to-home">Back to Home</Link>
                </div>
            </motion.div>
        );
    }

    const currentSizes = sizeOptions[product.category] || [];

    return (
        <motion.div 
            className="product-detail-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
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
                    {/* UPDATED: Related Products Grid - SEPARATE COLUMN (Desktop only) */}
                    <RelatedProductsGrid />
                    
                    {/* MAIN CONTENT AREA - VERTICAL STACK */}
                    <div className="main-content-area">
                        {/* Product Images and Info - SIDE BY SIDE */}
                        <motion.div 
                            className="product-main-section"
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Product Images Section - LARGER */}
                            <div className="product-images">
                                <motion.div 
                                    className="main-image"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {/* FIXED: Isolated animation only on the main image */}
                                    <AnimatePresence mode="wait">
                                        <motion.img 
                                            key={selectedVariant?.id}
                                            src={selectedVariant?.image} 
                                            alt={product.name}
                                            className="product-main-image"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                           {/* Product Info Section - UPDATED: Removed animations from dynamic elements */}
<div className="product-info">
    {/* Keep animation on title (static) */}
    <motion.h1 
        className="product-title"
        variants={slideUp}
    >
        {product.name}
    </motion.h1>
    
    {/* Keep animation on brand (static) */}
    <motion.p 
        className="product-brand"
        variants={slideUp}
        transition={{ delay: 0.1 }}
    >
        {product.brand}
    </motion.p>
    
    {/* REMOVE animation from price (dynamic - changes with variant) */}
    <div className="product-price">
        {formatPrice(selectedVariant?.price || product.base_price)}
    </div>

    {/* Keep animation on rating container (static) */}
    <motion.div 
        className="product-rating"
        variants={slideUp}
        transition={{ delay: 0.3 }}
    >
        <div className="stars">
            <span className="stars-icons">{'★'.repeat(5)}</span>
            <span className="rating-text">(4.8) 124 Reviews</span>
        </div>
    </motion.div>

    {/* Variant Image Gallery - Keep animation on container only */}
    <motion.div 
        className="variant-gallery"
        variants={slideUp}
        transition={{ delay: 0.4 }}
    >
        {/* REMOVE animation from color indicator (dynamic) */}
        <div className="color-indicator">
            <strong>Color: </strong>
            {selectedVariant?.color}
        </div>
        <div className="variant-images">
            {product.variants.map((variant) => (
                <motion.div
                    key={variant.id}
                    className={`variant-image-box ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                    onClick={() => handleVariantSelect(variant)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={selectedVariant?.id === variant.id ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <motion.img 
                        src={variant.image} 
                        alt={variant.color}
                        className="variant-thumbnail"
                        whileHover={{ scale: 1.1 }}
                    />
                </motion.div>
            ))}
        </div>
    </motion.div>

    {/* Size Selector - Keep animation on container only */}
    {currentSizes.length > 0 && (
        <motion.div 
            className="size-selector"
            variants={slideUp}
            transition={{ delay: 0.5 }}
        >
            <div className="size-header">
                {/* REMOVE animation from size indicator (dynamic) */}
                <div className="size-indicator">
                    <strong>Size: </strong>
                    {selectedSize}
                </div>
                <motion.button 
                    className="size-guide-link"
                    onClick={openSizeChart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Size Guide
                </motion.button>
            </div>
            <div className="size-options">
                {currentSizes.map((size) => (
                    <motion.button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {size}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )}

    {/* Action Buttons - Keep animation on container only */}
    <motion.div 
        className="action-buttons-row"
        variants={slideUp}
        transition={{ delay: 0.6 }}
    >
        <div className="quantity-selector">
            <label htmlFor="quantity">Qty:</label>
            <motion.select 
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                whileFocus={{ scale: 1.02 }}
            >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </motion.select>
        </div>

        <motion.button 
            className={`add-to-cart-btn ${cartLoading ? 'button-loading' : ''}`}
            onClick={checkAuthAndAddToCart}
            disabled={cartLoading || buyNowLoading}
            whileHover={buttonHover}
            whileTap={buttonTap}
        >
            {cartLoading ? (
                <Loading type="dots" size="small" />
            ) : (
                'Add to Cart'
            )}
        </motion.button>

        <motion.button 
            className={`buy-now-btn ${buyNowLoading ? 'button-loading' : ''}`}
            onClick={checkAuthAndBuyNow}
            disabled={buyNowLoading || cartLoading}
            whileHover={buttonHover}
            whileTap={buttonTap}
        >
            {buyNowLoading ? (
                <Loading type="dots" size="small" />
            ) : (
                'Buy Now'
            )}
        </motion.button>
    </motion.div>
</div>
                        </motion.div>

                        {/* Tabs Section */}
                        <ProductTabs />

                        {/* Related Products Section - MOBILE ONLY (FIRST) */}
                        <RelatedProductsSection />

                        {/* Random Products Section - MOBILE (SECOND) */}
                        <RandomProductsSection />
                    </div>
                </div>
            </div>

            {/* Size Chart Modal - Now rendered via portal */}
            <SizeChartModal />

            {/* Success Modal - Now rendered via portal */}
            <SuccessModal />
        </motion.div>
    );
};

export default ProductDetailPage;