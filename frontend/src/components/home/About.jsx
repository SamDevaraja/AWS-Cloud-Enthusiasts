import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Map, Award, Users, BookOpen, Gamepad2 } from 'lucide-react';
import './About.css';
import { platformFeatures } from '../../config';
import { ClubLogoREC } from './ClubLogo';

const iconMap = {
  Calendar: Calendar,
  Map: Map,
  Award: Award,
  Users: Users,
  BookOpen: BookOpen,
  Gamepad2: Gamepad2
};

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        
        {/* SECTION 1: ABOUT THE PLATFORM */}
        <div className="about-platform-header">
          <span className="badge badge-teal">Our Platform</span>
          <h2 className="section-heading mt-2">About Cloud Enthusiasts</h2>
          <p className="body-large section-subdesc">
            Cloud Enthusiasts is the unified student technology hub designed to provide university students 
            with the tools, knowledge, and community needed to build and succeed with cloud technologies.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {platformFeatures.map((feat) => {
            const IconComponent = iconMap[feat.icon] || BookOpen;
            return (
              <motion.div 
                key={feat.id} 
                className="feature-card glass-card"
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  borderColor: "var(--primary-teal)",
                  boxShadow: "var(--shadow-lg)"
                }}
              >
                <div className="feature-icon-box">
                  <IconComponent size={24} className="feature-icon" />
                </div>
                <h3 className="card-title feature-title">{feat.title}</h3>
                <p className="body-text feature-desc">{feat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="about-divider" />

        {/* SECTION 2: ABOUT THE CLUB */}
        <div className="about-group-block">
          <div className="group-split-layout">
            
            {/* Left side: Dedicated flexible logo container */}
            <motion.div 
              className="group-logo-wrapper glass-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="logo-placeholder-bg">
                {/* Embedded REC Club Logo placeholder */}
                <ClubLogoREC className="large-logo-view" />
              </div>
              <div className="logo-upload-hint">
                <span>Official REC Club Logo Position</span>
              </div>
            </motion.div>

            {/* Right side: Description */}
            <motion.div 
              className="group-info-wrapper"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-mint">The Community</span>
              <h2 className="section-heading mt-2">AWS Student Builder Group REC</h2>
              
              <div className="group-desc-paragraphs">
                <p className="body-large text-highlight">
                  We are the official student-led campus technology chapter behind Cloud Enthusiasts, dedicated to 
                  fostering cloud innovation, hands-on builder workshops, and peer-to-peer cloud learning.
                </p>
                <p className="body-text mt-3">
                  AWS Student Builder Group REC brings AWS-focused workshops, certification preparation drives, 
                  and architectural hackathons directly to campus. Our mission is to bridge the gap between classroom theory 
                  and industry deployment, enabling REC students to gain real-world experience building on the cloud.
                </p>
                <p className="body-text mt-3">
                  Our student community develops and maintains the Cloud Enthusiasts platform to provide peers with a 
                  centralized hub for structured learning roadmaps, campus cloud challenges, and open collaboration.
                </p>
              </div>

              {/* Decorative elements representing cloud connection */}
              <div className="group-highlights-row">
                <div className="highlight-tag">
                  <span className="dot" /> REC Student Chapter
                </div>
                <div className="highlight-tag">
                  <span className="dot" /> Peer Mentorship
                </div>
                <div className="highlight-tag">
                  <span className="dot" /> Industry Connections
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
