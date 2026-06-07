import React, { useState } from 'react';
import { Server, Database, Zap, ShieldCheck, HardDrive, LayoutGrid, X, ExternalLink } from 'lucide-react';

const awsServicesData = [
  {
    id: 'ec2',
    name: 'Amazon EC2',
    description: 'Secure and resizable compute capacity for virtually any workload.',
    icon: Server,
    color: '#FF9900',
    features: [
      'Virtual machines in the cloud (Instances)',
      'Auto-scaling to handle load spikes',
      'Flexible pricing models (On-Demand, Spot, Reserved)',
      'Multiple OS support (Linux, Windows, macOS)'
    ],
    link: 'https://aws.amazon.com/ec2/'
  },
  {
    id: 's3',
    name: 'Amazon S3',
    description: 'Object storage built to retrieve any amount of data from anywhere.',
    icon: HardDrive,
    color: '#569A31',
    features: [
      'Industry-leading scalability and data availability',
      '99.999999999% (11 9s) of durability',
      'Comprehensive security and compliance capabilities',
      'Storage classes for different access patterns'
    ],
    link: 'https://aws.amazon.com/s3/'
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    description: 'Managed relational database service for MySQL, PostgreSQL, Oracle, SQL Server, and MariaDB.',
    icon: Database,
    color: '#3B48CC',
    features: [
      'Automated backups and patching',
      'Multi-AZ deployments for high availability',
      'Read Replicas to scale out read operations',
      'Push-button compute scaling'
    ],
    link: 'https://aws.amazon.com/rds/'
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    description: 'Serverless compute service that lets you run code without provisioning servers.',
    icon: Zap,
    color: '#FF9900',
    features: [
      'Run code without provisioning or managing servers',
      'Pay only for the compute time you consume',
      'Automatically scale applications by running code in response to triggers',
      'Native support for Node.js, Python, Java, Go, and more'
    ],
    link: 'https://aws.amazon.com/lambda/'
  },
  {
    id: 'iam',
    name: 'AWS IAM',
    description: 'Securely manage access to AWS services and resources.',
    icon: ShieldCheck,
    color: '#D13212',
    features: [
      'Fine-grained access control to AWS resources',
      'Multi-factor authentication (MFA) support',
      'Identity federation (SAML 2.0, OIDC)',
      'Free to use service'
    ],
    link: 'https://aws.amazon.com/iam/'
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    description: 'Fast, flexible NoSQL database service for single-digit millisecond performance at any scale.',
    icon: LayoutGrid,
    color: '#3B48CC',
    features: [
      'Fully managed NoSQL database',
      'Single-digit millisecond latency at any scale',
      'Built-in security, backup and restore, and in-memory caching',
      'Serverless with no servers to provision or manage'
    ],
    link: 'https://aws.amazon.com/dynamodb/'
  }
];

export default function AWSServices() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div className="bg-[#F7F3EB]/15 min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-[#005E63] font-display mb-3">
            Core AWS Services
          </h1>
          <p className="text-[15px] text-[#2F3437]/80 max-w-2xl mx-auto">
            Explore the foundational building blocks of the AWS Cloud. Click on any service to learn more about its key features and capabilities.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awsServicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-2xl p-6 border border-[#005E63]/10 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300"
                    style={{ backgroundColor: `${service.color}15`, color: service.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl text-[#2F3437]">{service.name}</h3>
                </div>
                <p className="text-sm text-[#2F3437]/70 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-[#005E63] group-hover:text-[#6FB6B3] transition-colors">
                  <span>View Features</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Popup */}
        {selectedService && (
          <div className="fixed inset-0 md:left-64 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-[#2F3437]/40 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedService(null)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#005E63]/10 flex items-center justify-between bg-gradient-to-r from-white to-[#F7F3EB]/30">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedService.color}15`, color: selectedService.color }}
                  >
                    <selectedService.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#2F3437]">{selectedService.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-[#2F3437]/50 hover:text-[#005E63] hover:bg-[#005E63]/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-[15px] text-[#2F3437]/80 mb-6 leading-relaxed">
                  {selectedService.description}
                </p>
                
                <h4 className="font-bold text-sm text-[#005E63] uppercase tracking-wider mb-4">
                  Key Features
                </h4>
                
                <ul className="space-y-3 mb-8">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#E4BC63] mt-2 mr-3" />
                      <span className="text-sm text-[#2F3437]/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* External Link Button */}
                <a 
                  href={selectedService.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-[#005E63] hover:bg-[#004F54] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <span>Learn more on AWS</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
