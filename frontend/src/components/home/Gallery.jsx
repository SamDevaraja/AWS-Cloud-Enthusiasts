import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { galleryItems } from '../../config';
import './Gallery.css';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['All', 'Workshop', 'Hackathon', 'Meetup', 'Activity'];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  // Framer Motion staggered grid items configurations
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="container">
        
        {/* Section Header */}
        <div className="gallery-header">
          <span className="badge badge-teal">Our Moments</span>
          <h2 className="section-heading mt-2">Community Gallery</h2>
          <p className="body-large section-subdesc">
            A glimpse into our campus activities. See student builders hacking, learning, and 
            collaborating together.
          </p>
        </div>

        {/* Category Filters */}
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-tab-btn ${activeCategory === cat ? 'filter-tab-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Performance-conscious Masonry Layout Container */}
        <div className="gallery-masonry">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="gallery-brick"
                onClick={() => setLightboxImage(item)}
              >
                {/* Visual card inner container with aspect ratio classes to prevent layout shifts */}
                <div className={`gallery-card-inner ${item.ratioClass}`}>
                  {/* Lazy-loaded optimized image element */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="gallery-img" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80`;
                    }}
                  />
                  
                  {/* Premium Hover overlay */}
                  <div className="gallery-overlay">
                    <span className="badge badge-mint gallery-tag">{item.category}</span>
                    <h4 className="gallery-brick-title">{item.title}</h4>
                    <p className="gallery-brick-subtitle">{item.subtitle}</p>
                    <div className="gallery-expand-icon">
                      <Plus size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal for previewing images */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div 
              className="lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
            >
              <motion.div 
                className="lightbox-modal glass-card"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="lightbox-close" 
                  onClick={() => setLightboxImage(null)}
                >
                  &times;
                </button>
                <img 
                  src={lightboxImage.image} 
                  alt={lightboxImage.title} 
                  className="lightbox-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80`;
                  }}
                />
                <div className="lightbox-details">
                  <span className="badge badge-teal">{lightboxImage.category}</span>
                  <h3>{lightboxImage.title}</h3>
                  <p className="body-text">{lightboxImage.subtitle}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
