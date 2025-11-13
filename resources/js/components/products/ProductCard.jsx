// ProductCard.jsx

import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
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
    );
};

export default ProductCard;