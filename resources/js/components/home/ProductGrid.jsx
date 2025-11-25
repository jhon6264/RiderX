import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import { formatPrice } from '../../utils/currencyFormatter';

const ProductGrid = ({ category = null }) => {
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
            console.log('API Response:', data);
            
            if (data.success) {
                const shuffledProducts = shuffleArray(data.data).slice(0, 15);
                setProducts(shuffledProducts);
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
            console.log(`API Response for ${category}:`, data);
            
            if (data.success) {
                setProducts(data.data);
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
        console.log('Variants for color swatches:', variants);
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

    // Get the appropriate title and subtitle based on category
    const getHeaderContent = () => {
        if (category) {
            const categoryTitles = {
                helmets: { title: 'Motorcycle Helmets', subtitle: 'Premium helmets for maximum protection and comfort on every ride' },
                jackets: { title: 'Riding Jackets', subtitle: 'Durable and stylish jackets designed for safety and performance' },
                pants: { title: 'Riding Pants', subtitle: 'Protective pants built for comfort and safety on the road' },
                boots: { title: 'Riding Boots', subtitle: 'High-quality boots offering superior protection and support' },
                gloves: { title: 'Riding Gloves', subtitle: 'Protective gloves for optimal grip and hand safety' }
            };
            
            const content = categoryTitles[category] || { 
                title: category.charAt(0).toUpperCase() + category.slice(1), 
                subtitle: `Premium ${category} for motorcycle enthusiasts` 
            };
            
            return content;
        } else {
            return {
                title: 'Featured Gear',
                subtitle: 'Discover our premium selection of motorcycle gear from helmets to gloves - all designed for maximum safety and style.'
            };
        }
    };

    // FIXED: No header during loading - only skeleton cards
    if (loading) {
        return (
            <div className="product-grid">
                {/* REMOVED: Header during loading */}
                <Loading 
                    type="skeleton" 
                    count={8} 
                    size="medium" 
                    className="product-grid-loading"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-grid">
                <div className="grid-header">
                    <h2>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Featured Products'}</h2>
                </div>
                <div className="error-message">
                    <p>Error loading products: {error}</p>
                </div>
            </div>
        );
    }

    const headerContent = getHeaderContent();

    return (
        <section className="product-grid-section">
            <div className="product-grid-container">
                {/* FIXED: Header only shows AFTER loading completes */}
                <div className="product-grid-header">
                    <h2 className="product-grid-title">{headerContent.title}</h2>
                    <p className="product-grid-subtitle">
                        {headerContent.subtitle}
                    </p>
                </div>

                <div className="product-grid">
                    {products.map((product) => {
                        console.log('Product:', product);
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
                                        <span className="product-card-price">{formatPrice(product.base_price)}</span>
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