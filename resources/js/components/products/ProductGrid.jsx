// ProductGrid.jsx
import React, { useState, useEffect } from 'react';


const ProductGrid = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔄 STARTING FETCH for category:', category);
        
        fetch(`/api/product-api/${category}.php`)
            .then(response => {
                console.log('📡 Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('✅ Products received:', data);
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('❌ Fetch error:', error);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return <div className="loading">Loading {category}...</div>;
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                    />
                    <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-brand">{product.brand}</p>
                        <p className="product-color">Color: {product.color}</p>
                        <p className="product-price">${product.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;