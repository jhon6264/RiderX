// C:\Users\User\Desktop\RiderX\resources\js\pages\HelmetsPage.jsx
import React from 'react';
import ProductGrid from '../components/home/ProductGrid';

const HelmetsPage = () => {
    return (
        <div className="helmets-page">
            <main className="page-main">
                <div className="page-container">
                    <ProductGrid category="helmets" showHeader={true} />
                </div>
            </main>
        </div>
    );
};

export default HelmetsPage;