import React, { useState, useEffect, useRef } from 'react';

const Partnership = () => {
    const brands = [
        {
            name: 'Shoei',
            logo: 'https://www.24helmets.de/media/image/08/5a/ba/shoei-logo-schwarz.jpg'
        },
        {
            name: 'Arai',
            logo: 'https://www.bestbeginnermotorcycles.com/wp-content/uploads/2017/05/Arai-Logos.png'
        },
        {
            name: 'AGV',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/AGV_logo.png/1200px-AGV_logo.png'
        },
        {
            name: 'Bell',
            logo: 'https://logowik.com/content/uploads/images/bell-helmets7916.logowik.com.webp'
        },
        {
            name: 'HJC',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/hjc-logo-png-transparent.png'
        },
        {
            name: 'Dainese',
            logo: 'https://1000logos.net/wp-content/uploads/2020/09/Dainese-Logo.jpg'
        },
        {
            name: 'Alpinestars',
            logo: 'https://static.vecteezy.com/system/resources/previews/014/414/676/non_2x/alpinestars-logo-on-transparent-background-free-vector.jpg'
        },
        {
            name: 'REV\'IT!',
            logo: 'https://cdn.shopify.com/s/files/1/2024/3957/files/REV_IT_W_B_black_LOGO.jpg?height=628&pad_color=fff&v=1613695607&width=1200'
        },
        {
            name: 'TCX',
            logo: 'https://www.highnoteperformance.com/cdn/shop/articles/TCX.jpg?v=1689418983&width=2048'
        },
        {
            name: 'Klim',
            logo: 'https://i.pinimg.com/736x/85/6a/53/856a53c4cf77e9c9da60ce749f5be2f6.jpg'
        },
        {
            name: 'Rukka',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/rukka-logo-png-transparent.png'
        },
        {
            name: 'Held',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/held-logo-png-transparent.png'
        },
        {
            name: 'Spidi',
            logo: 'https://cdn.worldvectorlogo.com/logos/spidi-1.svg'
        },
        {
            name: 'Bilt',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bilt_Rewards_logo.svg/2560px-Bilt_Rewards_logo.svg.png'
        },
        {
            name: 'Sedici',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Fiat_Sedici_wordmark.svg/1280px-Fiat_Sedici_wordmark.svg.png'
        },
        {
            name: 'Joe Rocket',
            logo: 'https://www.insidemotorcycles.com/wp-content/uploads/2015/12/8f609099d27941bf7851e7634da2ac60.jpg'
        },
        {
            name: 'Cortech',
            logo: 'https://logodix.com/logo/1990316.jpg'
        },
        {
            name: 'Firstgear',
            logo: 'https://images.squarespace-cdn.com/content/v1/61c3cd096bc99919168aa001/6eaf727c-2b7e-446f-9bc3-f42f73a8718c/FGET-Logo.png'
        }
    ];

    const [displayBrands, setDisplayBrands] = useState([...brands, ...brands]); // Start with duplicates for smooth initial loop
    const carouselRef = useRef(null);
    const animationRef = useRef(null);
    const positionRef = useRef(0);
    const speedRef = useRef(1); // Pixels per frame

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const animate = () => {
            positionRef.current -= speedRef.current;
            
            // Check if we've scrolled past one complete set of brands
            const singleSetWidth = carousel.scrollWidth / 2; // Since we have 2 sets
            
            if (Math.abs(positionRef.current) >= singleSetWidth) {
                // Reset position and brands to create seamless loop
                positionRef.current = 0;
                setDisplayBrands([...brands, ...brands]);
            }
            
            carousel.style.transform = `translateX(${positionRef.current}px)`;
            animationRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

        // Pause on hover
        const handleMouseEnter = () => {
            cancelAnimationFrame(animationRef.current);
        };

        const handleMouseLeave = () => {
            animationRef.current = requestAnimationFrame(animate);
        };

        carousel.addEventListener('mouseenter', handleMouseEnter);
        carousel.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);
            carousel.removeEventListener('mouseenter', handleMouseEnter);
            carousel.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [brands]);

    return (
        <section className="partnerships">
            <div className="partnerships-container">
                <h3 className="section-title">Trusted Brands</h3>
                
                <div className="brands-carousel-container">
                    <div className="brands-carousel" ref={carouselRef}>
                        {displayBrands.map((brand, index) => (
                            <div key={index} className="brand-item">
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name}
                                    className="brand-logo"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Partnership;