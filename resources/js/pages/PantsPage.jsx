// C:\Users\User\Desktop\RiderX\resources\js\pages\PantsPage.jsx
import React from 'react';
import ProductGrid from '../components/home/ProductGrid';

const PantsPage = () => {
    return (
        <div className="pants-page">
            <main className="page-main">
                <div className="page-container">
                    <ProductGrid category="pants" showHeader={true} />
                </div>
            </main>
        </div>
    );
};

export default PantsPage;