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
    const [verificationData, setVerificationData] = useState({ verified: false, email: '' });

    const handleAuthModalOpen = () => {
        setIsAuthModalOpen(true);
    };

    const handleAuthModalClose = () => {
        setIsAuthModalOpen(false);
        // Clear all data when modal closes
        setResetData({ token: '', email: '' });
        setVerificationData({ verified: false, email: '' });
    };

    // Reset password and email verification detection
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        const verified = urlParams.get('verified');
        
        console.log('URL params:', { token, email, verified });
        
        if (token && email) {
            // Password reset flow
            setResetData({ 
                token: token, 
                email: decodeURIComponent(email) 
            });
            setIsAuthModalOpen(true);
            // Clean the URL
            window.history.replaceState({}, '', '/');
        } else if (verified === 'true') {
            // Email verification success flow
            const verifiedEmail = urlParams.get('email') || '';
            setVerificationData({ 
                verified: true, 
                email: decodeURIComponent(verifiedEmail) 
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
                verificationData={verificationData} 
            />
        </div>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);