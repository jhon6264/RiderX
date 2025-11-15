import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/home/Header';
import Hero from './components/home/Hero';
import Partnership from './components/home/Partnership'; 
import Footer from './components/home/Footer';
import AuthModal from './AuthModal';

function App() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [resetData, setResetData] = useState({ token: '', email: '' });

    const handleAuthModalOpen = () => {
        setIsAuthModalOpen(true);
    };

    const handleAuthModalClose = () => {
        setIsAuthModalOpen(false);
        // Clear reset data when modal closes
        setResetData({ token: '', email: '' });
    };

    // Reset password detection
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        
        if (token && email) {
            setResetData({ 
                token: token, 
                email: decodeURIComponent(email) 
            });
            setIsAuthModalOpen(true);
            // Clean the URL
            window.history.replaceState({}, '', '/');
        }
    }, []);

    return (
        <div className="App">
            <Header onAuthModalOpen={handleAuthModalOpen} />
            <Hero />
            <Partnership /> 
            <Footer />
            
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={handleAuthModalClose} 
                resetData={resetData}
            />
        </div>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);