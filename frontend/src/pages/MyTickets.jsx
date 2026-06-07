import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, Inbox } from 'lucide-react';
import TicketCard from '../components/TicketCard';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTickets = JSON.parse(localStorage.getItem('cloud_enthusiasts_tickets') || '[]');
    setTickets(savedTickets);
  }, []);

  const filteredTickets = tickets.filter(t => 
    t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.regId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F7F3EB]/15 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 text-center flex flex-col items-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-[#005E63] font-display mb-3">
            My Registered Tickets
          </h1>
          <p className="text-[15px] text-[#2F3437]/80 max-w-2xl mx-auto">
            View generated seat passes, display check-in QR codes, and verify attendance logs.
          </p>
        </div>

        {tickets.length > 0 && (
          /* Search Filter */
          <div className="relative max-w-md mx-auto mb-10">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2F3437]/45">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by event title or registration ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 border border-[#005E63]/10 bg-[#F7F7F5] rounded-xl text-[#2F3437] placeholder-[#2F3437]/45 focus:outline-none focus:ring-2 focus:ring-[#005E63] text-sm shadow-sm transition-all"
            />
          </div>
        )}

        {/* Tickets Listing */}
        {tickets.length === 0 ? (
          <div className="py-16 bg-[#F7F7F5] border border-[#005E63]/5 rounded-3xl p-8 max-w-xl mx-auto shadow-sm text-center">
            <Inbox className="w-12 h-12 text-[#6FB6B3] mb-4" />
            <h3 className="font-extrabold text-xl text-[#2F3437] mb-2">No Tickets Found</h3>
            <p className="text-[#2F3437]/75 text-sm mb-8">
              You haven't registered for any events yet. Check out our upcoming calendar to secure your seat.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-1.5 bg-[#005E63] hover:bg-[#004F54] text-white font-bold text-sm px-6 py-3 rounded-2xl transition shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Active Events</span>
            </Link>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-10 bg-[#F7F7F5] rounded-2xl p-6">
            <p className="text-sm text-[#2F3437]/60 font-semibold">No tickets match your search.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-start gap-6 max-w-5xl mx-auto">
            {filteredTickets.map((ticket, index) => (
              <div key={index} className="w-full max-w-[340px]">
                <TicketCard ticket={ticket} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
