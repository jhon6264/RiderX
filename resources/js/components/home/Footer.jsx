import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Shop Categories</h3>
                    <ul>
                        <li><a href="#">Jackets</a></li>
                        <li><a href="#">Pants</a></li>
                        <li><a href="#">Gloves</a></li>
                        <li><a href="#">Boots</a></li>
                        <li><a href="#">Helmets</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h3>Customer Support</h3>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Shipping Info</a></li>
                        <li><a href="#">Returns & Exchanges</a></li>
                        <li><a href="#">Size Guide</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Shipping Policy</a></li>
                        <li><a href="#">Refund Policy</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2024 Premium Rider Gear. All rights reserved. | Built for riders, by riders.</p>
            </div>
        </footer>
    );
};

export default Footer;