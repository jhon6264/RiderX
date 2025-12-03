import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [allowPageScroll, setAllowPageScroll] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right, 0 for initial
  const scrollTimeoutRef = useRef(null);
  const heroRef = useRef(null);
  const lastScrollTimeRef = useRef(Date.now());
  const prevSlideRef = useRef(0);
  
  // ========== HARDCODED HERO PRODUCTS ==========
  const heroProducts = [
    { 
      id: 4, 
      name: 'Alpinestars Supertech R10 Carbon Helmet', 
      image: '/hero/helmet2.png', 
      link: '/product/4',
      category: 'Helmets'
    },
    { 
      id: 37, 
      name: 'Bell Rogue Open Face Helmet', 
      image: '/hero/helmet1.png', 
      link: '/product/37',
      category: 'Helmets'
    },
    { 
      id: 39, 
      name: 'Sedici Podio2 Jacket', 
      image: '/hero/jackets1.png', 
      link: '/product/39',
      category: 'Jackets'
    },
    { 
      id: 53, 
      name: 'Leatt Moto65 Pro Chest Protector', 
      image: '/hero/jackets2.png', 
      link: '/product/53',
      category: 'Protection'
    },
    { 
      id: 68, 
      name: 'Dainese Drake Air ABS Luteshell Pants', 
      image: '/hero/pants1.png', 
      link: '/product/68',
      category: 'Pants'
    },
    { 
      id: 125, 
      name: 'Forma Freccia Boots', 
      image: '/hero/boots1.png', 
      link: '/product/125',
      category: 'Boots'
    },
    { 
      id: 158, 
      name: 'Icon Hypersport Short Gloves', 
      image: '/hero/gloves1.png', 
      link: '/product/158',
      category: 'Gloves'
    }
  ];

  const totalSlides = heroProducts.length;
  const isLastSlide = currentSlide === totalSlides - 1;

  // ========== SCROLL HANDLER ==========
  const handleScroll = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return;
    
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;
    
    // Throttle scroll events
    if (timeSinceLastScroll < 300) return;
    
    lastScrollTimeRef.current = now;
    
    // Get scroll direction
    const deltaY = e.deltaY;
    const isScrollingDown = deltaY > 0;
    
    // SPECIAL CASE: On last slide and scrolling DOWN
    if (isLastSlide && isScrollingDown && !allowPageScroll) {
      // First scroll on last slide: enable page scroll for next attempt
      setAllowPageScroll(true);
      return;
    }
    
    // If page scroll is allowed, don't handle carousel navigation
    if (allowPageScroll) {
      return;
    }
    
    // Handle carousel navigation
    let newIndex;
    if (isScrollingDown) {
      newIndex = Math.min(currentSlide + 1, totalSlides - 1);
      setDirection(1); // Moving forward (left slide)
    } else {
      newIndex = Math.max(currentSlide - 1, 0);
      setDirection(-1); // Moving backward (right slide)
    }
    
    // Only update if slide changes
    if (newIndex !== currentSlide) {
      setIsAnimating(true);
      prevSlideRef.current = currentSlide;
      setCurrentSlide(newIndex);
      
      // Reset animation flag after delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  }, [currentSlide, totalSlides, isAnimating, isLastSlide, allowPageScroll]);

  // ========== SETUP SCROLL LISTENER ==========
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    const handleWheel = (e) => {
      handleScroll(e);
    };

    // ALWAYS prevent default to control scrolling
    heroElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      if (heroElement) {
        heroElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleScroll]);

  // ========== HANDLE PAGE SCROLL WHEN ALLOWED ==========
  useEffect(() => {
    if (allowPageScroll && isLastSlide) {
      // Calculate scroll amount based on window height
      const scrollAmount = window.innerHeight * 0.8;
      
      // Smooth scroll to next section
      window.scrollTo({
        top: window.pageYOffset + scrollAmount,
        behavior: 'smooth'
      });
      
      // Reset after scrolling
      setTimeout(() => {
        setAllowPageScroll(false);
      }, 1000);
    }
  }, [allowPageScroll, isLastSlide]);

  // ========== RESET ALLOW PAGE SCROLL WHEN SLIDE CHANGES ==========
  useEffect(() => {
    if (!isLastSlide) {
      setAllowPageScroll(false);
    }
  }, [currentSlide, isLastSlide]);

  // ========== HANDLE SCROLL FROM BELOW ==========
  useEffect(() => {
    const handleGlobalScroll = () => {
      const heroElement = heroRef.current;
      if (!heroElement) return;
      
      const rect = heroElement.getBoundingClientRect();
      const heroBottom = rect.bottom;
      const windowHeight = window.innerHeight;
      
      // If hero bottom is near top of viewport (scrolled up from below)
      if (heroBottom < windowHeight * 0.3 && heroBottom > 0) {
        // Set to last slide
        setCurrentSlide(totalSlides - 1);
        setAllowPageScroll(false);
        setDirection(0); // Reset direction
      }
    };
    
    window.addEventListener('scroll', handleGlobalScroll);
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, [totalSlides]);

  // ========== PROGRESS BAR CALCULATIONS ==========
  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  // ========== CLICK TO JUMP ON PROGRESS BAR ==========
  const goToSlide = (index) => {
    if (index === currentSlide || isAnimating) return;
    
    // Determine direction based on slide index
    if (index > currentSlide) {
      setDirection(1); // Moving forward
    } else {
      setDirection(-1); // Moving backward
    }
    
    setIsAnimating(true);
    prevSlideRef.current = currentSlide;
    setCurrentSlide(index);
    setAllowPageScroll(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // ========== ANIMATION VARIANTS ==========
  const slideVariants = {
    // Initial state for entering slide
    enter: (direction) => ({
      x: direction > 0 ? "100%" : direction < 0 ? "-100%" : "0%",
      opacity: 0
    }),
    // Animate to center
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "tween", duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.4, ease: "easeOut" }
      }
    },
    // Exit state for leaving slide
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : direction < 0 ? "100%" : "0%",
      opacity: 0,
      transition: {
        x: { type: "tween", duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.3, ease: "easeOut" }
      }
    })
  };

  // Content animation variants
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section 
      ref={heroRef}
      className="hero-scroll-carousel"
    >
      {/* ========== DARK BACKGROUND ========== */}
      <div className="hero-bg"></div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="hero-container">
        <AnimatePresence mode="wait" custom={direction}>
          {heroProducts.map((product, index) => (
            index === currentSlide && (
              <motion.div
                key={product.id}
                className="hero-slide"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* ========== CONTENT GRID ========== */}
                <div className="hero-content-grid">
                  {/* LEFT COLUMN - TEXT (DESKTOP) / BELOW IMAGE (MOBILE) */}
                  <div className="text-column">
                    <motion.div
                      className="category-badge"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 }}
                    >
                      {product.category}
                    </motion.div>

                    <motion.h1
                      className="product-title"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                    >
                      {product.name}
                    </motion.h1>

                    <motion.div
                      className="cta-container"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                    >
                      <motion.a
                        href={product.link}
                        className="view-details-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Full Details
                        <span className="btn-icon">→</span>
                      </motion.a>
                    </motion.div>
                  </div>

                  {/* RIGHT COLUMN - IMAGE (DESKTOP) / TOP (MOBILE) */}
                  <div className="image-column">
                    <motion.div
                      className="image-container"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.15 }}
                    >
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="product-hero-image"
                        animate={{
                          y: [0, -8, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut"
                        }}
                        onError={(e) => {
                          console.error(`Failed to load: ${product.image}`);
                          e.target.style.opacity = '0';
                        }}
                      />
                      
                      {/* Glow Effect */}
                      <div className="image-glow"></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* ========== PROGRESS BAR ========== */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPosition = (e.clientX - rect.left) / rect.width;
              const newIndex = Math.min(Math.floor(clickPosition * totalSlides), totalSlides - 1);
              goToSlide(newIndex);
            }}
          >
            <div 
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Slide Counter */}
          <div className="slide-counter">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;