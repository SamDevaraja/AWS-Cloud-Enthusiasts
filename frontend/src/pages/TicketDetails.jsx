import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Ticket, User, Mail, GraduationCap,
  Printer, CheckCircle, RefreshCw, AlertCircle, ScanLine, XCircle 
} from 'lucide-react';
import api from '../utils/api';

export default function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Attendance actions states
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/tickets/${ticketId}`);
      if (response.data && response.data.success) {
        setTicket(response.data.data);
      } else {
        setError('Ticket not found.');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError(err.response?.data?.message || 'Failed to load ticket information.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCheckIn = async () => {
    try {
      setAttendanceLoading(true);
      const res = await api.post('/attendance/checkin', {
        ticketId: ticket.ticketId,
        eventId: ticket.eventId
      });
      if (res.data && res.data.success) {
        alert('Simulation Success: Participant checked in successfully!');
        fetchTicket(); // Refresh logs
      }
    } catch (err) {
      console.error('Check-in error:', err);
      alert(err.response?.data?.message || 'Check-in failed.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setAttendanceLoading(true);
      const res = await api.post('/attendance/checkout', {
        ticketId: ticket.ticketId,
        eventId: ticket.eventId
      });
      if (res.data && res.data.success) {
        alert('Simulation Success: Participant checked out successfully!');
        fetchTicket(); // Refresh logs
      }
    } catch (err) {
      console.error('Check-out error:', err);
      alert(err.response?.data?.message || 'Check-out failed.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#2F3437]/60">Retrieving event pass details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-xl mx-auto my-20 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-extrabold text-xl mb-2">Ticket Error</h3>
        <p className="text-sm text-red-700/80 mb-6">{error}</p>
        <Link to="/my-tickets" className="bg-red-800 hover:bg-red-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition">
          My Tickets
        </Link>
      </div>
    );
  }

  const statusLabel = () => {
    if (ticket.checkOutTime) {
      return (
        <span className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
          <XCircle className="w-3.5 h-3.5" />
          <span>Checked Out</span>
        </span>
      );
    }
    if (ticket.checkInTime) {
      return (
        <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 animate-pulse">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Checked In</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Pass Active</span>
      </span>
    );
  };

  return (
    <div className="bg-[#F7F3EB]/15 min-h-screen py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Link */}
        <Link to="/my-tickets" className="inline-flex items-center space-x-2 text-[#005E63] hover:text-[#004F54] font-semibold mb-6 print:hidden">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Tickets</span>
        </Link>

        {/* Ticket Boarding Pass Card */}
        <div className="ticket-container rounded-3xl overflow-hidden shadow-xl border border-[#005E63]/15 bg-[#F7F7F5] relative mb-8 print:border-0 print:shadow-none">
          
          {/* Header Accent */}
          <div className="bg-[#085C65] text-white p-6 relative">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-white">
                  Cloud Enthusiasts Ticket Pass
                </span>
                <h2 className="font-extrabold text-2xl mt-1 font-display line-clamp-1 text-white">
                  {ticket.eventTitle}
                </h2>
              </div>
              <div className="bg-white/20 p-2 rounded-xl">
                <Ticket className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-8 space-y-8">
            
            {/* Grid of participant info */}
            <div>
              <h3 className="text-xs font-bold text-[#005E63] uppercase tracking-wider mb-3">
                Participant Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-5 rounded-2xl border border-[#005E63]/5">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-[#005E63]/70 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-[#2F3437]/50 font-bold uppercase">Full Name</p>
                    <p className="text-sm font-extrabold text-[#2F3437] truncate">{ticket.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-[#005E63]/70 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-[#2F3437]/50 font-bold uppercase">Register Number</p>
                    <p className="text-sm font-extrabold text-[#2F3437] font-mono">{ticket.registerNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#005E63]/70 shrink-0" />
                  <div className="truncate">
                    <p className="text-[10px] text-[#2F3437]/50 font-bold uppercase">Email Address</p>
                    <p className="text-sm font-extrabold text-[#2F3437] truncate">{ticket.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dash Tear line Cutout */}
            <div className="relative border-t-2 border-dashed border-[#005E63]/20 my-2">
              <div className="ticket-cutout-left" />
              <div className="ticket-cutout-right" />
            </div>

            {/* QR Scanner visual layout */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Event Metadata */}
              <div className="space-y-4 text-sm text-[#2F3437]/80 w-full md:w-auto">
                <h3 className="text-xs font-bold text-[#005E63] uppercase tracking-wider mb-1">
                  Event Logistics
                </h3>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-[#005E63] shrink-0" />
                  <span>{ticket.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#005E63] shrink-0" />
                  <span>{ticket.time}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#005E63] shrink-0" />
                  <span className="truncate max-w-[240px]">{ticket.venue}</span>
                </div>
                
                {/* Attendance Status */}
                <div className="pt-2 flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#2F3437]/50">Status:</span>
                  {statusLabel()}
                </div>
              </div>

              {/* QR Image */}
              <div className="bg-white p-4 border-2 border-[#005E63]/10 rounded-3xl shadow-sm text-center shrink-0">
                <img
                  src={ticket.qrCodeUrl}
                  alt="Ticket QR Code"
                  className="w-36 h-36 object-contain mx-auto"
                />
                <p className="mt-2 text-[9px] font-mono text-[#2F3437]/40 tracking-wider uppercase font-semibold">
                  TICKET: {ticket.regId}
                </p>
              </div>

            </div>

            {/* Attendance logs timeline */}
            {(ticket.checkInTime || ticket.checkOutTime) && (
              <div className="border-t border-[#005E63]/10 pt-6">
                <h4 className="text-xs font-bold text-[#005E63] uppercase tracking-wider mb-3">
                  Attendance Logs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {ticket.checkInTime && (
                    <div className="bg-green-50/50 border border-green-200/50 p-3 rounded-xl">
                      <span className="font-bold text-green-700">Checked In:</span>
                      <p className="text-xs text-[#2F3437]/70 mt-0.5">{new Date(ticket.checkInTime).toLocaleString()}</p>
                    </div>
                  )}
                  {ticket.checkOutTime && (
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                      <span className="font-bold text-gray-700">Checked Out:</span>
                      <p className="text-xs text-[#2F3437]/70 mt-0.5">{new Date(ticket.checkOutTime).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 print:hidden">
          {/* Action links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center space-x-1 border border-[#005E63] text-[#005E63] hover:bg-[#BFE3DE]/30 font-bold py-3 px-6 rounded-2xl transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Ticket Pass</span>
            </button>
            
            <Link
              to="/my-tickets"
              className="flex items-center justify-center space-x-1 bg-[#005E63] hover:bg-[#004F54] text-white font-extrabold py-3 px-6 rounded-2xl transition shadow-md"
            >
              <span>Back to Tickets</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
