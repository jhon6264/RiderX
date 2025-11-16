import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            console.log('API Response:', data); // Debug log
            
            if (data.success) {
                const shuffledProducts = shuffleArray(data.data).slice(0, 15);
                setFeaturedProducts(shuffledProducts);
            } else {
                setError('Failed to load products');
            }
        } catch (err) {
            setError('Error fetching products: ' + err.message);
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
        console.log('Variants for color swatches:', variants); // Debug log
        // Use actual hex codes from database
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

    if (loading) {
        return (
            <section className="product-grid-section">
                <div className="product-grid-loading">Loading products...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="product-grid-section">
                <div className="product-grid-error">{error}</div>
            </section>
        );
    }

    return (
        <section className="product-grid-section">
            <div className="product-grid-container">
                <div className="product-grid-header">
                    <h2 className="product-grid-title">Featured Gear</h2>
                    <p className="product-grid-subtitle">
                        Discover our premium selection of motorcycle gear from helmets to gloves - all designed for maximum safety and style.
                    </p>
                </div>

                <div className="product-grid">
                    {featuredProducts.map((product) => {
                        console.log('Product:', product); // Debug log
                        const colorSwatches = getColorSwatches(product.variants);
                        const hasMoreColors = product.variants.length > 4;
                        
                        return (
                            <Link 
                                key={product.id} 
                                to={`/product/${product.id}`} 
                                className="product-card"
                            >
                                <div className="product-card-image-container">
                                    <img 
                                        src={product.variants[0]?.image} 
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
                                    
                                    {/* Color Swatches - Using actual hex codes from database */}
<div className="product-card-colors">
    {colorSwatches.map((hexCode, index) => {
        // Find the variant that has this hex code to get the actual color name
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
                title={colorName}  // Show actual color name
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
                                        <span className="product-card-price">${product.base_price}</span>
                                    </div>

                                    {/* Star Rating */}
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