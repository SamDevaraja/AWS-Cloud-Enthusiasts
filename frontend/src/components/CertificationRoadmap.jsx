import { useState } from 'react';

// Reusing generic SVG icons for roles, colored appropriately
const DOMAIN_ICONS = {
  'cloud-architect': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" />
    </svg>
  ),
  'cloud-developer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  'junior-devops': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  ),
  'devops-engineer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
    </svg>
  ),
  'cloud-security': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  'netdevops': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  'mlops-engineer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" /><line x1="12" y1="8" x2="19" y2="16" />
    </svg>
  ),
  'data-engineer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  'cloud-engineer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
      <path d="M22 12l-10 7L2 12l10-7z" /><path d="M2 17l10 7 10-7" />
    </svg>
  ),
};

const CERT_BADGE_IMAGES = {
  CCP: '/cloud-practitioner.png',
  SAA: '/solutions-architect.png',
  SAP: '/solutions-architect-professional.png',
  SEC: '/security.png',
  ANS: '/advanced-networking.png',
  DEA: '/data-engineer.png',
  DVA: '/developer.png',
  DOP: '/devops-engineer.png',
  SOA: '/cloud-ops.png',
  MLA: '/machine-learning-associate.png',
  MLS: '/machine-learning-associate.png', // Fallback for Specialty
  DBS: '/database.png',
  AIP: '/ai-practitioner.png',
};

const ROADMAP_PATHS = [
  {
    id: 'cloud-engineer',
    role: 'Cloud Engineer',
    color: '#005E63', // Primary Teal
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Solutions Architect', level: 'Associate', short: 'SAA' },
    ],
  },
  {
    id: 'cloud-developer',
    role: 'Cloud Developer',
    color: '#6FB6B3', // Secondary
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Developer', level: 'Associate', short: 'DVA' },
    ],
  },
  {
    id: 'junior-devops',
    role: 'Junior DevOps',
    color: '#7D6A8F', // Accent Purple
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'SysOps Administrator', level: 'Associate', short: 'SOA' },
    ],
  },
  {
    id: 'cloud-architect',
    role: 'Cloud Architect',
    color: '#E4BC63', // Accent Gold
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Solutions Architect', level: 'Associate', short: 'SAA' },
      { name: 'Solutions Architect', level: 'Professional', short: 'SAP' },
    ],
  },
  {
    id: 'devops-engineer',
    role: 'DevOps Engineer / SRE',
    color: '#005E63', // Primary Teal
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'SysOps Administrator', level: 'Associate', short: 'SOA' },
      { name: 'DevOps Engineer', level: 'Professional', short: 'DOP' },
    ],
  },
  {
    id: 'cloud-security',
    role: 'Cloud Security Engineer',
    color: '#7D6A8F', // Accent Purple
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Solutions Architect', level: 'Associate', short: 'SAA' },
      { name: 'Security', level: 'Specialty', short: 'SEC' },
    ],
  },
  {
    id: 'netdevops',
    role: 'Migration/Hybrid Engineer',
    color: '#6FB6B3', // Secondary
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Solutions Architect', level: 'Associate', short: 'SAA' },
      { name: 'Advanced Networking', level: 'Specialty', short: 'ANS' },
    ],
  },
  {
    id: 'mlops-engineer',
    role: 'MLOps / Data Scientist',
    color: '#E4BC63', // Accent Gold
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Solutions Architect', level: 'Associate', short: 'SAA' },
      { name: 'Machine Learning', level: 'Specialty', short: 'MLS' },
    ],
  },
  {
    id: 'data-engineer',
    role: 'Data Engineer',
    color: '#005E63', // Primary Teal
    steps: [
      { name: 'Cloud Practitioner', level: 'Foundational', short: 'CCP' },
      { name: 'Data Engineer', level: 'Associate', short: 'DEA' },
      { name: 'Database', level: 'Specialty', short: 'DBS' },
    ],
  }
];

export default function CertificationRoadmap() {
  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent">
      
      <div className="max-w-[1400px] mx-auto relative z-10 font-sans">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#005E63' }}>
            AWS Certification Pathways Guide 2025
          </h2>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: '#2F3437' }}>
            Explore the recommended pathways to achieve your career goals. Click on any certification badge to view detailed insights.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="flex flex-col gap-6">
          {ROADMAP_PATHS.map((path, index) => (
            <div key={index} className="flex flex-col md:flex-row items-stretch gap-0 md:gap-6 group">
              
              {/* Left Side: Domain Box */}
              <div 
                className="w-full md:w-[280px] flex-shrink-0 rounded-2xl flex flex-col items-center justify-center p-6 relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                style={{ 
                  backgroundColor: '#F7F7F5', 
                  border: `2px solid ${path.color}`,
                  boxShadow: `0 8px 30px rgba(0,0,0,0.05)`
                }}
              >
                <div className="mb-4" style={{ color: path.color }}>
                  {DOMAIN_ICONS[path.id]}
                </div>
                
                <h3 className="text-center font-bold uppercase tracking-widest px-2 leading-tight text-lg" style={{ color: '#2F3437' }}>
                  {path.role}
                </h3>
                
                {/* Connector Line to Dashed Box (Desktop) */}
                <div className="hidden md:block absolute -right-6 top-1/2 w-6 h-[2px] z-0" style={{ backgroundColor: path.color }}></div>
              </div>

              {/* Right Side: Dashed Container */}
              <div 
                className="flex-1 rounded-2xl p-6 flex items-center overflow-x-auto relative mt-[-2px] md:mt-0 transition-colors duration-300"
                style={{ 
                  border: `2px dashed ${path.color}80`,
                  backgroundColor: '#F7F7F5'
                }}
              >
                <div className="flex items-center w-max min-w-full">
                  {path.steps.map((step, idx) => {
                    const badgeImg = CERT_BADGE_IMAGES[step.short];
                    const isLast = idx === path.steps.length - 1;
                    
                    return (
                      <div key={idx} className="flex items-center">
                        
                        {/* Badge Item */}
                        <div 
                          className="flex flex-col items-center gap-3 relative px-4"
                        >
                          <div className="relative w-24 h-24 flex items-center justify-center transition-all duration-300">
                            {badgeImg ? (
                              <img
                                src={badgeImg}
                                alt={step.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg border flex items-center justify-center" style={{ backgroundColor: '#BFE3DE', borderColor: '#6FB6B3' }}>
                                <span className="font-bold text-sm" style={{ color: '#005E63' }}>{step.short}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-center">
                            <span className="block text-sm font-semibold leading-tight mb-1 max-w-[100px]" style={{ color: '#2F3437' }}>
                              {step.name}
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#BFE3DE', color: '#005E63' }}>
                              {step.level}
                            </span>
                          </div>
                        </div>

                        {/* Arrow Connector */}
                        {!isLast && (
                          <div className="flex items-center px-2">
                            <svg className="w-12 h-6" fill="none" viewBox="0 0 48 24" style={{ color: path.color }}>
                              <line x1="0" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="2" />
                              <path d="M34 6l8 6-8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                        
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
