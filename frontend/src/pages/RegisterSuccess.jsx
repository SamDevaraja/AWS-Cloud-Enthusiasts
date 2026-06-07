import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Printer, ArrowRight, Calendar, MapPin, Clock, Ticket, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function RegisterSuccess() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/tickets/${ticketId}`);
      if (response.data && response.data.success) {
        setTicket(response.data.data);
      } else {
        setError('Failed to fetch ticket confirmation details.');
      }
    } catch (err) {
      console.error('Success page load error:', err);
      setError('Error fetching ticket data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#2F3437]/60">Generating your QR Ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto my-20 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-extrabold text-xl mb-2">Verification Failed</h3>
        <p className="text-sm text-red-700/80 mb-6">{error || 'Unable to retrieve ticket verification details.'}</p>
        <Link to="/events" className="bg-red-800 hover:bg-red-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F3EB]/15 min-h-screen py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-xl mx-auto print:max-w-full">
        
        {/* Success Header Banner */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center justify-center bg-green-100 text-green-700 p-3.5 rounded-full mb-4 ring-8 ring-green-100/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-extrabold text-3xl text-[#2F3437] font-display">
            Registration Successful!
          </h1>
          <p className="text-[#2F3437]/70 mt-1.5 text-sm">
            Your seat is reserved. A dynamic QR code has been generated.
          </p>
        </div>

        {/* Ticket Boarding Pass Card */}
        <div className="ticket-container rounded-3xl overflow-hidden shadow-xl border border-[#005E63]/15 bg-[#F7F7F5] relative print:border-0 print:shadow-none">
          {/* Header */}
          <div className="bg-[#085C65] text-white p-6 text-center print:bg-[#085C65] print:text-white">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-white">
              Club Event Entry Ticket
            </span>
            <h2 className="font-extrabold text-xl sm:text-2xl mt-1 font-display line-clamp-1 text-white">
              {ticket.eventTitle}
            </h2>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[#005E63]/70 font-bold uppercase tracking-wider">Participant</p>
                <p className="font-extrabold text-sm text-[#2F3437] mt-0.5">{ticket.name}</p>
              </div>
              <div>
                <p className="text-[#005E63]/70 font-bold uppercase tracking-wider">Roll / Reg Number</p>
                <p className="font-extrabold text-sm text-[#2F3437] mt-0.5">{ticket.registerNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#005E63]/70 font-bold uppercase tracking-wider">Email Address</p>
                <p className="font-extrabold text-sm text-[#2F3437] mt-0.5">{ticket.email}</p>
              </div>
            </div>

            {/* Dash Tear line */}
            <div className="relative border-t-2 border-dashed border-[#005E63]/25 my-2">
              <div className="ticket-cutout-left" />
              <div className="ticket-cutout-right" />
            </div>

            {/* QR Code and Meta */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <div className="space-y-3.5 text-xs text-[#2F3437]/85">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#005E63] shrink-0" />
                  <span>{ticket.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#005E63] shrink-0" />
                  <span>{ticket.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#005E63] shrink-0" />
                  <span className="truncate max-w-[200px]">{ticket.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ticket className="w-4 h-4 text-[#005E63] shrink-0" />
                  <span className="font-mono bg-[#2F3437]/5 px-2 py-0.5 rounded text-[10px]">
                    ID: {ticket.regId}
                  </span>
                </div>
              </div>

              {/* QR Image */}
              <div className="bg-white p-3 border border-[#005E63]/10 rounded-2xl shadow-sm text-center">
                <img
                  src={ticket.qrCodeUrl}
                  alt="Ticket QR Code"
                  className="w-32 h-32 object-contain mx-auto"
                />
                <span className="inline-block mt-1 text-[8px] font-mono text-[#2F3437]/50 tracking-widest uppercase">
                  Scan for Attendance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 border border-[#005E63] text-[#005E63] hover:bg-[#BFE3DE]/30 font-bold py-3 px-5 rounded-2xl transition-all duration-300"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket pass</span>
          </button>
          
          <Link
            to="/my-tickets"
            className="flex items-center justify-center space-x-2 bg-[#005E63] hover:bg-[#004F54] text-white font-extrabold py-3 px-6 rounded-2xl transition shadow-md hover:shadow-lg"
          >
            <span>Go to My Tickets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
