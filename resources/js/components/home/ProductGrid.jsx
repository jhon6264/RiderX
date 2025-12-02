import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currencyFormatter';

const ProductGrid = ({ category = null, limit = 30 }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Scroll to top when category changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [category]);

    useEffect(() => {
        if (category) {
            fetchCategoryProducts();
        } else {
            fetchFeaturedProducts();
        }
    }, [category]);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            if (data.success) {
                if (limit && limit > 0) {
                    const shuffledProducts = shuffleArray(data.data).slice(0, limit);
                    setProducts(shuffledProducts);
                } else {
                    setProducts(shuffleArray(data.data));
                }
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            setError('Error fetching products: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryProducts = async () => {
        try {
            const response = await fetch(`/api/products/${category}`);
            const data = await response.json();
            
            if (data.success) {
                const categoryProducts = data.data;
                
                if (limit && limit > 0) {
                    if (categoryProducts.length < limit) {
                        const filledProducts = [...categoryProducts];
                        while (filledProducts.length < limit) {
                            filledProducts.push(...categoryProducts.slice(0, limit - filledProducts.length));
                        }
                        setProducts(filledProducts.slice(0, limit));
                    } else {
                        setProducts(categoryProducts.slice(0, limit));
                    }
                } else {
                    setProducts(categoryProducts);
                }
            } else {
                setError(`Failed to load ${category} products`);
            }
        } catch (err) {
            setError(`Error fetching ${category} products: ` + err.message);
        } finally {
            setLoading(false);
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Function to get unique color swatches from variants (max 4 shown)
    const getColorSwatches = (variants) => {
        const uniqueHexCodes = [...new Set(variants.map(v => v.hex_code))];
        return uniqueHexCodes.slice(0, 4);
    };

    // Function to render star rating (random for demo)
    const renderStarRating = (productId) => {
        const rating = (productId % 3) + 3.5;
        const stars = [];
        
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= Math.floor(rating) ? 'star filled' : 'star'}>
                    ★
                </span>
            );
        }
        
        return (
            <div className="product-card-rating">
                {stars}
                <span className="rating-count">({Math.round(rating * 10)/10})</span>
            </div>
        );
    };

    // Calculate skeleton count based on limit or default to 30
    const skeletonCount = limit && limit > 0 ? limit : 30;

    // ========== CRITICAL FIX: Custom Skeleton Loader ==========
    const renderSkeleton = () => {
        return (
            <div className="product-grid">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div key={index} className="skeleton-card">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-line skeleton-title"></div>
                            <div className="skeleton-line skeleton-brand"></div>
                            <div className="skeleton-line skeleton-price"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <section className="product-grid-section">
                <div className="product-grid-container">
                    {renderSkeleton()}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="product-grid-section">
                <div className="product-grid-container">
                    <div className="product-grid-error">
                        <p>Error loading products: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="product-grid-section">
                <div className="product-grid-container">
                    <div className="no-products-message">
                        <p>No products found in this category.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="product-grid-section">
            <div className="product-grid-container">
                <div className={`product-grid ${!limit ? 'category-mode' : ''}`}>
                    {products.map((product, index) => {
                        const colorSwatches = getColorSwatches(product.variants);
                        const hasMoreColors = product.variants.length > 4;
                        
                        return (
                            <Link 
                                key={`${product.id}-${index}`} 
                                to={`/product/${product.id}`} 
                                className="product-card"
                            >
                                <div className="product-card-image-container">
                                    <img 
                                        src={product.variants[0]?.image_url || product.variants[0]?.image} 
                                        alt={product.name}
                                        className="product-card-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300/f8f9fa/666666?text=Product+Image';
                                        }}
                                    />
                                </div>
                                <div className="product-card-content">
                                    <h3 className="product-card-name">{product.name}</h3>
                                    <p className="product-card-brand">{product.brand}</p>
                                    
                                    <div className="product-card-colors">
                                        {colorSwatches.map((hexCode, index) => {
                                            const variantWithThisColor = product.variants.find(v => v.hex_code === hexCode);
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
                                            <div className="color-swatch-more" title={`+${product.variants.length - 4} more colors`}>
                                                +
                                            </div>
                                        )}
                                    </div>

                                    <div className="product-card-footer">
                                        <span className="product-card-price">{formatPrice(product.base_price)}</span>
                                    </div>

                                    {renderStarRating(product.id)}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// Helper function to determine border color based on hex code brightness
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

export default ProductGrid;