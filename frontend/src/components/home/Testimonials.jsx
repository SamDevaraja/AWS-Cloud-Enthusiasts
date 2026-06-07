import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsData } from '../../config';
import './Testimonials.css';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const autoPlayRef = useRef();

  // Handle auto-playing slide interval
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeIndex]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000); // Shift every 6 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const getVisibleTestimonials = () => {
    const len = testimonialsData.length;
    // On mobile we might only want 1, but for desktop we want 3. 
    // We'll return 3 and use CSS to stack them on mobile.
    return [
      testimonialsData[activeIndex],
      testimonialsData[(activeIndex + 1) % len],
      testimonialsData[(activeIndex + 2) % len]
    ];
  };

  // Slide animations mapping
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section className="testimonials-section section-padding" onMouseEnter={stopAutoPlay} onMouseLeave={startAutoPlay}>
      <div className="container">
        
        {/* Section Header */}
        <div className="testimonials-header">
          <span className="badge badge-teal">Community Feedback</span>
          <h2 className="section-heading mt-2">What Student Builders Say</h2>
          <p className="body-large section-subdesc">
            Read stories of growth, collaboration, and career preparation from student builders in our REC chapter.
          </p>
        </div>

        {/* Carousel Deck Container */}
        <div className="testimonials-deck-wrapper">
          {/* Arrow Buttons */}
          <button 
            onClick={handlePrev} 
            className="carousel-arrow arrow-left" 
            aria-label="Previous review"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext} 
            className="carousel-arrow arrow-right" 
            aria-label="Next review"
          >
            <ChevronRight size={24} />
          </button>

          {/* Testimonial Active Card Frame */}
          <div className="testimonial-card-frame">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col lg:flex-row gap-6 w-full h-full"
              >
                {getVisibleTestimonials().map((testimonial, idx) => (
                  <div key={`${activeIndex}-${idx}`} className="testimonial-card glass-card shadow-sm hover:shadow-md transition-shadow">
                    {/* Quote Icon Accent */}
                    <div className="testimonial-quote-icon-box">
                      <Quote size={28} className="testimonial-quote-icon" />
                    </div>

                    {/* Rating (★ strictly in Mint/Teal - no yellow/gold/orange) */}
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill="var(--primary-teal)" 
                          stroke="var(--primary-teal)" 
                          className="star-icon"
                        />
                      ))}
                    </div>

                    {/* Testimonial Message Body */}
                    <p className="testimonial-text">
                      "{testimonial.text}"
                    </p>

                    {/* Author Info */}
                    <div className="testimonial-author mt-auto w-full pt-4 border-t border-[var(--color-border)]">
                      <div className="author-avatar-badge">
                        {testimonial.initials}
                      </div>
                      <div className="text-left">
                        <h4 className="author-name">{testimonial.name}</h4>
                        <span className="author-role">{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="carousel-dots">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`carousel-dot ${activeIndex === index ? 'dot-active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
