import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, ArrowRight, User } from 'lucide-react';

export default function TicketCard({ ticket }) {
  const { ticketId, regId, eventId, eventTitle, date, time, name } = ticket;

  return (
    <div className="relative bg-[#F7F7F5] border border-[#005E63]/10 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-0.5 overflow-hidden">
      {/* Left/Right Ticket Cutouts (Notches) */}
      <div className="absolute left-0 top-[68%] -translate-y-1/2 -ml-3.5 w-7 h-7 rounded-full bg-[#F7F3EB] border border-[#005E63]/10 z-10 shadow-inner" />
      <div className="absolute right-0 top-[68%] -translate-y-1/2 -mr-3.5 w-7 h-7 rounded-full bg-[#F7F3EB] border border-[#005E63]/10 z-10 shadow-inner" />

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="bg-[#BFE3DE]/40 p-2.5 rounded-xl text-[#005E63]">
            <Ticket className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold bg-[#005E63]/10 text-[#005E63] px-3 py-1 rounded-full">
            #{regId || ticketId.substring(0, 8).toUpperCase()}
          </span>
        </div>

        <h3 className="font-extrabold text-lg text-[#2F3437] line-clamp-1 mb-3">
          {eventTitle}
        </h3>

        <div className="space-y-2 mb-4 text-sm text-[#2F3437]/75">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-[#005E63]" />
            <span className="font-semibold text-[#2F3437]">{name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#005E63]" />
            <span>{date} at {time}</span>
          </div>
        </div>
      </div>

      {/* Perforated tear line */}
      <div className="border-t-2 border-dashed border-[#005E63]/15 my-4 mx-[-20px] relative z-0" />

      <Link
        to={`/tickets/${ticketId}`}
        className="w-full flex items-center justify-center space-x-1.5 bg-[#005E63] hover:bg-[#004F54] text-white font-extrabold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <span>View Full Ticket</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
