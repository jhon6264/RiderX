import React, { useState, useEffect, useRef } from 'react';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // Product sets with optimized positioning and consistent sizing
    const productSets = [
        {
            id: 1,
            name: "Racing Pro Set",
            items: [
                {
                    image: "/hero/helmet1.png",
                    position: { x: 10, y: 20, rotation: -8 }
                },
                {
                    image: "/hero/jackets1.png",
                    position: { x: 70, y: 25, rotation: 5 }
                },
                {
                    image: "/hero/gloves1.png",
                    position: { x: 40, y: 65, rotation: -12 }
                }
            ],
            description: "Professional racing gear for track performance"
        },
        {
            id: 2,
            name: "Adventure Touring Set",
            items: [
                {
                    image: "/hero/helmet2.png",
                    position: { x: 15, y: 25, rotation: 3 }
                },
                {
                    image: "/hero/jackets2.png",
                    position: { x: 75, y: 30, rotation: -4 }
                },
                {
                    image: "/hero/boots1.png",
                    position: { x: 45, y: 70, rotation: 8 }
                }
            ],
            description: "All-weather gear for long-distance touring"
        },
        {
            id: 3,
            name: "Urban Street Set",
            items: [
                {
                    image: "/hero/helmet1.png",
                    position: { x: 20, y: 30, rotation: -3 }
                },
                {
                    image: "/hero/jackets1.png",
                    position: { x: 65, y: 35, rotation: 6 }
                },
                {
                    image: "/hero/pants1.png",
                    position: { x: 35, y: 65, rotation: -7 }
                }
            ],
            description: "Stylish urban riding gear for city streets"
        }
    ];

    // FIXED PARTICLE SYSTEM - Enhanced for visibility
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Enhanced Particle class with better visibility
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1; // Larger particles
                this.speedX = Math.random() * 0.8 - 0.4; // Faster movement
                this.speedY = Math.random() * 0.8 - 0.4;
                this.color = this.getRandomColor();
                this.alpha = Math.random() * 0.8 + 0.4; // More opaque
                this.wobble = Math.random() * 2;
                this.wobbleSpeed = Math.random() * 0.03 + 0.01;
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.05 + 0.02;
            }

            getRandomColor() {
                const colors = [
                    'rgba(230, 57, 70, 0.8)',    // Bright Racing Red
                    'rgba(255, 107, 107, 0.7)',  // Lighter Red
                    'rgba(248, 249, 250, 0.9)',  // Bright White
                    'rgba(173, 181, 189, 0.7)',  // Light Gray
                    'rgba(206, 212, 218, 0.8)',  // Medium Gray
                    'rgba(233, 236, 239, 0.9)',  // Very Light Gray
                    'rgba(255, 159, 67, 0.6)',   // Orange accent
                    'rgba(116, 118, 255, 0.6)'   // Purple accent
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // Pulsing size effect
                this.pulse += this.pulseSpeed;
                const pulseSize = Math.sin(this.pulse) * 0.3 + 1;
                this.currentSize = this.size * pulseSize;

                // Movement with wobble
                this.x += this.speedX + Math.sin(this.wobble) * 0.5;
                this.y += this.speedY + Math.cos(this.wobble) * 0.3;
                this.wobble += this.wobbleSpeed;

                // Reset particle if it goes off screen
                if (this.x < -100 || this.x > canvas.width + 100 || 
                    this.y < -100 || this.y > canvas.height + 100) {
                    this.reset();
                    // Start from edge for smoother flow
                    if (Math.random() > 0.5) {
                        this.x = Math.random() > 0.5 ? -50 : canvas.width + 50;
                        this.y = Math.random() * canvas.height;
                    } else {
                        this.y = Math.random() > 0.5 ? -50 : canvas.height + 50;
                        this.x = Math.random() * canvas.width;
                    }
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                
                // Main particle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fill();
                
                // Enhanced glow effect for visibility
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize * 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }

        // Create more particles for better visibility
        const particles = [];
        const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // FIXED Animation loop with proper clearing
        const animate = () => {
            // Clear with semi-transparent for trail effect
            ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        setLoading(false);
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % productSets.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [productSets.length]);

    const scrollToProductGrid = () => {
        const productGridSection = document.querySelector('.product-grid-section');
        if (productGridSection) {
            productGridSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleImageError = (e) => {
        console.log('Image failed to load:', e.target.src);
        e.target.style.display = 'none';
    };

    const handleImageLoad = (e) => {
        console.log('Image loaded successfully:', e.target.src);
        e.target.style.opacity = '1';
    };

    if (loading) {
        return (
            <section className="hero-dust">
                <div className="hero-loading">
                    <div className="loading-spinner"></div>
                </div>
            </section>
        );
    }

    const currentSet = productSets[currentSlide];

    return (
        <section className="hero-dust">
            {/* Enhanced Particle Background */}
            <canvas 
                ref={canvasRef}
                className="particle-background"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                }}
            />
            
            {/* Product Showcase */}
            <div className="hero-dust-container">
                <div className="product-set-showcase">
                    {/* Product Images */}
                    <div className="product-images-container">
                        {currentSet.items.map((item, index) => (
                            <div 
                                key={index}
                                className="product-image-wrapper"
                                style={{
                                    left: `${item.position.x}%`,
                                    top: `${item.position.y}%`,
                                    transform: `rotate(${item.position.rotation}deg)`,
                                    zIndex: 2
                                }}
                            >
                                <img 
                                    src={item.image}
                                    alt=""
                                    className="product-set-image"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    style={{ opacity: 0 }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Set Info with Enhanced Animations */}
                    <div className="set-info" style={{ zIndex: 2 }}>
                        <div className="set-header-shimmer">
                            <h1 className="set-name">
                                {currentSet.name}
                            </h1>
                        </div>
                        <p className="set-description">
                            {currentSet.description}
                        </p>
                        <div className="set-actions">
                            <button 
                                onClick={scrollToProductGrid}
                                className="btn-explore"
                            >
                                Explore Collection
                                <span className="btn-shimmer"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Indicator with Shimmer */}
            <div className="carousel-progress-minimal">
                <div 
                    className="progress-bar-minimal" 
                    style={{ 
                        width: `${((currentSlide + 1) / productSets.length) * 100}%` 
                    }}
                />
                <div className="progress-shimmer"></div>
            </div>
        </section>
    );
};

export default Hero;