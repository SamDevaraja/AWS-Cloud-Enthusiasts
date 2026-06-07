import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Award, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  ChevronRight,
  Plus,
  Trophy,
  Medal,
  Mic,
  Laptop,
  Lock,
  Megaphone,
  BookOpen,
  Zap,
  Link2
} from 'lucide-react';
import api from '../utils/api';

export default function Dashboard() {
  const userName = localStorage.getItem('userName') || 'John';
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.get('/events/live');
        if (response.data && response.data.success) {
          // Filter out completed/ended events
          const liveEvents = response.data.data.events.filter(
            event => event.status?.toUpperCase() !== 'COMPLETED' && event.status?.toUpperCase() !== 'ENDED'
          );
          // Get up to 3 upcoming events
          setUpcomingEvents(liveEvents.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching dashboard events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#005E63] to-[#04474B] rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-[60px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight mb-3 text-white">
            Good morning, {userName}! 🚀
          </h1>
          <p className="text-[#BFE3DE] text-sm md:text-base max-w-xl mb-8 leading-relaxed">
            You're on track. Complete your Solutions Architect course this week and climb the leaderboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/aws-services" className="bg-white text-[#005E63] hover:bg-[#F7F7F5] font-bold py-2.5 px-6 rounded-full inline-flex items-center space-x-2 transition-all shadow-md">
              <span>Explore AWS</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/events" className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-full transition-all border border-white/20">
              View Events
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Points */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB] relative overflow-hidden flex flex-col justify-between h-40 group">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#FFF9F0] text-[#D97706] flex items-center justify-center mb-4">
              <Trophy className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-extrabold text-[#2F3437] font-display">1,920</h3>
          </div>
          <div>
            <p className="text-sm font-bold text-[#2F3437]">Points</p>
            <p className="text-xs text-[#8A95A5] font-medium mt-0.5">Top 15% this month</p>
          </div>
        </div>

        {/* Card 2: Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB] relative overflow-hidden flex flex-col justify-between h-40 group">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mb-4">
              <Zap className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-extrabold text-[#2F3437] font-display">4</h3>
          </div>
          <div>
            <p className="text-sm font-bold text-[#2F3437]">Day Streak</p>
            <p className="text-xs text-[#8A95A5] font-medium mt-0.5">Keep building!</p>
          </div>
        </div>

        {/* Card 3: Events Attended */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB] relative overflow-hidden flex flex-col justify-between h-40 group">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#FAF9FD] text-[#6D28D9] flex items-center justify-center mb-4">
              <CalendarIcon className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-extrabold text-[#2F3437] font-display">8</h3>
          </div>
          <div>
            <p className="text-sm font-bold text-[#2F3437]">Events Attended</p>
            <p className="text-xs text-[#8A95A5] font-medium mt-0.5">3 upcoming</p>
          </div>
        </div>

        {/* Card 4: Build ID */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBEBEB] relative overflow-hidden flex flex-col justify-between h-40 group">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center mb-4">
              <Link2 className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-extrabold text-[#2F3437] font-display text-lg mt-1">Connected</h3>
          </div>
          <div>
            <p className="text-sm font-bold text-[#2F3437]">Build ID</p>
            <p className="text-xs text-[#8A95A5] font-medium mt-0.5">Verified</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Events (Left) & Leaderboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
        
        {/* Left Column: Upcoming Events */}
        <div className="lg:col-span-2">

        {/* Upcoming Events Featured Layout */}
        {loadingEvents ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EBEBEB] text-center py-6 text-[#8A95A5] text-sm">
            Loading events...
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EBEBEB] text-center py-6 text-[#8A95A5] text-sm">
            No upcoming events found.
          </div>
        ) : (
          upcomingEvents.map((event, index) => {
            const isImage = event.bannerBg && (
              event.bannerBg.startsWith('http') || 
              event.bannerBg.startsWith('/') || 
              event.bannerBg.startsWith('data:') || 
              event.bannerBg.includes('.')
            );

            return (
              <div key={event.id || index} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EBEBEB] flex flex-col md:flex-row group">
                {/* Image Section */}
                <div className="w-full md:w-1/2 lg:w-5/12 relative">
                  {isImage ? (
                    <img 
                      src={event.bannerBg} 
                      alt={event.title} 
                      className="w-full h-full object-cover min-h-[250px] group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div 
                      className="w-full h-full min-h-[250px] group-hover:opacity-95 transition-opacity duration-300"
                      style={{ background: event.bannerBg || 'linear-gradient(to right, #005E63, #04474B)' }}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#005E63] font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                    {event.category || 'Community Day'}
                  </span>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 lg:w-7/12 p-6 md:p-10 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#2F3437] font-display mb-3 group-hover:text-[#005E63] transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-[#2F3437]/75 text-sm md:text-base leading-relaxed mb-8 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div>
                      <p className="text-[#005E63] text-[10px] font-bold tracking-widest uppercase mb-1">Date</p>
                      <p className="text-[#2F3437] text-sm md:text-base font-bold">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#005E63] text-[10px] font-bold tracking-widest uppercase mb-1">Time</p>
                      <p className="text-[#2F3437] text-sm md:text-base font-bold">{event.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[#005E63] text-[10px] font-bold tracking-widest uppercase mb-1">Venue</p>
                      <p className="text-[#2F3437] text-sm md:text-base font-bold">{event.venue}</p>
                    </div>
                  </div>

                  <div>
                    <Link to={`/events/${event.id}`} className="bg-[#005E63] hover:bg-[#004F54] text-white font-bold py-3.5 px-8 rounded-xl transition-all inline-block text-center w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      Get Pass & Register
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}

        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-1">
        
        {/* Leaderboard */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EBEBEB]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#2F3437] font-display flex items-center">
              <Trophy className="w-5 h-5 text-[#D97706] mr-2" /> Leaderboard
            </h2>
            <span className="bg-[#E8F3F1] text-[#005E63] text-[10px] font-bold px-2.5 py-1 rounded-full">Quiz Arena</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-[#D97706]" />
                <span className="font-bold text-[#2F3437] text-sm">Arjun M.</span>
              </div>
              <span className="font-extrabold text-[#D97706] text-sm">2,840 pts</span>
            </div>
            
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-[#9CA3AF]" />
                <span className="font-bold text-[#2F3437] text-sm">Priya K.</span>
              </div>
              <span className="font-extrabold text-[#005E63] text-sm">2,650 pts</span>
            </div>

            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-3">
                <Medal className="w-5 h-5 text-[#B45309]" />
                <span className="font-bold text-[#2F3437] text-sm">Sneha R.</span>
              </div>
              <span className="font-extrabold text-[#D97706] text-sm">2,410 pts</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#F0F7F6] rounded-xl border border-[#BFE3DE]">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-[#D97706] text-white rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold">⭐</span>
                </div>
                <span className="font-bold text-[#005E63] text-sm">You &larr; You</span>
              </div>
              <span className="font-extrabold text-[#005E63] text-sm">1,920 pts</span>
            </div>

            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-3">
                <span className="w-5 font-bold text-[#8A95A5] text-xs text-center">#5</span>
                <span className="font-bold text-[#2F3437] text-sm">Rahul S.</span>
              </div>
              <span className="font-extrabold text-[#8A95A5] text-sm">1,740 pts</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
