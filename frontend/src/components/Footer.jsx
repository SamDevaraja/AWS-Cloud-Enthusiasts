import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Heart, Mail, ArrowUpRight, MapPin } from 'lucide-react';


export default function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname.startsWith('/reset-password');

  if (isAuthPage) return null;

  // Check if we are in the dashboard (any page other than Home and Auth)
  const isDashboardPage = location.pathname !== '/';

  return (
    <footer className={`relative bg-[#090D0F] text-[#A0AAB2] border-t border-white/5 mt-auto overflow-hidden ${isDashboardPage ? 'md:ml-64 z-30' : ''}`}>
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary-teal)] to-transparent opacity-40" />

      {/* Decorative blurred ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--primary-teal)] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[var(--accent-mint)] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4 md:space-y-6">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <img src="/logo.png" alt="AWS Cloud Clubs REC" className="relative w-12 h-12 rounded-xl" />
              <span className="text-xl font-extrabold text-white tracking-tight group-hover:text-[#4AB1E9] transition-colors duration-300">
                AWS Cloud Clubs <span className="text-[#4AB1E9] group-hover:text-white transition-colors duration-300">REC</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#8A95A5]">
              Empowering student builders to learn, build, and scale with AWS. 
              Join our community to access exclusive resources, workshops, and career opportunities in cloud computing.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://www.instagram.com/aws_sbg_rec/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[var(--primary-teal)] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-[#A0AAB2] shadow-sm border border-white/5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/aws-sbg-rec/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[var(--primary-teal)] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-[#A0AAB2] shadow-sm border border-white/5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://chat.whatsapp.com/KSFvYJKRYyB31aL0IZMugK?mode=gi_t" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 hover:bg-[var(--primary-teal)] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-[#A0AAB2] shadow-sm border border-white/5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 md:col-start-7 space-y-4 md:space-y-6">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs">Explore</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center group w-fit">
                  Home <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-[var(--primary-teal)]" />
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors flex items-center group w-fit">
                  Events <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-[var(--primary-teal)]" />
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="hover:text-white transition-colors flex items-center group w-fit">
                  Certifications <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-[var(--primary-teal)]" />
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-white transition-colors flex items-center group w-fit">
                  Roadmap <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-[var(--primary-teal)]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-4 md:space-y-6">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs">Connect</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="https://www.instagram.com/aws_sbg_rec/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group hover:text-white transition-colors">
                  <div className="p-1.5 md:p-2 rounded-lg bg-white/5 group-hover:bg-[var(--primary-teal)]/20 transition-colors">
                    <svg className="w-4 h-4 text-[var(--primary-teal)] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/aws-sbg-rec/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group hover:text-white transition-colors">
                  <div className="p-1.5 md:p-2 rounded-lg bg-white/5 group-hover:bg-[var(--primary-teal)]/20 transition-colors">
                    <svg className="w-4 h-4 text-[var(--primary-teal)] fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://chat.whatsapp.com/KSFvYJKRYyB31aL0IZMugK?mode=gi_t" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group hover:text-white transition-colors">
                  <div className="p-1.5 md:p-2 rounded-lg bg-white/5 group-hover:bg-[var(--primary-teal)]/20 transition-colors">
                    <svg className="w-4 h-4 text-[var(--primary-teal)] fill-current" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  </div>
                  <span>WhatsApp Community</span>
                </a>
              </li>
              <li className="flex items-center space-x-3 group hover:text-white transition-colors cursor-default">
                <div className="p-1.5 md:p-2 rounded-lg bg-white/5 group-hover:bg-[var(--primary-teal)]/20 transition-colors">
                  <MapPin className="w-4 h-4 text-[var(--primary-teal)]" />
                </div>
                <span>Rajalakshmi Engineering College</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex justify-center items-center">
          <p className="text-xs text-[#6B7280] font-medium tracking-wide text-center">
            &copy; {new Date().getFullYear()} AWS Cloud Clubs REC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
