import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cloud, Database, Cpu, Globe, Server } from 'lucide-react';
import './RoadmapPromo.css';

export default function RoadmapPromo() {
  // Configurable floating elements details
  const floatingCards = [
    {
      id: 1,
      title: "Cloud Practitioner",
      icon: Cloud,
      badgeText: "Foundational",
      colorClass: "badge-teal",
      delay: 0
    },
    {
      id: 2,
      title: "Solutions Architect",
      icon: Server,
      badgeText: "Associate",
      colorClass: "badge-beige",
      delay: 1.5
    },
    {
      id: 3,
      title: "Developer Associate",
      icon: Cpu,
      badgeText: "Associate",
      colorClass: "badge-mint",
      delay: 0.8
    },
    {
      id: 4,
      title: "Serverless & DBs",
      icon: Database,
      badgeText: "Advanced Labs",
      colorClass: "badge-teal",
      delay: 2.2
    }
  ];

  return (
    <section id="roadmap" className="roadmap-promo-section section-padding">
      {/* Glow highlight bg */}
      <div className="roadmap-glow-bg" />

      <div className="container roadmap-promo-container">
        <div className="roadmap-split-layout">
          
          {/* Left Side: Copy and Actions */}
          <motion.div 
            className="roadmap-copy-side"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge badge-mint">Career Alignment</span>
            <h2 className="section-heading mt-2">Explore the World of Cloud Computing</h2>
            
            <p className="subheading mt-3">
              Discover AWS certifications, structured learning paths, hands-on experiences, and opportunities to build your future in cloud technology.
            </p>
            
            <p className="body-text mt-3">
              Whether you're just beginning your cloud journey or preparing for advanced certifications, our platform helps you discover the right learning opportunities, peer groups, and community resources to scale your potential.
            </p>

            <div className="roadmap-cta-wrap mt-4">
              <a href="/register" className="btn btn-primary btn-large-promo">
                Explore the Cloud <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>

          {/* Right Side: Abstract Technology Graphic Visuals */}
          <div className="roadmap-visual-side">
            <div className="visual-core-wrapper">
              
              {/* Radial gradient background highlights */}
              <div className="visual-glow-ring" />

              {/* Central Abstract Cloud Graphic */}
              <motion.div 
                className="central-cloud-emblem glass-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <Cloud size={96} className="central-cloud-icon" />
                <span className="central-cloud-label">Cloud Ascend Gateway</span>
              </motion.div>

              {/* Floating Certification Cards */}
              {floatingCards.map((card) => {
                const CardIcon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    className={`floating-roadmap-card glass-card card-pos-${card.id}`}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 5, 
                      ease: "easeInOut",
                      delay: card.delay
                    }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                  >
                    <div className="floating-card-header">
                      <div className="floating-card-icon-box">
                        <CardIcon size={18} className="floating-card-icon" />
                      </div>
                      <span className={`badge ${card.colorClass} floating-card-badge`}>
                        {card.badgeText}
                      </span>
                    </div>
                    <h4 className="floating-card-title">{card.title}</h4>
                  </motion.div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
