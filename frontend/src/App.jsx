import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthenticatedLayout from './components/AuthenticatedLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import Calendar from './pages/Calendar';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import Certifications from './pages/Certifications';
import Chat from './pages/Chat';
import ComingSoon from './pages/ComingSoon';
import Notifications from './pages/Notifications';
import Newsbot from './pages/Newsbot';
import AWSServices from './pages/AWSServices';

// Route Guard Component
function AuthGuard({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to login page, preserving the requested path as query param
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F7F3EB]/10">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Authenticated Routes wrapped in AuthenticatedLayout */}
            <Route path="/dashboard" element={<AuthGuard><AuthenticatedLayout><Dashboard /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/events" element={<AuthGuard><AuthenticatedLayout><Events /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/events/:eventId" element={<AuthGuard><AuthenticatedLayout><EventDetails /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/events/:eventId/register" element={<AuthGuard><AuthenticatedLayout><Register /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/registration-success/:ticketId" element={<AuthGuard><AuthenticatedLayout><RegisterSuccess /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/my-tickets" element={<AuthGuard><AuthenticatedLayout><MyTickets /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/tickets/:ticketId" element={<AuthGuard><AuthenticatedLayout><TicketDetails /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/calendar" element={<AuthGuard><AuthenticatedLayout><Calendar /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/certifications" element={<AuthGuard><AuthenticatedLayout><Certifications /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/chat" element={<AuthGuard><AuthenticatedLayout><Chat /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/newsbot" element={<AuthGuard><AuthenticatedLayout><Newsbot /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/roadmap" element={<AuthGuard><AuthenticatedLayout><ComingSoon title="Roadmap" /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/notifications" element={<AuthGuard><AuthenticatedLayout><Notifications /></AuthenticatedLayout></AuthGuard>} />
            <Route path="/aws-services" element={<AuthGuard><AuthenticatedLayout><AWSServices /></AuthenticatedLayout></AuthGuard>} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
