// Cloud Ascend Platform Configuration

// Configurable authentication route
export const AUTH_ROUTE = "/login"; // Pointing to standard login route

// Configurable statistics for the Hero section
export const communityStats = [
  {
    value: "500+",
    label: "Community Members"
  },
  {
    value: "25+",
    label: "Events Conducted"
  },
  {
    value: "10+",
    label: "Workshops Hosted"
  }
];

// About the Platform Features
export const platformFeatures = [
  {
    id: "event-reg",
    title: "Event Registration",
    description: "Discover, join, and track upcoming cloud workshops, bootcamps, and hackathons.",
    icon: "Calendar"
  },
  {
    id: "learning-roadmaps",
    title: "AWS Learning Roadmaps",
    description: "Follow structured, step-by-step guidance tailored for student builders to master cloud computing.",
    icon: "Map"
  },
  {
    id: "cert-guidance",
    title: "Certification Guidance",
    description: "Get structured resources, exam vouchers, and practice quizzes for AWS industry-recognized credentials.",
    icon: "Award"
  },
  {
    id: "community-acts",
    title: "Community Activities",
    description: "Connect with peer developers, share cloud projects, and collaborate on open-source solutions.",
    icon: "Users"
  },
  {
    id: "student-res",
    title: "Student Resources",
    description: "Access curated whitepapers, free credits guidance, and template repositories to build faster.",
    icon: "BookOpen"
  },
  {
    id: "quizzes",
    title: "Quizzes & Learning Labs",
    description: "Test your skills with cloud challenges, sandbox lab guides, and gamified trivia boards.",
    icon: "Gamepad2"
  }
];

// Mock Upcoming Events Preview (3-4 events) with image cover, time, and seats left
export const upcomingEvents = [
  {
    id: "evt-1",
    title: "Cloud Practitioner Bootcamp",
    date: "June 24, 2026",
    time: "10:00 AM - 1:00 PM IST",
    venue: "Lab 3, CSE Block & Hybrid",
    type: "Workshop",
    seatsLeft: 42,
    image: "/images/student_workshop.png",
    description: "A fast-paced, hands-on boot camp covering core AWS architecture, services, and billing. Perfect for beginners planning their AWS Certified Cloud Practitioner exam.",
    ctaText: "Register Now"
  },
  {
    id: "evt-2",
    title: "AWS Serverless Hackfest",
    date: "July 17-19, 2026",
    time: "3-Day Coding Sprint",
    venue: "Main Campus Incubation Hub",
    type: "Hackathon",
    seatsLeft: 15,
    image: "/images/student_hackathon.png",
    description: "Form a team, build cloud-native serverless solutions to real-world issues on AWS, and pitch to industry judges. Win AWS credits and premium merchandise.",
    ctaText: "Register Now"
  },
  {
    id: "evt-3",
    title: "Generative AI on AWS Session",
    date: "August 05, 2026",
    time: "5:00 PM - 6:30 PM IST",
    venue: "Virtual Session via Discord",
    type: "Tech Talk",
    seatsLeft: 120,
    image: "/images/student_meetup.png",
    description: "Explore Amazon Bedrock and AWS Q. Learn how to integrate pre-trained foundation models into your React web applications in under an hour.",
    ctaText: "Register Now"
  }
];

// 25+ Cloud Learning Domains scrolling tags list
export const learningDomainsData = [
  "☁ AWS Cloud Computing",
  "🖥 Amazon EC2",
  "⚡ AWS Lambda",
  "🪣 Amazon S3",
  "🪧 Amazon RDS",
  "🌐 Amazon VPC",
  "🔐 IAM & Security",
  "🛡 DevSecOps",
  "⚙ CI/CD Pipelines",
  "🐳 Containers & Docker",
  "☸ Kubernetes",
  "📊 Cloud Monitoring",
  "🤖 Machine Learning",
  "🧠 Amazon SageMaker",
  "📦 Serverless Architecture",
  "🔄 Infrastructure as Code",
  "🏗 Cloud Architecture",
  "🏗 AWS Student Builders",
  "🚀 AWS Certifications",
  "📡 Cloud Networking",
  "💾 Storage Solutions",
  "🔍 Observability",
  "📈 Data Analytics",
  "🔒 Cloud Security",
  "🧩 Microservices",
  "🌍 Multi-Cloud Concepts"
];

// Community Testimonials data list
export const testimonialsData = [
  {
    id: "test-1",
    name: "Aravind Swamy",
    role: "AWS Certified Student",
    initials: "AS",
    text: "Preparing for the Cloud Practitioner exam with Cloud Ascend peer groups was a game changer. The practice guides and mock questions gave me exactly what I needed to pass on my first try!",
    rating: 5
  },
  {
    id: "test-2",
    name: "Meera Nair",
    role: "Hackathon Winner",
    initials: "MN",
    text: "Building serverless microservices during the AWS Hackfest showed me how much you can build in a short time. The mentors from the REC chapter helped us get our databases linked instantly.",
    rating: 5
  },
  {
    id: "test-3",
    name: "Vikram Sen",
    role: "Workshop Participant",
    initials: "VS",
    text: "I went from zero cloud knowledge to running EC2 instances and launching docker containers in one afternoon. The hands-on labs are so much better than dry video tutorials.",
    rating: 5
  },
  {
    id: "test-4",
    name: "Rohan Das",
    role: "Cloud Practitioner & Builder",
    initials: "RD",
    text: "The student community is extremely supportive. Whenever I run into IAM permission blockages, someone on the Discord channel points me to the exact policy fix within minutes.",
    rating: 5
  }
];

// Community Gallery Items (student-focused activities) with mixed aspect ratio layout metrics
export const galleryItems = [
  {
    id: "gal-1",
    title: "Hands-on Cloud Lab",
    subtitle: "Students building serverless APIs",
    image: "/images/gallery1.jpeg",
    category: "Workshop",
    ratioClass: "ratio-landscape"
  },
  {
    id: "gal-2",
    title: "AWS Builder Day",
    subtitle: "Hackathon ideation session",
    image: "/images/gallery2.jpeg",
    category: "Hackathon",
    ratioClass: "ratio-portrait"
  },
  {
    id: "gal-3",
    title: "Cloud Mixer Meetup",
    subtitle: "Peer networking & cloud debate",
    image: "/images/gallery3.jpeg",
    category: "Meetup",
    ratioClass: "ratio-square"
  },
  {
    id: "gal-4",
    title: "AWS Cloud Quest Challenge",
    subtitle: "Gamified cloud learning sprint",
    image: "/images/gallery4.jpeg",
    category: "Activity",
    ratioClass: "ratio-portrait"
  },
  {
    id: "gal-5",
    title: "Alumni AMA Tech Session",
    subtitle: "AWS Solution Architects share tips",
    image: "/images/gallery5.jpeg",
    category: "Tech Talk",
    ratioClass: "ratio-landscape"
  },
  {
    id: "gal-6",
    title: "Cloud Career Guidance Panel",
    subtitle: "Panel discussions on AWS Certifications",
    image: "/images/gallery6.jpeg",
    category: "Guidance",
    ratioClass: "ratio-square"
  }
];
