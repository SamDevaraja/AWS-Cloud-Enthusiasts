import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Clock, MapPin, Compass, 
  ArrowRight, Sparkles, RefreshCw, AlertCircle 
} from 'lucide-react';
import api from '../utils/api';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calendar navigation states
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lock outer scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/events/live');
      if (response.data && response.data.success) {
        setEvents(response.data.data.events || []);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load events. Please check database connection.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Build calendar grid days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Match events to days
  const getEventsForDay = (dayNum) => {
    return events.filter(event => {
      try {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year &&
               eventDate.getMonth() === month &&
               eventDate.getDate() === dayNum;
      } catch (err) {
        return false;
      }
    });
  };

  // Generate calendar cells (blank paddings + actual days)
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-0 bg-[#F7F7F5]/20 border border-[#005E63]/5" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year;

    cells.push(
      <div 
        key={`day-${day}`} 
        className={`min-h-0 p-1.5 sm:p-2 border border-[#005E63]/10 bg-white flex flex-col transition-all hover:bg-[#BFE3DE]/10 ${
          isToday ? 'ring-2 ring-inset ring-[#E4BC63]' : ''
        }`}
      >
        <span className={`text-[10px] sm:text-xs font-bold ${isToday ? 'bg-[#E4BC63] text-[#2F3437] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center' : 'text-[#2F3437]/50'}`}>
          {day}
        </span>
        
        {/* Events listing inside day cell */}
        <div className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-0.5 sm:pr-1 scrollbar-none sm:scrollbar-thin mt-1">
          {dayEvents.map(event => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block text-[8px] font-bold bg-[#005E63] text-white truncate px-1 py-0.5 rounded hover:bg-[#004F54] transition-colors text-center sm:text-left"
              title={event.title}
            >
              {/* Show text on sm devices, and centered dot icon on mobile */}
              <span className="hidden sm:inline">{event.title}</span>
              <span className="inline-block sm:hidden w-1.5 h-1.5 rounded-full bg-white" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Next month blank paddings to fill grid row
  const totalCells = cells.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 0; i < remainingCells; i++) {
    cells.push(<div key={`empty-end-${i}`} className="min-h-0 bg-[#F7F7F5]/20 border border-[#005E63]/5" />);
  }

  // Upcoming events sorted chronologically
  const upcomingTimeline = events
    .filter(e => e.status === 'Upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-112px)] md:h-[calc(100vh-128px)] overflow-hidden font-sans">
        
        {/* Header */}
        <div className="mb-6 shrink-0">
          <h1 className="font-bold text-2xl sm:text-3xl text-[#2F3437] font-display">
            Event Calendar & Timeline
          </h1>
          <p className="text-sm text-[#2F3437]/70 mt-1.5 max-w-xl">
            Visually track workshop schedules, verify dates, and plan your learning path.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin mb-4" />
            <p className="text-sm font-semibold text-[#2F3437]/60">Loading schedules...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Load Failed</h3>
            <p className="text-sm text-red-700/80 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="bg-red-800 hover:bg-red-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 flex-1 min-h-0 overflow-hidden">
            
            {/* Interactive Grid Calendar */}
            <div className="lg:col-span-8 bg-[#F7F7F5] rounded-3xl p-4 md:p-6 shadow-md border border-[#005E63]/5 flex flex-col min-h-0 h-full overflow-hidden">
              {/* Calendar Month Header */}
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="font-extrabold text-xl text-[#2F3437]">
                  {monthNames[month]} <span className="text-[#005E63] font-black">{year}</span>
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 border border-[#005E63]/10 hover:bg-[#BFE3DE]/30 rounded-xl transition text-[#005E63]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 border border-[#005E63]/10 hover:bg-[#BFE3DE]/30 rounded-xl transition text-[#005E63]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Names Header */}
              <div className="grid grid-cols-7 text-center font-bold text-xs text-[#2F3437]/50 uppercase tracking-widest border-b border-[#005E63]/10 pb-3 mb-2">
                {weekdayNames.map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Calendar Cells */}
              <div className="grid grid-cols-7 auto-rows-fr border-l border-t border-[#005E63]/10 rounded-xl overflow-hidden shadow-inner flex-1 bg-white">
                {cells}
              </div>
            </div>

            {/* Timeline sidebar */}
            <div className="lg:col-span-4 bg-[#F7F7F5] rounded-3xl p-4 md:p-6 shadow-md border border-[#005E63]/5 flex flex-col min-h-0 h-full overflow-hidden">
              <h3 className="font-extrabold text-lg text-[#2F3437] mb-4 shrink-0 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#005E63]" />
                <span>Upcoming Timeline</span>
              </h3>

              {upcomingTimeline.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#2F3437]/60">
                  No upcoming events scheduled.
                </div>
              ) : (
                <div className="relative border-l border-[#005E63]/25 pl-4 space-y-6 overflow-y-auto flex-1 pr-2">
                  {upcomingTimeline.map((event) => (
                    <div key={event.id} className="relative group">
                      {/* Node circle */}
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#005E63] border border-white ring-2 ring-[#BFE3DE]" />
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#005E63] uppercase bg-[#BFE3DE]/30 px-2.5 py-0.5 rounded-full">
                          {event.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#2F3437] group-hover:text-[#005E63] transition-colors">
                          <Link to={`/events/${event.id}`}>{event.title}</Link>
                        </h4>
                        
                        <div className="flex flex-col gap-1 text-[10px] text-[#2F3437]/65">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{event.venue}</span>
                          </div>
                        </div>

                        <Link
                          to={`/events/${event.id}`}
                          className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#005E63] hover:text-[#004F54] pt-1"
                        >
                          <span>Get Ticket</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

    </div>
  );
}
