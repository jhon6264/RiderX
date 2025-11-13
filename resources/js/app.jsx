import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/home/Header';
import Hero from './components/home/Hero';
import Partnership from './components/home/Partnership'; 
import Footer from './components/home/Footer';
import AuthModal from './AuthModal';

function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleAuthModalOpen = () => {
        setIsAuthModalOpen(true);
    };

    const handleAuthModalClose = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <div className="App">
            <Header onAuthModalOpen={handleAuthModalOpen} />
            <Hero />
            <Partnership /> 
            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />
        </div>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);