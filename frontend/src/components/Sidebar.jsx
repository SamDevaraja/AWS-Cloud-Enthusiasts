import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, Ticket, Layers, LogOut, Award, MessageCircle, Newspaper, Map, Server } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/events' && location.pathname.startsWith('/events')) return true;
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Events', path: '/events', icon: Layers },
    { name: 'My Tickets', path: '/my-tickets', icon: Ticket },
    { name: 'Certifications', path: '/certifications', icon: Award },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Newsbot', path: '/newsbot', icon: Newspaper },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'AWS Services', path: '/aws-services', icon: Server },
  ];

  return (
    <aside className="w-64 bg-[var(--primary-teal)] hidden md:flex flex-col flex-shrink-0 h-screen fixed left-0 top-0 z-[60] shadow-sm border-r border-[#004F54]">
      <Link to="/dashboard" className="h-16 px-5 border-b border-white/10 flex items-center space-x-3 hover:bg-white/5 transition-colors cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-white text-[var(--primary-teal)] flex items-center justify-center text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
          {localStorage.getItem('userName') ? localStorage.getItem('userName')[0].toUpperCase() : 'U'}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-white truncate max-w-[140px] group-hover:text-[var(--accent-mint)] transition-colors">
            {localStorage.getItem('userName') || 'User'}
          </span>
          <span className="text-xs text-[var(--accent-mint)] font-medium">Cloud Builder</span>
        </div>
      </Link>
      <div className="p-4 flex-1 mt-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'bg-white text-[var(--primary-teal)] shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/';
          }}
          className="flex w-full items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-extrabold text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white transition-all duration-300 border border-transparent"
        >
          <LogOut className="w-4 h-4" strokeWidth={2.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
