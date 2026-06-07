import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Compass, Search, Filter, RefreshCw, AlertCircle, Users } from 'lucide-react';
import api from '../utils/api';
import EventCard from '../components/EventCard';

export default function Events() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All', 'Available', 'Full'

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
      console.error('Error fetching live events:', err);
      setError('Failed to load events. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && location.hash) {
      // Small delay to allow rendering
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight animation class dynamically
          element.classList.add('ring-4', 'ring-[#6FB6B3]', 'ring-offset-4', 'scale-[1.02]', 'transition-all', 'duration-500');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-[#6FB6B3]', 'ring-offset-4', 'scale-[1.02]');
          }, 2000);
        }
      }, 100);
    }
  }, [loading, location.hash]);

  const categories = ['All', 'Workshop', 'Bootcamp', 'AI/ML', 'DevOps', 'Analytics'];

  const filteredEvents = events.filter((event) => {
    const title = event.title || '';
    const description = event.description || '';
    const venue = event.venue || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          venue.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    
    const seatsLeft = event.capacity - event.registered;
    let matchesAvailability = true;
    if (availabilityFilter === 'Available') {
      matchesAvailability = seatsLeft > 0;
    } else if (availabilityFilter === 'Full') {
      matchesAvailability = seatsLeft <= 0;
    }

    return matchesSearch && matchesCategory && matchesAvailability;
  }).sort((a, b) => {
    const getStatusWeight = (status) => {
      if (status === 'Ongoing') return 1;
      if (status === 'Upcoming') return 2;
      if (status === 'Ended') return 3;
      return 4;
    };
    return getStatusWeight(a.status) - getStatusWeight(b.status);
  });

  return (
    <div className="bg-[#F7F3EB]/20 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-bold text-2xl sm:text-3xl text-[#2F3437] mb-2 font-display">
            Cloud Events & Workshops
          </h1>
          <p className="text-[#2F3437]/75 max-w-xl text-xs sm:text-sm">
            Browse through active cloud bootcamps, security workshops, and expert sessions. Reserve your seat instantly.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="mb-10 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#005E63]">
                <Search className="h-5 w-5 shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Search by name, description, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-[#005E63]/10 bg-white rounded-2xl text-[#2F3437] placeholder-[#2F3437]/40 focus:outline-none focus:ring-2 focus:ring-[#005E63] focus:border-transparent text-sm transition-all duration-300 hover:border-[#005E63]/30"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#005E63]">
                <Filter className="h-4 w-4 shrink-0" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-11 pr-10 py-3 border border-[#005E63]/10 bg-white rounded-2xl text-[#2F3437] focus:outline-none focus:ring-2 focus:ring-[#005E63] focus:border-transparent text-sm appearance-none transition-all duration-300 hover:border-[#005E63]/30 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {/* Custom Chevron Down */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#2F3437]/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#005E63]">
                <Users className="h-4 w-4 shrink-0" />
              </div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="block w-full pl-11 pr-10 py-3 border border-[#005E63]/10 bg-white rounded-2xl text-[#2F3437] focus:outline-none focus:ring-2 focus:ring-[#005E63] focus:border-transparent text-sm appearance-none transition-all duration-300 hover:border-[#005E63]/30 cursor-pointer"
              >
                <option value="All">All Seats Status</option>
                <option value="Available">Seats Available</option>
                <option value="Full">Fully Booked / Sold Out</option>
              </select>
              {/* Custom Chevron Down */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#2F3437]/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin mb-4" />
            <p className="text-sm font-semibold text-[#2F3437]/60">Retrieving active events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Retrieval Failed</h3>
            <p className="text-sm text-red-700/80 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="bg-red-800 hover:bg-red-900 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
            >
              Retry Load
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-24 bg-white/40 border-2 border-dashed border-[#005E63]/10 rounded-[32px] p-8 max-w-xl mx-auto flex flex-col items-center justify-center">
            <div className="bg-[#E1F1F0]/70 w-16 h-16 rounded-full flex items-center justify-center mb-5">
              <Compass className="w-8 h-8 text-[#005E63]" strokeWidth={2} />
            </div>
            <h3 className="font-bold text-2xl text-[#2F3437] mb-3 font-display">No Matching Events</h3>
            <p className="text-sm text-[#2F3437]/70 mb-8 max-w-sm leading-relaxed">
              We couldn't find any events matching your search criteria. Try modifying your filters or view other categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
                setAvailabilityFilter('All');
              }}
              className="bg-transparent border-2 border-[#005E63]/20 text-[#005E63] hover:bg-[#E1F1F0] hover:border-[#E1F1F0] text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} id={`event-${event.id}`} className="rounded-2xl transition-all duration-500">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
