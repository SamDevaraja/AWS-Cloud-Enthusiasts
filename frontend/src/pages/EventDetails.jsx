import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, ShieldAlert, ArrowLeft, CheckCircle, 
  Download, Archive, RotateCcw, ChevronDown, ChevronUp, Lock, RefreshCw, AlertCircle, FileSpreadsheet, FileText
} from 'lucide-react';
import api from '../utils/api';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Organizer Console States
  const [showConsole, setShowConsole] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [recentExport, setRecentExport] = useState(null); // { id, checksum, type }
  const [archiveStatus, setArchiveStatus] = useState(null); // 'idle', 'archived', 'error'
  const [archiveLogs, setArchiveLogs] = useState([]);
  const [rollbackStatus, setRollbackStatus] = useState(null);

  useEffect(() => {
    fetchEventDetails();
    fetchArchiveLogs();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/events/${eventId}`);
      if (response.data && response.data.success) {
        setEvent(response.data.data);
      } else {
        setError('Could not retrieve event details.');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchArchiveLogs = async () => {
    try {
      const res = await api.get('/events/archive/logs');
      if (res.data && res.data.success) {
        const logs = res.data.data.logs || [];
        // Filter logs belonging to this event
        setArchiveLogs(logs.filter(log => log.event_id === eventId));
      }
    } catch (err) {
      console.error('Error fetching archive logs:', err);
    }
  };

  // Modern Export Handler using Axios to capture headers for Archiving
  const handleExport = async (type, isExcel) => {
    try {
      setExportLoading(true);
      setRecentExport(null);
      
      const format = isExcel ? 'excel' : 'csv';
      const endpoint = `/events/${eventId}/export/${type}/${format}`;
      
      // Request file as binary blob
      const response = await api.get(endpoint, { responseType: 'blob' });
      
      // Retrieve integrity headers injected by the backend
      const exportLogId = response.headers['x-export-log-id'];
      const checksum = response.headers['x-export-log-checksum'];
      
      if (exportLogId && checksum) {
        setRecentExport({
          id: exportLogId,
          checksum: checksum,
          type: `${type.toUpperCase()} (${format.toUpperCase()})`
        });
      }

      // Trigger standard browser download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const extension = isExcel ? 'xlsx' : 'csv';
      link.setAttribute('download', `${type}_export_${eventId}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to download export file. Please check database logs.');
    } finally {
      setExportLoading(false);
    }
  };

  // Archive data handler (locks and soft-deletes active records)
  const handleArchive = async () => {
    if (!recentExport) {
      alert('Please download an export report first to verify the integrity checksum.');
      return;
    }

    if (!window.confirm('WARNING: Archiving will lock and hide all current registrations for this event. These records will be soft-deleted and moved to archival tables. Do you want to continue?')) {
      return;
    }

    try {
      setArchiveStatus('processing');
      const response = await api.post(`/events/${eventId}/export/confirm`, {
        exportLogId: recentExport.id
      });

      if (response.data && response.data.success) {
        setArchiveStatus('success');
        setRecentExport(null);
        fetchEventDetails(); // Refresh details (seats count, status)
        fetchArchiveLogs(); // Refresh logs
      } else {
        setArchiveStatus('error');
      }
    } catch (err) {
      console.error('Archive error:', err);
      setArchiveStatus('error');
      alert(err.response?.data?.message || 'Archiving failed.');
    }
  };

  // Rollback archiving operations
  const handleRollback = async (archiveLogId) => {
    if (!window.confirm('Are you sure you want to rollback this archive log? This will restore registrations to active status.')) {
      return;
    }

    try {
      setRollbackStatus('processing');
      const response = await api.post(`/events/${eventId}/archive/rollback`, {
        archiveLogId
      });

      if (response.data && response.data.success) {
        alert('Rollback completed successfully! All data has been restored to active status.');
        fetchEventDetails();
        fetchArchiveLogs();
      } else {
        alert('Rollback failed.');
      }
    } catch (err) {
      console.error('Rollback error:', err);
      alert(err.response?.data?.message || 'Rollback failed.');
    } finally {
      setRollbackStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <RefreshCw className="w-10 h-10 text-[#005E63] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#2F3437]/60">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto my-20 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-center shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-extrabold text-xl mb-2">Event Not Found</h3>
        <p className="text-sm text-red-700/80 mb-6">{error || 'The event you are looking for has been archived or does not exist.'}</p>
        <Link to="/events" className="inline-flex items-center space-x-1 bg-red-800 hover:bg-red-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  const seatsLeft = Math.max(0, event.capacity - event.registered);
  const isFull = seatsLeft === 0;

  return (
    <div className="bg-[#F7F3EB]/15 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link to="/events" className="inline-flex items-center space-x-2 text-[#005E63] hover:text-[#004F54] font-semibold mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        {/* Hero Section Card */}
        <div className="bg-[#F7F7F5] rounded-3xl overflow-hidden shadow-lg border border-[#005E63]/5 mb-8">
          {/* Banner Graphic */}
          <div className="h-64 sm:h-80 w-full relative">
            {event.bannerBg && (
              event.bannerBg.startsWith('http') || 
              event.bannerBg.startsWith('/') || 
              event.bannerBg.startsWith('data:') || 
              event.bannerBg.includes('.')
            ) ? (
              <img
                src={event.bannerBg}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div style={{ background: event.bannerBg }} className="w-full h-full relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block bg-[#005E63] text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-3 shadow-md">
                {event.category}
              </span>
              <h1 className="font-extrabold text-3xl sm:text-4xl text-white leading-tight font-display shadow-sm">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Event Quick Details Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#005E63]/10 bg-[#BFE3DE]/20 divide-x divide-[#005E63]/10 text-center py-5">
            <div className="p-2">
              <Calendar className="w-5 h-5 text-[#005E63] mx-auto mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-[#2F3437]/60 font-bold">Date</p>
              <p className="text-sm font-bold text-[#2F3437]">{event.date}</p>
            </div>
            <div className="p-2">
              <Clock className="w-5 h-5 text-[#005E63] mx-auto mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-[#2F3437]/60 font-bold">Time</p>
              <p className="text-sm font-bold text-[#2F3437]">{event.time}</p>
            </div>
            <div className="p-2">
              <MapPin className="w-5 h-5 text-[#005E63] mx-auto mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-[#2F3437]/60 font-bold">Venue</p>
              <p className="text-sm font-bold text-[#2F3437] truncate px-2">{event.venue}</p>
            </div>
            <div className="p-2">
              <Users className="w-5 h-5 text-[#005E63] mx-auto mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-[#2F3437]/60 font-bold">Status</p>
              <p className="text-sm font-bold text-[#2F3437]">{event.status}</p>
            </div>
          </div>
        </div>

        {/* Content Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div className="bg-[#F7F7F5] rounded-3xl p-8 border border-[#005E63]/5 shadow-sm">
              <h2 className="font-extrabold text-xl text-[#2F3437] mb-4 font-display">About the Event</h2>
              <p className="text-sm leading-relaxed text-[#2F3437]/80 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-[#F7F7F5] rounded-3xl p-8 border border-[#005E63]/5 shadow-sm">
                <h2 className="font-extrabold text-xl text-[#2F3437] mb-6 font-display">Event Agenda</h2>
                <div className="relative border-l border-[#005E63]/20 pl-6 space-y-6">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#005E63] border-2 border-white ring-4 ring-[#BFE3DE]/40" />
                      <p className="text-sm font-semibold text-[#2F3437]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registration Widget Column */}
          <div className="lg:col-span-4">
            <div className="bg-[#F7F7F5] border-2 border-[#005E63]/20 rounded-3xl p-6 shadow-md sticky top-24">
              <h3 className="font-extrabold text-lg text-[#2F3437] mb-4 border-b border-[#005E63]/10 pb-3">
                Registration Status
              </h3>
              
              <div className="space-y-4 mb-6 text-sm text-[#2F3437]/80">
                <div className="flex justify-between items-center bg-[#BFE3DE]/10 p-3 rounded-xl">
                  <span>Seats Available:</span>
                  {isFull ? (
                    <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Fully Booked</span>
                  ) : (
                    <span className="font-extrabold text-[#005E63] text-base">{seatsLeft} / {event.capacity}</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span>Speaker Host:</span>
                  <span className="font-semibold text-right">{event.speaker || 'Club Speaker'}</span>
                </div>
              </div>

              {isFull ? (
                <button
                  disabled
                  className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-2xl cursor-not-allowed border border-red-500/25"
                >
                  Sold Out
                </button>
              ) : event.status === 'Completed' ? (
                <button
                  disabled
                  className="w-full bg-red-200 text-red-700 font-bold py-3 rounded-2xl cursor-not-allowed"
                >
                  Event Ended
                </button>
              ) : (
                <Link
                  to={`/events/${eventId}/register`}
                  className="block w-full text-center bg-[#005E63] hover:bg-[#004F54] text-white font-extrabold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-[0.98]"
                >
                  Register Now
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
