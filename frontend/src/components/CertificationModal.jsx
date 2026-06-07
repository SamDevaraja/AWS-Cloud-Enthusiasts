import { useEffect } from 'react';

const CERT_DETAILS = {
  CCP: {
    title: "AWS Certified Cloud Practitioner",
    important: "Validates your overall understanding of the AWS Cloud platform, covering basic cloud concepts, security, and compliance.",
    gain: "Foundational knowledge of AWS core services, pricing models, and architectural principles. It's the ideal starting point for anyone new to cloud computing.",
    duration: "90 minutes"
  },
  SAA: {
    title: "AWS Certified Solutions Architect - Associate",
    important: "Demonstrates your knowledge of how to architect and deploy secure and robust applications on AWS technologies.",
    gain: "The ability to design cost and performance-optimized solutions, demonstrating a strong understanding of the AWS Well-Architected Framework.",
    duration: "130 minutes"
  },
  SAP: {
    title: "AWS Certified Solutions Architect - Professional",
    important: "Evaluates advanced technical skills and experience in designing distributed applications and systems on the AWS platform.",
    gain: "Mastery in designing complex architectures, optimizing enterprise infrastructure, and deep, comprehensive knowledge of across the AWS ecosystem.",
    duration: "180 minutes"
  },
  SEC: {
    title: "AWS Certified Security - Specialty",
    important: "Validates your expertise in securing data and workloads in the AWS Cloud to meet complex regulatory and compliance requirements.",
    gain: "Deep understanding of specialized data classifications, AWS data protection mechanisms, encryption methods, and secure internet protocols.",
    duration: "170 minutes"
  },
  ANS: {
    title: "AWS Certified Advanced Networking - Specialty",
    important: "Validates advanced networking skills and experience in designing and maintaining complex network architectures on AWS.",
    gain: "Ability to design, develop, and deploy cloud-based solutions using AWS, and implement core network services according to best practices.",
    duration: "170 minutes"
  },
  DEA: {
    title: "AWS Certified Data Engineer - Associate",
    important: "Validates skills in implementing data pipelines, optimizing data models, and managing data life cycles.",
    gain: "Expertise in core data engineering concepts and utilizing AWS services to effectively ingest, transform, and store large volumes of data.",
    duration: "130 minutes"
  },
  DVA: {
    title: "AWS Certified Developer - Associate",
    important: "Proves your ability to write, deploy, and debug cloud-based applications using core AWS services.",
    gain: "A deep understanding of core AWS services, their uses, and basic AWS architecture best practices for developing scalable applications.",
    duration: "130 minutes"
  },
  DOP: {
    title: "AWS Certified DevOps Engineer - Professional",
    important: "Validates technical expertise in provisioning, operating, and managing distributed application systems on the AWS platform.",
    gain: "Advanced skills in continuous integration and continuous delivery (CI/CD), automation, Infrastructure as Code (IaC), and robust monitoring.",
    duration: "180 minutes"
  },
  SOA: {
    title: "AWS Certified SysOps Administrator - Associate",
    important: "Validates technical expertise in deployment, management, and day-to-day operations on the AWS platform.",
    gain: "Skills to deploy, manage, and operate scalable, highly available, and fault-tolerant systems on AWS, ensuring high data integrity.",
    duration: "130 minutes"
  },
  MLA: {
    title: "AWS Certified Machine Learning - Associate",
    important: "Demonstrates your foundational ability to build, train, tune, and deploy machine learning models using the AWS Cloud.",
    gain: "Core ML knowledge on AWS, perfect for data professionals taking their first steps into operationalizing AI/ML workloads.",
    duration: "130 minutes"
  },
  MLS: {
    title: "AWS Certified Machine Learning - Specialty",
    important: "Validates your deep expertise to build, train, tune, and deploy machine learning models using the AWS Cloud.",
    gain: "Advanced knowledge of AWS ML services, the ability to select the appropriate ML approach for a given business problem, and design scalable ML solutions.",
    duration: "170 minutes"
  },
  DBS: {
    title: "AWS Certified Database - Specialty",
    important: "Validates your expertise in recommending, designing, and maintaining the optimal AWS database solution for any use case.",
    gain: "Comprehensive understanding of all AWS database services, migrations, and how to optimize relational and non-relational database designs.",
    duration: "180 minutes"
  },
  AIP: {
    title: "AWS Certified AI Practitioner",
    important: "Validates essential understanding of artificial intelligence, machine learning, and generative AI concepts.",
    gain: "Foundational knowledge of AI/ML services and workloads on AWS, ethical AI considerations, and common AI use cases.",
    duration: "90 minutes"
  }
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
  MLS: '/machine-learning-associate.png', // Using MLA icon as fallback for Specialty
  DBS: '/database.png',
  AIP: '/ai-practitioner.png',
};

export default function CertificationModal({ isOpen, onClose, certCode }) {
  if (!isOpen || !certCode) return null;
  const details = CERT_DETAILS[certCode] || CERT_DETAILS.CCP; // Fallback

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2F3437]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content - Styled with the strict color palette */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#F7F7F5] shadow-2xl border border-[#005E63]/20 p-6 sm:p-8 transform transition-all overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#2F3437]/50 hover:text-[#2F3437] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 flex items-center justify-center">
            <img 
              src={CERT_BADGE_IMAGES[certCode] || CERT_BADGE_IMAGES.CCP} 
              alt={details.title} 
              className="w-32 h-32 object-contain drop-shadow-xl"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#005E63] mb-6 pr-8">{details.title}</h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-[#005E63] uppercase tracking-wider mb-2">Why this certification is important</h4>
                <p className="text-[#2F3437] text-sm leading-relaxed">{details.important}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-[#6FB6B3] uppercase tracking-wider mb-2">What you will gain</h4>
                <p className="text-[#2F3437] text-sm leading-relaxed">{details.gain}</p>
              </div>
              
              <div className="inline-block bg-[#BFE3DE] rounded-lg px-4 py-2 border border-[#6FB6B3]">
                <span className="text-sm font-semibold text-[#004F54] mr-2">Exam Duration:</span>
                <span className="text-sm font-bold text-[#005E63]">{details.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
