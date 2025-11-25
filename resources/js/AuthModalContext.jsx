// C:\Users\User\Desktop\RiderX\resources\js\AuthModalContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthModalContext = createContext();

// Create the provider component
export const AuthModalProvider = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [onModalCloseCallback, setOnModalCloseCallback] = useState(null);

    const openAuthModal = (onCloseCallback = null) => {
        setIsAuthModalOpen(true);
        setOnModalCloseCallback(() => onCloseCallback);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        // Execute any callback that was set when modal opened
        if (onModalCloseCallback) {
            onModalCloseCallback();
            setOnModalCloseCallback(null);
        }
    };

    const value = {
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
};

// Custom hook to use the auth modal context
export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};

export default AuthModalContext;