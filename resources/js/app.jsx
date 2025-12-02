import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Customer Components
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
import { AuthModalProvider, useAuthModal } from './AuthModalContext';
import { CartProvider } from './contexts/CartContext';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminProducts from './admin/AdminProducts';
import AdminManagement from './admin/AdminManagement';

// ========== CUSTOMER APP ==========
function HomePage() {
    return (
        <div className="HomePage">
            <Hero />
            <ProductGrid /> 
            <Partnership /> 
        </div>
    );
}

function CustomerAppContent() {
    const { isAuthModalOpen, closeAuthModal, openAuthModal } = useAuthModal();
    const [resetData, setResetData] = useState({ token: '', email: '' });
    const [verificationData, setVerificationData] = useState({ verified: false, email: '' });

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
            openAuthModal();
            window.history.replaceState({}, '', '/');
        } else if (verified === 'true') {
            const verifiedEmail = urlParams.get('email') || '';
            setVerificationData({ 
                verified: true, 
                email: decodeURIComponent(verifiedEmail) 
            });
            openAuthModal();
            window.history.replaceState({}, '', '/');
        }
    }, [openAuthModal]);

    return (
        <div className="customer-app">
            {/* Header and Footer ONLY for customer app */}
            <Header />
            
            <main className="customer-main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/helmets" element={<HelmetsPage />} />
                    <Route path="/jackets" element={<JacketsPage />} />
                    <Route path="/pants" element={<PantsPage />} />
                    <Route path="/boots" element={<BootsPage />} />
                    <Route path="/gloves" element={<GlovesPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    <Route path="/orders/:id" element={<OrderDetailsPage />} />
                </Routes>
            </main>
            
            <Footer />
            
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={closeAuthModal} 
                resetData={resetData}
                verificationData={verificationData} 
            />
        </div>
    );
}

function CustomerApp() {
    return (
        <AuthModalProvider>
            <CartProvider>
                <Router>
                    <CustomerAppContent />
                </Router>
            </CartProvider>
        </AuthModalProvider>
    );
}

// ========== ADMIN APP ==========
function AdminApp() {
    return (
        <div className="admin-app">
            <Router>
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        
                        {/* Order Routes - Redirect base /orders to /orders/all */}
                        <Route path="admins" element={<AdminManagement />} />
                        <Route path="orders" element={<Navigate to="/admin/orders/all" replace />} />
                        <Route path="orders/all" element={<AdminOrders />} />
                        <Route path="orders/pending" element={<AdminOrders />} />
                        <Route path="orders/to-ship" element={<AdminOrders />} />
                        <Route path="orders/shipped" element={<AdminOrders />} />
                        <Route path="orders/delivered" element={<AdminOrders />} />
                        <Route path="orders/cancelled" element={<AdminOrders />} />
                        
                        {/* Payment Routes - Redirect base /payments to /payments/all */}
                        <Route path="payments" element={<Navigate to="/admin/payments/all" replace />} />
                        <Route path="payments/all" element={<AdminPayments />} />
                        <Route path="payments/pending" element={<AdminPayments />} />
                        <Route path="payments/approved" element={<AdminPayments />} />
                        
                        <Route path="products" element={<AdminProducts />} />
                    </Route>
                    {/* Catch all admin routes to dashboard */}
                    <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
            </Router>
        </div>
    );
}

// ========== MAIN APP RENDERER ==========
function App() {
    // Check if we're in admin area - more robust check
    const isAdminArea = window.location.pathname.startsWith('/admin');
    
    if (isAdminArea) {
        return <AdminApp />;
    } else {
        return <CustomerApp />;
    }
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);