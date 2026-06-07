import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Award, Compass, Users } from 'lucide-react';
import { communityStats } from '../../config';
import './Hero.css';

const slides = [
  {
    id: 1,
    headline: "Explore AWS Events",
    description: "Join workshops, technical sessions, cloud challenges, and hands-on learning experiences designed specifically for university students.",
    ctaText: "Explore Events",
    badge: "Community Activities",
    graphicType: "events"
  },
  {
    id: 2,
    headline: "Start Your AWS Journey",
    description: "Follow structured, student-friendly learning paths and grow from a complete cloud beginner to an advanced builder ready for the industry.",
    ctaText: "View Roadmap",
    badge: "Learning Path",
    graphicType: "journey"
  },
  {
    id: 3,
    headline: "Learn AWS Certifications",
    description: "Prepare for industry-recognized AWS certifications with guided peer learning groups, study guides, and test-taking tips.",
    ctaText: "Get Started",
    badge: "Professional Credentials",
    graphicType: "certs"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Helper to render active slide cloud-themed graphics on the right
  const renderGraphic = (type) => {
    switch (type) {
      case "events":
        return (
          <div className="hero-graphic-wrap events-graphic">
            {/* Main cloud aura */}
            <div className="glow-aura teal-glow" />
            <div className="cloud-base float-animation">
              <Compass size={80} className="cloud-central-icon" />
            </div>
            {/* Floating visual indicators */}
            <motion.div 
              className="floating-card hero-float-card-1 glass-card"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Calendar className="text-teal" size={18} />
              <div>
                <h6>CCP Bootcamp</h6>
                <p>June 24</p>
              </div>
            </motion.div>
            <motion.div 
              className="floating-card hero-float-card-2 glass-card"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
            >
              <Users className="text-mint" size={18} />
              <div>
                <h6>AWS Meetup</h6>
                <p>200+ RSVP</p>
              </div>
            </motion.div>
          </div>
        );
      case "journey":
        return (
          <div className="hero-graphic-wrap journey-graphic">
            <div className="glow-aura beige-glow" />
            <div className="cloud-base float-animation-delayed">
              <svg viewBox="0 0 100 100" className="cloud-central-svg">
                {/* Node connection lines */}
                <line x1="20" y1="50" x2="50" y2="20" stroke="var(--primary-teal)" strokeWidth="3" strokeDasharray="4 4" />
                <line x1="50" y1="20" x2="80" y2="50" stroke="var(--primary-teal)" strokeWidth="3" strokeDasharray="4 4" />
                <line x1="20" y1="50" x2="50" y2="80" stroke="var(--primary-teal)" strokeWidth="3" strokeDasharray="4 4" />
                <line x1="50" y1="80" x2="80" y2="50" stroke="var(--primary-teal)" strokeWidth="3" strokeDasharray="4 4" />
                {/* Core node */}
                <circle cx="50" cy="20" r="10" fill="var(--primary-teal)" />
                <circle cx="20" cy="50" r="10" fill="var(--secondary-beige)" />
                <circle cx="80" cy="50" r="10" fill="var(--accent-mint)" />
                <circle cx="50" cy="80" r="12" fill="var(--primary-teal)" />
              </svg>
            </div>
            <motion.div 
              className="floating-card hero-float-card-1 glass-card"
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <span className="badge badge-teal">Step 1: Core</span>
            </motion.div>
            <motion.div 
              className="floating-card hero-float-card-3 glass-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="badge badge-mint">Step 2: Serverless</span>
            </motion.div>
          </div>
        );
      case "certs":
        return (
          <div className="hero-graphic-wrap certs-graphic">
            <div className="glow-aura mint-glow" />
            <div className="cloud-base float-animation">
              <Award size={80} className="cloud-central-icon" />
            </div>
            {/* Floating Cert Badge Placeholders */}
            <motion.div 
              className="floating-badge-box cert-badge-1 glass-card"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
              <div className="cert-badge-inner">CCP</div>
            </motion.div>
            <motion.div 
              className="floating-badge-box cert-badge-2 glass-card"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              <div className="cert-badge-inner">SAA</div>
            </motion.div>
            <motion.div 
              className="floating-badge-box cert-badge-3 glass-card"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="cert-badge-inner">DVA</div>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Subtle Gradients */}
      <div className="hero-bg-lights">
        <div className="light-blob light-blob-1" />
        <div className="light-blob light-blob-2" />
      </div>

      <div className="container hero-container">
        {/* Main Content Area */}
        <div className="hero-main-content">
          <div className="hero-text-slider">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="hero-slide"
              >
                <div className="hero-badge-wrap">
                  <span className="badge badge-teal">{slides[currentSlide].badge}</span>
                </div>
                <h1 className="hero-heading">
                  {slides[currentSlide].headline}
                </h1>
                <p className="body-large hero-desc">
                  {slides[currentSlide].description}
                </p>
                <div className="hero-ctas">
                  <a href="#events" className="btn btn-primary">
                    {slides[currentSlide].ctaText} <ArrowRight size={18} />
                  </a>
                  <a href="#about" className="btn btn-secondary">
                    Learn More
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="hero-slider-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`slider-dot ${currentSlide === index ? 'slider-dot-active' : ''}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Visual Graphic Area */}
          <div className="hero-visual-side">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="hero-graphic-container"
              >
                {renderGraphic(slides[currentSlide].graphicType)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Integrated Statistics row at bottom */}
        <div className="hero-stats-row">
          {communityStats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="stat-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "var(--shadow-lg)" }}
            >
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
