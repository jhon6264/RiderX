// resources/js/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top on every route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Immediate scroll, no animation
        });
    }, [pathname]); // Triggers on every route change

    return null; // This component doesn't render anything
};

export default ScrollToTop;