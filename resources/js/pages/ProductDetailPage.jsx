import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showSizeChart, setShowSizeChart] = useState(false);

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
    }, [id]); // This runs every time the id changes

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

    const fetchRelatedProducts = async (category) => {
        try {
            const response = await fetch(`/api/products/${category}`);
            const data = await response.json();
            if (data.success) {
                const filtered = data.data.filter(p => p.id !== parseInt(id));
                setRelatedProducts(filtered.slice(0, 4));
            }
        } catch (err) {
            console.error('Error fetching related products:', err);
        }
    };

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        console.log('Added to cart:', {
            productId: product.id,
            variantId: selectedVariant.id,
            size: selectedSize,
            quantity: quantity
        });
        alert(`${quantity} ${product.name} (${selectedVariant.color}, Size: ${selectedSize}) added to cart!`);
    };

    const handleBuyNow = () => {
        console.log('Buy now:', {
            productId: product.id,
            variantId: selectedVariant.id,
            size: selectedSize,
            quantity: quantity
        });
        alert(`Proceeding to checkout with ${quantity} ${product.name} (${selectedVariant.color}, Size: ${selectedSize})`);
    };

    const openSizeChart = () => {
        setShowSizeChart(true);
    };

    const closeSizeChart = () => {
        setShowSizeChart(false);
    };

    // Size Chart Modal Component
    // Size Chart Modal Component
const SizeChartModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (showSizeChart) {
            setShouldRender(true);
            // Small delay to allow DOM to update before starting animation
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            // Wait for animation to complete before removing from DOM
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
                <Header />
                <div className="product-detail-loading">Loading product...</div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <Header />
                <div className="product-detail-error">
                    <h2>Product Not Found</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-to-home">Back to Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const currentSizes = sizeOptions[product.category] || [];

    return (
        <div className="product-detail-page">
            <Header />
            
            <div className="product-detail-container">
                {/* Breadcrumb Navigation */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span> / </span>
                    <Link to={`/${product.category}`}>{product.category}</Link>
                    <span> / </span>
                    <span>{product.name}</span>
                </nav>

                <div className="product-detail-content">
                    {/* Product Images Section */}
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
                            ${selectedVariant?.price || product.base_price}
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

                        {/* Action Buttons Row */}
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
                                className="add-to-cart-btn"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>

                            <button 
                                className="buy-now-btn"
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Product Description */}
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Specifications */}
                        <div className="product-specifications">
                            <h3>Specifications</h3>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <strong>Brand:</strong> {product.brand}
                                </div>
                                <div className="spec-item">
                                    <strong>Category:</strong> {product.category}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="related-products">
                        <h2>Related Products</h2>
                        <div className="related-products-grid">
                            {relatedProducts.map((relatedProduct) => (
                                <Link 
                                    key={relatedProduct.id} 
                                    to={`/product/${relatedProduct.id}`}
                                    className="related-product-card"
                                >
                                    <img 
                                        src={relatedProduct.variants[0]?.image} 
                                        alt={relatedProduct.name}
                                        className="related-product-image"
                                    />
                                    <div className="related-product-info">
                                        <h4>{relatedProduct.name}</h4>
                                        <p className="related-product-brand">{relatedProduct.brand}</p>
                                        <div className="related-product-price">${relatedProduct.base_price}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Size Chart Modal */}
            <SizeChartModal />

            <Footer />
        </div>
    );
};

export default ProductDetailPage;