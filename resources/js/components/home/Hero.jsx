import React, { useState, useEffect } from 'react';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    

    const slides = [
        {
            image: "https://www.ephotozine.com/articles/action-shot-of-motocross-racing-wins--photo-of-the-week--36493/images/xlg_motorbike.jpg",
            title: "EXTREME PERFORMANCE",
            subtitle: "Race-tested gear for the track warrior"
        },
        {
            image: "https://www.motodeal.com.ph/custom/blog-post/header/honda-africa-twin-adventure-motorcycle-60229248f1e28.jpg",
            title: "ADVENTURE AWAITS",
            subtitle: "Explore further with adventure-ready equipment"
        },
        {
            image: "https://www.revzilla.com/blog_content_image/image/74290/Jorge_Martin.jpg",
            title: "RACE INSPIRED",
            subtitle: "Professional-grade protection and style"
        },
        {
            image: "https://cloudfront-us-east-1.images.arcpublishing.com/octane/H5ADZFI43BDYTJWDZGGNGQKKB4.jpg",
            title: "PREMIUM CRAFTSMANSHIP",
            subtitle: "Handcrafted gear for the discerning rider"
        },
        {
            image: "https://www.urbanrider.co.uk/media/wysiwyg/Merling_Hydroshield_Homepage_800x350.jpg",
            title: "URBAN RIDING",
            subtitle: "Style and protection for city streets"
        },
        {
            image: "https://rideiron.com/cdn/shop/articles/Urban_motorcycle_safety_tricks_83a8b182-5ebe-4c62-890c-fd029f33eb02.jpg?v=1742376388",
            title: "SMART PROTECTION",
            subtitle: "Innovative gear for modern riders"
        },
        {
            image: "https://s1.cdn.autoevolution.com/images/news/gallery/a-head-to-toe-guide-about-essential-motorcycle-gear-for-maximum-safety_6.jpg",
            title: "COMPLETE PROTECTION",
            subtitle: "Head-to-toe safety for every journey"
        },
        {
            image: "https://wallpapers.com/images/hd/ktm-rider-cinematic-shot-in-4k-ms4zb25u604vo1ja.jpg",
            title: "CINEMATIC RIDING",
            subtitle: "Gear that matches your ambition"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="hero">
            {/* Carousel Slides */}
            <div className="hero-carousel">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="hero-content">
                            <h1 className="hero-title">{slide.title}</h1>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <button className="btn btn-primary">Shop Now</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;