import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EventModal.css';

export default function EventModal({ event, isOpen, onClose }) {
  if (!isOpen || !event) return null;

  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Modal content animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const seatsLeft = event.seatsLeft !== undefined ? event.seatsLeft : Math.max(0, (event.capacity || 100) - (event.registered || 0));
  const eventDateStr = event.date ? (event.date.includes(',') ? event.date : new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : 'TBD';
  const banner = event.bannerBg || event.image || '';
  const isImage = banner.startsWith('http') || banner.startsWith('/') || banner.startsWith('data:') || banner.includes('.');

  return (
    <motion.div
      className="modal-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="modal-content glass-card"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Icon Top-Right */}
        <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* 1. Event Cover Image */}
        <div className="modal-cover-wrapper">
          {isImage ? (
            <img 
              src={banner} 
              alt={event.title} 
              className="modal-cover-img"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80`;
              }}
            />
          ) : (
            <div 
              style={{ background: banner || 'linear-gradient(135deg, var(--primary-teal) 0%, var(--secondary-beige) 100%)', width: '100%', height: '100%' }}
              className="modal-cover-img relative"
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}
          <span className="modal-badge-overlay badge badge-mint">
            {event.category || event.type || 'Cloud'}
          </span>
        </div>

        <div className="modal-body">
          {/* 2. Event Title */}
          <h3 className="modal-title">{event.title}</h3>

          {/* 3. Short Description */}
          <p className="modal-description">{event.description}</p>

          {/* 4. Event Information Section */}
          <div className="modal-info-section">
            <h4 className="modal-info-title">Event Details</h4>
            <div className="modal-info-grid">
              <div className="modal-info-item">
                <Calendar size={18} className="modal-info-icon" />
                <div>
                  <span className="modal-info-label">Date</span>
                  <span className="modal-info-value">{eventDateStr}</span>
                </div>
              </div>

              <div className="modal-info-item">
                <Clock size={18} className="modal-info-icon" />
                <div>
                  <span className="modal-info-label">Time</span>
                  <span className="modal-info-value">{event.time}</span>
                </div>
              </div>

              <div className="modal-info-item">
                <MapPin size={18} className="modal-info-icon" />
                <div>
                  <span className="modal-info-label">Venue</span>
                  <span className="modal-info-value">{event.venue}</span>
                </div>
              </div>

              <div className="modal-info-item">
                <Users size={18} className="modal-info-icon" />
                <div>
                  <span className="modal-info-label">Seats Available</span>
                  <span className="modal-info-value">{seatsLeft} spots left</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Action Section */}
        <div className="modal-action-section">
          <Link to={`/events/${event.id}`} className="btn btn-primary modal-action-btn-primary text-center" onClick={onClose}>
            Register Now
          </Link>
          <button className="btn btn-outline modal-action-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
