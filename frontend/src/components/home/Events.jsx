import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, RefreshCw, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { upcomingEvents as fallbackEvents } from '../../config';
import './Events.css';

export default function Events({ onViewDetails }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle auto-playing slide interval
  useEffect(() => {
    if (events.length > 3) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [activeIndex, events.length]);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (events.length > 3) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % events.length);
      }, 6000); // Shift every 6 seconds
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/events/live');
      if (response.data && response.data.success && response.data.data.events?.length > 0) {
        const fetchedEvents = response.data.data.events;
        // Sort: Upcoming first, then Completed
        const sortedEvents = [...fetchedEvents].sort((a, b) => {
          const statusA = a.status?.toLowerCase() === 'completed' ? 1 : 0;
          const statusB = b.status?.toLowerCase() === 'completed' ? 1 : 0;
          return statusA - statusB;
        });
        setEvents(sortedEvents);
      } else {
        // Fallback to configured mock events if API is empty or database has no events
        const sortedFallback = [...fallbackEvents].sort((a, b) => {
          const statusA = a.status?.toLowerCase() === 'completed' ? 1 : 0;
          const statusB = b.status?.toLowerCase() === 'completed' ? 1 : 0;
          return statusA - statusB;
        });
        setEvents(sortedFallback);
      }
    } catch (err) {
      console.error('Error fetching live events:', err);
      // Fallback to mock events even if there's a backend connection error so page looks complete
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15 
      } 
    }
  };

  const getBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'workshop':
        return 'badge-teal';
      case 'hackathon':
        return 'badge-beige';
      case 'tech talk':
      case 'ai/ml':
      case 'devops':
        return 'badge-mint';
      default:
        return 'badge-teal';
    }
  };

  // Helper to render event banner image or fallback color/gradient
  const renderEventImage = (event) => {
    const banner = event.bannerBg || event.image || '';
    const isImage = banner.startsWith('http') || banner.startsWith('/') || banner.startsWith('data:') || banner.includes('.');

    if (isImage) {
      return (
        <img 
          src={banner} 
          alt={event.title} 
          className="event-card-img" 
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80`;
          }}
        />
      );
    }

    // Gradient or background solid color fallback
    return (
      <div 
        style={{ background: banner || 'linear-gradient(135deg, var(--primary-teal) 0%, var(--secondary-beige) 100%)', width: '100%', height: '100%' }}
        className="event-card-img-fallback relative"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
    );
  };

  return (
    <section 
      id="events" 
      className="events-section section-padding"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="container">
        
        {/* Section Header */}
        <div className="events-header">
          <span className="badge badge-teal">Get Involved</span>
          <h2 className="section-heading mt-2">Events</h2>
          <p className="body-large section-subdesc mb-4">
            Secure your spot in our upcoming sessions. Grow your skills, connect with industry experts, 
            and build cool things on AWS.
          </p>
        </div>

        {/* Dynamic States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ gap: '16px' }}>
            <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin" />
            <p className="text-sm font-semibold text-[#2F3437]/60">Loading events, please wait...</p>
          </div>
        ) : (
          <div className="testimonials-deck-wrapper">
            {events.length > 3 && (
              <button 
                onClick={() => setActiveIndex((prev) => (prev - 1 + events.length) % events.length)} 
                className="carousel-arrow arrow-left" 
                aria-label="Previous events"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {events.length > 3 && (
              <button 
                onClick={() => setActiveIndex((prev) => (prev + 1) % events.length)} 
                className="carousel-arrow arrow-right" 
                aria-label="Next events"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="events-grid">
              {(events.length <= 3 ? events : [
                events[activeIndex % events.length],
                events[(activeIndex + 1) % events.length],
                events[(activeIndex + 2) % events.length]
              ]).map((event) => {
                const seatsLeft = event.seatsLeft !== undefined ? event.seatsLeft : Math.max(0, (event.capacity || 100) - (event.registered || 0));
                const eventDateStr = event.date ? (event.date.includes(',') ? event.date : new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) : 'TBD';
                const isEnded = event.status?.toUpperCase() === 'COMPLETED';
                
                return (
                  <motion.div 
                    key={event.id}
                    className={`event-card glass-card relative ${isEnded ? 'grayscale-[0.8] opacity-80' : ''}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    whileHover={{ 
                      y: -10,
                      boxShadow: "var(--shadow-lg)",
                      borderColor: "var(--primary-teal)"
                    }}
                  >
                  {/* Cover Image at the top with overlay badge */}
                  <div className="event-card-image-wrapper">
                    {renderEventImage(event)}
                  </div>

                  {/* Card Body */}
                  <div className="event-card-body">
                    <h3 className="card-title event-title">{event.title}</h3>
                    
                    {/* Event details (Date / Location) */}
                    <div className="event-meta">
                      <div className="meta-item">
                        <Calendar size={16} className="meta-icon" />
                        <span>{eventDateStr} • {event.time}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={16} className="meta-icon" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <p className="body-text event-desc">{event.description}</p>
                  </div>

                  {/* Dual CTA Buttons */}
                  <div className="event-card-footer">
                    <Link to={`/events/${event.id}`} className="btn btn-primary event-cta-primary text-center">
                      Register Now
                    </Link>
                    <button 
                      onClick={() => onViewDetails(event)} 
                      className="btn btn-outline event-cta-secondary"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
