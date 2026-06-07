import React from 'react';
import { learningDomainsData } from '../../config';
import './LearningDomains.css';

export default function LearningDomains() {
  // Use all domains for a single scrolling track
  // Duplicate arrays multiple times to ensure seamless infinite looping scroll across a wide track
  const allDomainsDoubled = [...learningDomainsData, ...learningDomainsData, ...learningDomainsData, ...learningDomainsData];

  // Helper to assign brand colors strictly from the approved palette
  // 1: Primary Teal outline
  // 2: Mint background with Teal text
  // 3: Beige background with Charcoal text
  // 4: Subtle Teal solid background with White text
  const getTagStyleClass = (index) => {
    const styles = [
      'domain-tag-teal-outline',
      'domain-tag-mint-bg',
      'domain-tag-beige-bg',
      'domain-tag-teal-solid'
    ];
    return styles[index % styles.length];
  };

  return (
    <section className="domains-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="domains-header">
          <span className="badge badge-teal">Learning Scope</span>
          <h2 className="section-heading mt-2">Cloud Learning Domains</h2>
          <p className="body-large section-subdesc">
            Explore the diverse range of cloud technologies and domains you can master through the 
            activities and resources hosted on our platform.
          </p>
        </div>
      </div>

      {/* Marquee Scroller Containers */}
      <div className="marquee-wrapper">
        {/* Single Row: Leftward Scrolling Track */}
        <div className="marquee-track-container track-left">
          <div className="marquee-track">
            {allDomainsDoubled.map((domain, index) => (
              <div 
                key={`domain-${index}`} 
                className={`domain-tag ${getTagStyleClass(index)}`}
              >
                {domain}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
