// C:\Users\User\Desktop\RiderX\resources\js\pages\JacketsPage.jsx
import React from 'react';
import ProductGrid from '../components/home/ProductGrid';

const JacketsPage = () => {
    return (
        <div className="jackets-page">
            <main className="page-main">
                <div className="page-container">
                    <ProductGrid category="jackets" limit={null} />
                </div>
            </main>
        </div>
    );
};

export default JacketsPage;