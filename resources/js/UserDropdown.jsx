import React, { useState, useRef, useEffect } from 'react';


const UserDropdown = ({ user, onClose, onLogout }) => {
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleMenuItemClick = (action) => {
        onClose(); // Close dropdown first
        // We'll handle the actions in the parent component
        if (action === 'logout') {
            onLogout();
        }
    };

    return (
        <div className="user-dropdown" ref={dropdownRef}>
            {/* Dropdown Header with User Info */}
            <div className="dropdown-header">
                <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                </div>
            </div>

            {/* Dropdown Menu Items */}
            <div className="dropdown-menu">
                <button 
                    className="dropdown-item"
                    onClick={() => handleMenuItemClick('profile')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Profile</span>
                </button>

                <button 
                    className="dropdown-item"
                    onClick={() => handleMenuItemClick('account')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.64 3.58L13.75 3.39C14.22 2.6 15.24 2.32 16.03 2.79L17.76 3.78C18.67 4.3 18.98 5.47 18.46 6.37C17.55 7.94 18.29 9.22 20.1 9.22C21.15 9.22 22 10.08 22 11.12V12.88C22 13.92 21.15 14.78 20.1 14.78C18.29 14.78 17.55 16.06 18.46 17.63C18.98 18.53 18.67 19.7 17.76 20.22L16.03 21.21C15.24 21.68 14.22 21.4 13.75 20.61L13.64 20.42C12.74 18.85 11.26 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Account</span>
                </button>

                <button 
                    className="dropdown-item"
                    onClick={() => handleMenuItemClick('settings')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3031 19.1338 15.6062 19.0007 15.9094C18.915 16.105 18.8721 16.2028 18.8545 16.2456C18.6966 16.5935 18.4418 16.8847 18.1234 17.0822C18.0825 17.1075 17.9856 17.1581 17.7918 17.2593C17.4915 17.4133 17.1912 17.5673 16.8909 17.7213C16.5896 17.876 16.2883 18.0307 15.987 18.1854C15.7847 18.2883 15.6836 18.3397 15.6321 18.3589C15.2869 18.5 14.9055 18.541 14.537 18.4762C14.493 18.4679 14.3919 18.4399 14.1897 18.3839C13.8845 18.2987 13.5793 18.2135 13.2741 18.1283C13.0738 18.0729 12.9736 18.0452 12.9311 18.0344C12.5626 17.9419 12.1738 17.9597 11.8195 18.0853C11.779 18.0998 11.6801 18.1353 11.4822 18.2062C11.1832 18.3124 10.8842 18.4186 10.5852 18.5248C10.3899 18.5924 10.2923 18.6262 10.251 18.6384C9.88601 18.7471 9.49482 18.7525 9.12627 18.6538C9.08374 18.6423 8.9816 18.6117 8.77731 18.5505C8.46752 18.4568 8.15773 18.3631 7.84794 18.2694C7.64066 18.2071 7.53702 18.1759 7.49349 18.1644C7.12494 18.0511 6.72614 18.0483 6.35537 18.1567C6.31284 18.1689 6.214 18.2027 6.01631 18.2703C5.71263 18.3765 5.40895 18.4827 5.10527 18.5889C4.90758 18.6565 4.80874 18.6903 4.76621 18.7025C4.39544 18.8109 3.99664 18.8081 3.62809 18.6948C3.58556 18.6833 3.48242 18.6527 3.27615 18.5915C2.96636 18.4978 2.65657 18.4041 2.34678 18.3104C2.1395 18.2481 2.03586 18.2169 1.99233 18.2054C1.62378 18.0921 1.22498 18.0893 0.854206 18.1977C0.811677 18.2099 0.712834 18.2437 0.515147 18.3113C0.21147 18.4175 0.105631 18.4606 0 18.5037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Settings</span>
                </button>

                <div className="dropdown-divider"></div>

                <button 
                    className="dropdown-item logout-item"
                    onClick={() => handleMenuItemClick('logout')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default UserDropdown;