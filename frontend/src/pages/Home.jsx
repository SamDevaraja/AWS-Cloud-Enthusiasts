import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Hero from '../components/home/Hero';
import About from '../components/home/About';
import LearningDomains from '../components/home/LearningDomains';
import Events from '../components/home/Events';
import Gallery from '../components/home/Gallery';
import Testimonials from '../components/home/Testimonials';
import RoadmapPromo from '../components/home/RoadmapPromo';
import EventModal from '../components/home/EventModal';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Learning Domains Marquee */}
        <LearningDomains />

        {/* Events Section */}
        <Events onViewDetails={handleOpenEventModal} />

        {/* Community Gallery Section */}
        <Gallery />

        {/* Testimonials Auto-sliding Reviews */}
        <Testimonials />

        {/* Cloud Promotion Section */}
        <RoadmapPromo />
      </main>

      {/* Event Details Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <EventModal 
            event={selectedEvent} 
            isOpen={isModalOpen} 
            onClose={handleCloseEventModal} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
