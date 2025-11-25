// C:\Users\User\Desktop\RiderX\resources\js\components\Loading.jsx
import React from 'react';

const Loading = ({ type = 'dots', message = 'Loading...', size = 'medium', count = 3, className = '' }) => {
    // Progress Bar Loading
    if (type === 'progress') {
        return (
            <div className={`loading-container loading-${size} ${className}`}>
                <div className="loading-progress">
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <div className="loading-message">{message}</div>
                </div>
            </div>
        );
    }

    // Skeleton Loading for product grids
    if (type === 'skeleton') {
        return (
            <div className={`loading-container loading-${size} ${className}`}>
                <div className="skeleton-grid">
                    {Array.from({ length: count }, (_, index) => (
                        <div key={index} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line skeleton-title"></div>
                                <div className="skeleton-line skeleton-brand"></div>
                                <div className="skeleton-line skeleton-price"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Pulsing Dots for buttons (default)
    return (
        <div className={`loading-dots loading-${size} ${className}`}>
            {Array.from({ length: 3 }, (_, index) => (
                <span 
                    key={index} 
                    className="loading-dot"
                    style={{ animationDelay: `${index * 0.2}s` }}
                ></span>
            ))}
        </div>
    );
};

export default Loading;