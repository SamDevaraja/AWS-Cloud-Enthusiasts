import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';

export default function EventCard({ event }) {
  const {
    id,
    title,
    description,
    date,
    time,
    venue,
    capacity,
    registered,
    category,
    bannerBg,
    status
  } = event;

  const seatsLeft = Math.max(0, capacity - registered);
  const isFull = seatsLeft === 0;

  // Render direct image URL or fallback to gradient
  const renderBanner = () => {
    const isImage = bannerBg && (
      bannerBg.startsWith('http') || 
      bannerBg.startsWith('/') || 
      bannerBg.startsWith('data:') || 
      bannerBg.includes('.')
    );

    if (isImage) {
      return (
        <div className="h-48 w-full overflow-hidden relative">
          <img
            src={bannerBg}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      );
    }
    
    return (
      <div 
        style={{ background: bannerBg }} 
        className="h-48 w-full relative overflow-hidden group-hover:opacity-95 transition-opacity duration-300"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    );
  };

  const isEnded = status?.toUpperCase() === 'COMPLETED';

  return (
    <div className={`group glass-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-[#005E63]/5 transform hover:-translate-y-1 ${isEnded ? 'grayscale-[0.8] opacity-80' : ''}`}>
      {/* Event Image / Gradient Banner */}
      <div className="relative">
        {renderBanner()}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#005E63] font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
          {category}
        </span>
        {status?.toUpperCase() === 'COMPLETED' ? (
          <span className="absolute top-4 right-4 bg-[#7D6A8F] text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
            Event Ended
          </span>
        ) : isFull ? (
          <span className="absolute top-4 right-4 bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
            Sold Out
          </span>
        ) : (
          <span className="absolute top-4 right-4 bg-[#E4BC63] text-[#2F3437] font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
            {seatsLeft} Seats Left
          </span>
        )}
      </div>

      {/* Card Info */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-xl text-[#2F3437] line-clamp-1 mb-2 group-hover:text-[#005E63] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-[#2F3437]/75 line-clamp-2 mb-6">
            {description}
          </p>

          <div className="space-y-2.5 mb-6 text-sm text-[#2F3437]/80">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#005E63] shrink-0" />
              <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#005E63] shrink-0" />
              <span>{time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#005E63] shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#005E63] shrink-0" />
              <span>{registered} / {capacity} Registered</span>
            </div>
          </div>
        </div>

        <div>
          <Link
            to={`/events/${id}`}
            className="w-full flex items-center justify-center space-x-1.5 bg-[#005E63] hover:bg-[#004F54] text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
