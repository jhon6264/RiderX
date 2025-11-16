import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/home/Header';
import Hero from './components/home/Hero';
import Partnership from './components/home/Partnership'; 
import Footer from './components/home/Footer';
import AuthModal from './AuthModal';
import HelmetsPage from './pages/HelmetsPage';
import JacketsPage from './pages/JacketsPage';
import PantsPage from './pages/PantsPage';
import BootsPage from './pages/BootsPage';
import GlovesPage from './pages/GlovesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductGrid from './components/home/ProductGrid';

function HomePage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [resetData, setResetData] = useState({ token: '', email: '' });
    const [verificationData, setVerificationData] = useState({ verified: false, email: '' });

    const handleAuthModalOpen = () => {
        setIsAuthModalOpen(true);
    };

    const handleAuthModalClose = () => {
        setIsAuthModalOpen(false);
        setResetData({ token: '', email: '' });
        setVerificationData({ verified: false, email: '' });
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        const verified = urlParams.get('verified');
        
        console.log('URL params:', { token, email, verified });
        
        if (token && email) {
            setResetData({ 
                token: token, 
                email: decodeURIComponent(email) 
            });
            setIsAuthModalOpen(true);
            window.history.replaceState({}, '', '/');
        } else if (verified === 'true') {
            const verifiedEmail = urlParams.get('email') || '';
            setVerificationData({ 
                verified: true, 
                email: decodeURIComponent(verifiedEmail) 
            });
            setIsAuthModalOpen(true);
            window.history.replaceState({}, '', '/');
        }
    }, []);

    return (
        <div className="HomePage">
            <Header onAuthModalOpen={handleAuthModalOpen} />
            <Hero />
            <ProductGrid /> 
            <Partnership /> 
            <Footer />
            
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={handleAuthModalClose} 
                resetData={resetData}
                verificationData={verificationData} 
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/helmets" element={<HelmetsPage />} />
                <Route path="/jackets" element={<JacketsPage />} />
                <Route path="/pants" element={<PantsPage />} />
                <Route path="/boots" element={<BootsPage />} />
                <Route path="/gloves" element={<GlovesPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>
        </Router>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);