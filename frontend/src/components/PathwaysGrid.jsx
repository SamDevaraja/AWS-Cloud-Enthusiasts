import { useState } from 'react';
import CertificationModal from './CertificationModal';

const LEVEL_COLORS = {
  Foundational: { bg: '#BFE3DE', accent: '#005E63', badge: '#005E63' }, // Soft Teal, Primary Teal
  Associate:    { bg: '#F7F7F5', accent: '#6FB6B3', badge: '#6FB6B3' }, // Card Background, Light Teal
  Professional: { bg: '#F7F7F5', accent: '#7D6A8F', badge: '#7D6A8F' }, // Accent Purple
  Specialty:    { bg: '#F7F7F5', accent: '#E4BC63', badge: '#E4BC63' }, // Accent Gold
};

const CERTIFICATIONS = [
  {
    level: 'Foundational',
    items: [
      { certCode: 'CCP', title: 'AWS Certified Cloud Practitioner', description: 'Foundational cloud computing and core service fundamentals.', imgSrc: '/cloud-practitioner.png' },
      { certCode: 'AIP', title: 'AWS Certified AI Practitioner', description: 'Essential AI/ML concepts and workloads on AWS.', imgSrc: '/ai-practitioner.png' },
    ]
  },
  {
    level: 'Associate',
    items: [
      { certCode: 'SAA', title: 'Solutions Architect – Associate', description: 'Broad technical skills in designing optimized AWS systems.', imgSrc: '/solutions-architect.png' },
      { certCode: 'DVA', title: 'Developer – Associate', description: 'Developing, deploying, and debugging cloud applications.', imgSrc: '/developer.png' },
      { certCode: 'DEA', title: 'Data Engineer – Associate', description: 'Data models, lifecycle management, and pipelines.', imgSrc: '/data-engineer.png' },
      { certCode: 'MLA', title: 'Machine Learning Engineer – Associate', description: 'Building and scaling ML models on AWS.', imgSrc: '/machine-learning-associate.png' },
      { certCode: 'SOA', title: 'CloudOps Engineer – Associate', description: 'System administration, deployment, and cloud operations.', imgSrc: '/cloud-ops.png' },
    ]
  },
  {
    level: 'Professional',
    specialty: false,
    items: [
      { certCode: 'SAP', title: 'Solutions Architect – Professional', description: 'Advanced skills in designing optimized AWS Cloud solutions.', imgSrc: '/solutions-architect-professional.png' },
      { certCode: 'DOP', title: 'DevOps Engineer – Professional', description: 'Advanced skills in provisioning, operating, and managing distributed systems.', imgSrc: '/devops-engineer.png' },
    ]
  },
  {
    level: 'Specialty',
    items: [
      { certCode: 'SEC', title: 'Security – Specialty', description: 'Deep dive into securing AWS cloud: identity, data protection, and incident response.', imgSrc: '/security.png' },
      { certCode: 'ANS', title: 'Advanced Networking – Specialty', description: 'Complex networking tasks and AWS networking architectures.', imgSrc: '/advanced-networking.png' },
      { certCode: 'DBS', title: 'Database – Specialty', description: 'Recommending, designing, and maintaining optimal AWS database solutions.', imgSrc: '/database.png' },
    ]
  },
];

const LEVEL_ICONS = {
  Foundational: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="17" width="20" height="4" rx="1" />
      <rect x="5" y="11" width="14" height="4" rx="1" />
      <rect x="8" y="5" width="8" height="4" rx="1" />
    </svg>
  ),
  Associate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Professional: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M6 9H4.5a2.5 2.5 0 010-5C6 4 6 6 6 6" /><path d="M18 9h1.5a2.5 2.5 0 000-5C18 4 18 6 18 6" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2Z" />
    </svg>
  ),
  Specialty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M11 3L8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  ),
};

const LEVEL_LABELS = {
  Foundational: { desc: 'Start your cloud journey' },
  Associate:    { desc: 'Build hands-on expertise' },
  Professional: { desc: 'Master advanced solutions' },
  Specialty:    { desc: 'Deep domain mastery' },
};

export default function PathwaysGrid() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section id="pathways" className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 font-sans bg-transparent">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: '#005E63' }}>
            AWS Certification Pathways
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#2F3437' }}>
            Explore AWS certifications across all levels — from foundational cloud literacy to expert specialty domains.
          </p>
        </div>

        {/* Certification Tiers */}
        <div className="space-y-14">
          {CERTIFICATIONS.map((tier) => {
            const colors = LEVEL_COLORS[tier.level];
            const meta = LEVEL_LABELS[tier.level];
            const levelIcon = LEVEL_ICONS[tier.level];
            return (
              <div key={tier.level}>
                {/* Tier Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2 shadow-sm"
                      style={{ background: colors.accent, color: '#F7F7F5' }}>
                      {levelIcon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#2F3437' }}>
                        {tier.level} Certifications
                      </h3>
                      <p className="text-xs font-medium" style={{ color: colors.accent }}>{meta.desc}</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px ml-2" style={{ background: `${colors.accent}40` }} />
                  <span className="whitespace-nowrap flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border"
                    style={{ background: `${colors.accent}10`, color: colors.accent, borderColor: `${colors.accent}30` }}>
                    {tier.items.length} cert{tier.items.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards */}
                <div className={`grid gap-5 ${
                  tier.items.length === 1
                    ? 'grid-cols-1 max-w-sm'
                    : tier.items.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {tier.items.map((cert) => (
                    <div
                      key={cert.title}
                      onClick={() => setSelectedCert(cert.certCode)}
                      className="group rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      style={{
                        background: '#F7F7F5',
                        border: `1px solid ${colors.accent}40`,
                        boxShadow: '0 4px 16px rgba(47,52,55,0.05)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 8px 24px ${colors.accent}30`;
                        e.currentTarget.style.border = `1px solid ${colors.accent}80`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(47,52,55,0.05)';
                        e.currentTarget.style.border = `1px solid ${colors.accent}40`;
                      }}
                    >
                      {/* Level badge */}
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                          style={{ background: `${colors.accent}15`, color: colors.accent }}>
                          {tier.level}
                        </span>
                      </div>

                      {/* Cert Badge Image + Text */}
                      <div className="flex items-center gap-4">
                        <div
                          className="w-20 h-20 flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden"
                          style={{ background: `${colors.accent}10` }}
                        >
                          <img
                            src={cert.imgSrc}
                            alt={cert.title}
                            className="w-full h-full object-contain p-1 transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold leading-snug mb-1" style={{ color: '#2F3437' }}>
                            {cert.title}
                          </h4>
                          <p className="text-xs leading-relaxed" style={{ color: '#2F3437', opacity: 0.8 }}>
                            {cert.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <CertificationModal 
        isOpen={!!selectedCert} 
        onClose={() => setSelectedCert(null)} 
        certCode={selectedCert} 
      />
    </section>
  );
}
