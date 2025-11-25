// C:\Users\User\Desktop\RiderX\resources\js\pages\GlovesPage.jsx
import React from 'react';
import ProductGrid from '../components/home/ProductGrid';

const GlovesPage = () => {
    return (
        <div className="gloves-page">
            <main className="page-main">
                <div className="page-container">
                    <ProductGrid category="gloves" showHeader={true} />
                </div>
            </main>
        </div>
    );
};

export default GlovesPage;