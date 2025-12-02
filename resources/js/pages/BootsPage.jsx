// C:\Users\User\Desktop\RiderX\resources\js\pages\BootsPage.jsx
import React from 'react';
import ProductGrid from '../components/home/ProductGrid';

const BootsPage = () => {
    return (
        <div className="boots-page">
            <main className="page-main">
                <div className="page-container">
                    <ProductGrid category="boots" limit={null} />
                </div>
            </main>
        </div>
    );
};

export default BootsPage;