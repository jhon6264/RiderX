import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/home/Header';
import Footer from './components/home/Footer';

const CustomerLayout = () => {
    return (
        <div className="customer-app">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default CustomerLayout;