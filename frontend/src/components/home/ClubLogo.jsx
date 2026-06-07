import React from 'react';

// Platform Logo Component (renders Cloud Enthusiasts branding)
export function ClubLogo({ className = "", light = false }) {
  // Configured platform logo source pointing to the logo file
  const LOGO_IMAGE_SRC = "/images/cloud_ascend_logo.png";

  return (
    <div className={`platform-logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img 
        src={LOGO_IMAGE_SRC} 
        alt="Cloud Enthusiasts Logo" 
        style={{ 
          height: '36px', 
          width: '36px', 
          objectFit: 'cover', 
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF',
          padding: '2px',
          boxShadow: 'var(--shadow-sm)'
        }} 
      />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', lineHeight: 1 }}>
        <span 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: '21px', 
            letterSpacing: '-0.02em',
            color: light ? '#FFFFFF' : 'var(--primary-teal)',
            transition: 'color 0.3s ease'
          }}
        >
          Cloud
        </span>
        <span 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 400, 
            fontSize: '21px', 
            letterSpacing: '-0.02em',
            color: light ? 'var(--secondary-beige)' : 'var(--color-text-sec)',
            transition: 'color 0.3s ease'
          }}
        >
          Enthusiasts
        </span>
      </div>
    </div>
  );
}

// Club Logo Component (renders AWS Student Builder Group REC branding placeholder)
export function ClubLogoREC({ className = "", light = false }) {
  const CLUB_LOGO_SRC = ""; // E.g., "/images/rec_club_logo.png"

  if (CLUB_LOGO_SRC) {
    return (
      <div className={`club-logo-rec-container ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={CLUB_LOGO_SRC} 
          alt="AWS Student Builder Group REC Logo" 
          style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // Visual placeholder SVG for REC club branding
  return (
    <div className={`club-logo-rec-placeholder ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(var(--shadow-md))' }}
      >
        <rect width="100" height="100" rx="24" fill={light ? "rgba(255,255,255,0.08)" : "var(--color-bg-sec)"} stroke="var(--primary-teal)" strokeWidth="4" />
        {/* Core AWS cloud architecture node representation */}
        <path d="M30 65H70C75.52 65 80 60.52 80 55C80 49.82 76.08 45.55 71.02 45.04C69.94 36.49 62.63 30 53.75 30C46.88 30 40.85 34.02 38.08 40.03C36.78 39.52 35.38 39.23 33.89 39.23C28.43 39.23 24 43.66 24 49.12C24 53.62 27.02 57.42 31.13 58.62L30 65Z" fill="var(--primary-teal)" />
        <circle cx="53" cy="48" r="8" fill={light ? "#000000" : "#FFFFFF"} opacity="0.2" />
        <text x="50" y="82" textAnchor="middle" fill="var(--primary-teal)" fontSize="13" fontWeight="800" fontFamily="var(--font-heading)">R E C</text>
      </svg>
      <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: 'var(--primary-teal)' }}>
          AWS Student Builder Group
        </h4>
        <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-text-sec)', textTransform: 'uppercase', marginTop: '4px' }}>
          REC Chapter
        </p>
      </div>
    </div>
  );
}

export default ClubLogo;
