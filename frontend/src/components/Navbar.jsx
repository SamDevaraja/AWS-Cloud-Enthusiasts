import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Calendar, Ticket, Compass, Menu, X, Newspaper, Map, Server, Award, MessageCircle, Bell } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const isActive = (path) => {
    if (path === '/events' && location.pathname.startsWith('/events')) return true;
    return location.pathname === path;
  };

  const landingNavItems = [
    { name: 'Home', path: '/', id: 'home', icon: Compass },
    { name: 'About', path: '/#about', id: 'about', icon: Layers },
    { name: 'Events', path: '/#events', id: 'events', icon: Calendar },
    { name: 'Gallery', path: '/#gallery', id: 'gallery', icon: Ticket },
    { name: 'Roadmap', path: '/#roadmap', id: 'roadmap', icon: Layers },
  ];

  const appNavItems = [
    { name: 'Events', path: '/events', icon: Layers },
    { name: 'My Tickets', path: '/my-tickets', icon: Ticket },
    { name: 'Certifications', path: '/certifications', icon: Award },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Newsbot', path: '/newsbot', icon: Newspaper },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'AWS Services', path: '/aws-services', icon: Server },
  ];

  const handleNavClick = (e, path, id) => {
    if (location.pathname === '/' && id) {
      e.preventDefault();
      setIsOpen(false);
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        window.location.hash = id;
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="h-[65px]"></div>
      <nav className="fixed w-full top-0 left-0 z-50 bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left Side Container */}
            <div className="flex items-center">
              {!isLoggedIn ? (
                /* Logo for Home Page */
                <Link to="/" className="flex items-center space-x-3 group">
                  <img src={logoImg} alt="Cloud Enthusiasts" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                  <span className="font-extrabold text-xl tracking-tight text-[var(--color-text-main)] font-display">
                    Cloud<span className="text-[var(--primary-teal)]"> Enthusiasts</span>
                  </span>
                </Link>
              ) : (
                /* Mobile Menu Button for App (Logged In) */
                <div className="md:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-main)] hover:text-[var(--primary-teal)] hover:bg-[var(--accent-mint)] focus:outline-none"
                  >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Nav - Centered */}
            <div className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-1 items-center ${isLoggedIn ? 'md:ml-32' : ''}`}>
              {!isLoggedIn && 
                landingNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={(e) => handleNavClick(e, item.path, item.id)}
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'bg-[var(--accent-mint)] text-[var(--primary-teal)] shadow-sm'
                          : 'text-[var(--color-text-main)] hover:bg-[var(--accent-mint)] hover:text-[var(--primary-teal)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })
              }
            </div>
   
            {/* Right Side Container */}
            <div className="flex items-center">
              {!isLoggedIn ? (
                /* Login and Mobile Menu for Home Page */
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <Link
                      to="/login"
                      className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-[var(--primary-teal)] text-[var(--light-bg)] shadow-sm hover:bg-[var(--primary-teal-hover)]`}
                    >
                      <span>Login / Sign Up</span>
                    </Link>
                  </div>
                  <div className="md:hidden">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-text-main)] hover:text-[var(--primary-teal)] hover:bg-[var(--accent-mint)] focus:outline-none"
                    >
                      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Logo for App (Logged In) */}
                  <Link to="/dashboard" className="flex items-center space-x-3 group">
                    <img
                      src={logoImg}
                      alt="Cloud Enthusiasts"
                      className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="font-extrabold text-xl tracking-tight text-[var(--color-text-main)] font-display hidden sm:inline-block">
                      Cloud<span className="text-[var(--primary-teal)]"> Enthusiasts</span>
                    </span>
                  </Link>
                  {/* Notification Button */}
                  <Link
                    to="/notifications"
                    className="p-2 rounded-full text-[var(--primary-teal)] bg-[var(--accent-mint)] transition-all duration-300 hover:scale-110 hover:shadow-md relative group"
                    title="Notifications"
                  >
                    <Bell className="w-[22px] h-[22px] group-hover:rotate-12 transition-transform duration-300" strokeWidth={2} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
   
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] px-2 pt-2 pb-3 space-y-1 sm:px-3 animate-fadeIn">
            {(isLoggedIn ? appNavItems : landingNavItems).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path, item.id)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 text-[var(--color-text-main)] hover:bg-[var(--accent-mint)] hover:text-[var(--primary-teal)]`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    setIsOpen(false);
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-300 text-left cursor-pointer"
                >
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 bg-[var(--primary-teal)] text-[var(--light-bg)] shadow-sm hover:bg-[var(--primary-teal-hover)]`}
              >
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
