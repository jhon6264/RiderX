import React from 'react';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const HelmetsPage = () => {
    return (
        <div className="HelmetsPage">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Motorcycle Helmets</h1>
                <p>Helmets page content coming soon...</p>
            </div>
            <Footer />
        </div>
    );
};

export default HelmetsPage;