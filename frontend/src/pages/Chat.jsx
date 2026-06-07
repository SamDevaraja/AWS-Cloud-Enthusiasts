import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import api from '../utils/api';

const COLORS = {
  bg: "#E4D4C4",
  sidebar: "#005E63",
  sidebarDark: "#004F54",
  teal: "#6FB6B3",
  mint: "#BFE3DE",
  gold: "#E4BC63",
  text: "#2F3437",
  surface: "#F7F7F5",
  purple: "#7D6A8F",
};

const botResponses = [
  "Great question! The AWS Solutions Architect Associate is the most popular starting cert. It covers designing distributed systems and gives you a broad foundation across AWS services.",
  "For the Cloud Practitioner exam, I'd recommend 2-3 weeks of study with the official AWS training + practice exams. Focus on billing, support plans, and core services overview.",
  "The difference between Associate and Professional level is depth. Professional exams require you to design multi-account, multi-region architectures with complex trade-offs.",
  "AWS certifications are valid for 3 years. You can recertify by passing the same exam again or by passing a higher-level cert in the same track.",
  "For hands-on practice, use the AWS Free Tier! You get 12 months of limited free access to EC2, S3, Lambda, and many other services.",
  "The Security Specialty is increasingly valuable — organizations are prioritizing cloud security. It covers IAM, encryption, logging, and incident response on AWS.",
];

const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    mic: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
    code: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    database: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    bot: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  };
  return icons[name] || null;
};

// Using live events instead of mock announcements
const AnnouncementCard = ({ event }) => {
  // Determine an icon based on category or default
  const categoryIconMap = {
    'Workshop': 'mic',
    'Bootcamp': 'code',
    'AI/ML': 'database',
    'DevOps': 'shield',
    'Analytics': 'database'
  };
  const iconName = categoryIconMap[event.category] || 'calendar';

  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.mint}`,
        borderRadius: 16,
        padding: 16,
        animation: "slideUp 0.3s ease",
        boxShadow: "0 2px 0 rgba(0,94,99,0.10)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: `${COLORS.teal}20`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name={iconName} size={18} color={COLORS.sidebar} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: COLORS.sidebar, lineHeight: 1.3 }}>{event.title}</h4>
          <span style={{ fontSize: 9, color: COLORS.teal, fontWeight: 600 }}>Posted by Admin</span>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <span style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 99,
          background: `${COLORS.sidebar}12`, color: COLORS.sidebar, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <Icon name="calendar" size={10} color={COLORS.sidebar} />{new Date(event.date).toLocaleDateString()}
        </span>
        <span style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 99,
          background: `${COLORS.teal}20`, color: COLORS.sidebar, fontWeight: 600,
        }}>
          🕐 {event.time}
        </span>
        <span style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 99,
          background: `${COLORS.mint}40`, color: COLORS.sidebar, fontWeight: 600,
        }}>
          {event.category || 'Event'}
        </span>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>{event.description}</p>
      {event.status === 'Ended' || new Date(event.date) < new Date(new Date().setHours(0,0,0,0)) ? (
        <div
          className="flex items-center justify-center gap-1"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#E5E7EB", color: "#9CA3AF",
            borderRadius: 10, padding: "8px 16px",
            fontSize: 11, fontWeight: 700, textDecoration: "none",
            boxShadow: `0 4px 0 #D1D5DB`,
            cursor: "not-allowed",
            userSelect: "none",
          }}
        >
          Registration Closed
        </div>
      ) : (
        <Link
          to={`/events#event-${event.id}`}
          className="btn-3d flex items-center justify-center gap-1"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: COLORS.sidebar, color: "#fff",
            borderRadius: 10, padding: "8px 16px",
            fontSize: 11, fontWeight: 700, textDecoration: "none",
            boxShadow: `0 4px 0 ${COLORS.sidebarDark}`,
            transition: "transform 0.1s, box-shadow 0.1s",
            userSelect: "none",
          }}
        >
          <Icon name="plus" size={11} color="#fff" />
          Register Now
        </Link>
      )}
    </div>
  );
};

const queries = [
  "Which AWS certification is best for beginners?",
  "How should I study for the Cloud Practitioner exam?",
  "What is the difference between Associate and Pro certs?",
  "How long do AWS certifications stay valid?",
  "How can I get free hands-on practice on AWS?"
];

export default function Chat() {
  const [activeChannel, setActiveChannel] = useState("announcement");
  const [isCustomTyping, setIsCustomTyping] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch live events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await api.get('/events/live');
        if (response.data && response.data.success) {
          setLiveEvents(response.data.data.events || []);
        }
      } catch (err) {
        console.error('Error fetching live events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Lock outer scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const [systemMessages, setSystemMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm CloudBot 👋 I can help you with AWS certification questions, study tips, or anything cloud-related. What would you like to know?",
      timestamp: Date.now() - 1000
    }
  ]);
  const [userPendingMessages, setUserPendingMessages] = useState([]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const allMessages = [...systemMessages, ...userPendingMessages].sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [allMessages]);

  const send = (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;

    const time = Date.now();
    const newPendingMsg = {
      role: "user",
      text: msg,
      status: "Pending",
      timestamp: time
    };

    setUserPendingMessages(prev => [...prev, newPendingMsg]);
    setInput("");
  };

  const handleQueryClick = (queryText, index) => {
    const time = Date.now();
    setSystemMessages(prev => [
      ...prev,
      { role: "user", text: queryText, timestamp: time },
      { role: "bot", text: botResponses[index % botResponses.length], timestamp: time + 10 }
    ]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-112px)] md:h-[calc(100vh-128px)] overflow-hidden font-sans shadow-sm" style={{ background: "#fff", border: `1px solid ${COLORS.mint}`, borderRadius: 16 }}>
        
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.mint}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.sidebar}, ${COLORS.sidebarDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 10px ${COLORS.sidebar}40` }}>
            <Icon name="bot" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.sidebar, letterSpacing: "-0.01em" }}>CloudBot AI</div>
            <div style={{ fontSize: 11, color: COLORS.teal, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14 }}>●</span> Online
            </div>
          </div>
        </div>

        {/* Channel Toggle Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.mint}` }}>
          <button
            onClick={() => setActiveChannel("announcement")}
            style={{
              flex: 1, padding: "12px 16px", border: "none",
              background: activeChannel === "announcement" ? `${COLORS.mint}20` : "transparent",
              color: activeChannel === "announcement" ? COLORS.sidebar : COLORS.teal,
              fontWeight: activeChannel === "announcement" ? 700 : 500,
              fontSize: 13, cursor: "pointer",
              borderBottom: activeChannel === "announcement" ? `3px solid ${COLORS.sidebar}` : "3px solid transparent",
              transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            Announcement
          </button>
          <button
            onClick={() => setActiveChannel("doubt")}
            style={{
              flex: 1, padding: "12px 16px", border: "none",
              background: activeChannel === "doubt" ? `${COLORS.mint}20` : "transparent",
              color: activeChannel === "doubt" ? COLORS.sidebar : COLORS.teal,
              fontWeight: activeChannel === "doubt" ? 700 : 500,
              fontSize: 13, cursor: "pointer",
              borderBottom: activeChannel === "doubt" ? `3px solid ${COLORS.sidebar}` : "3px solid transparent",
              transition: "all 0.2s", fontFamily: "inherit",
            }}
          >
            Doubt
          </button>
        </div>

        {/* Content Feed/Chat */}
        {activeChannel === "announcement" ? (
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {loadingEvents ? (
              <div style={{ textAlign: "center", padding: 20, color: COLORS.teal, fontSize: 13, fontWeight: 600 }}>Loading announcements...</div>
            ) : liveEvents.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20, color: COLORS.teal, fontSize: 13, fontWeight: 600 }}>No announcements right now.</div>
            ) : (
              liveEvents.map((event) => (
                <AnnouncementCard key={event.id} event={event} />
              ))
            )}
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {allMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "slideUp 0.3s ease" }}>
                {m.role === "bot" && (
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${COLORS.sidebar}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="bot" size={16} color={COLORS.sidebar} />
                  </div>
                )}
                <div style={{
                  maxWidth: "80%", padding: "10px 16px", borderRadius: 12,
                  borderTopLeftRadius: m.role === "bot" ? 2 : 12,
                  borderTopRightRadius: m.role === "user" ? 2 : 12,
                  background: m.role === "user" ? COLORS.sidebar : COLORS.surface,
                  border: m.role === "bot" ? `1px solid ${COLORS.mint}` : "none",
                  color: m.role === "user" ? "#fff" : COLORS.text,
                  fontSize: 12, lineHeight: 1.6,
                }}>
                  {m.text}
                  {m.status && (
                    <div style={{ fontSize: 9, opacity: 0.8, textAlign: "right", marginTop: 4, fontStyle: "italic", fontWeight: 600 }}>
                      ● {m.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input area / Query buttons */}
        {activeChannel === "doubt" && (
          <div style={{ padding: 16, borderTop: `1px solid ${COLORS.mint}` }}>
            {!isCustomTyping ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {queries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQueryClick(q, i)}
                      style={{
                        flex: "1 1 calc(50% - 4px)", minWidth: 0,
                        background: COLORS.surface, border: `1px solid ${COLORS.mint}`,
                        borderRadius: 12, padding: "10px 12px", fontSize: 11, fontWeight: 500,
                        color: COLORS.sidebar, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = COLORS.sidebar;
                        e.currentTarget.style.background = `${COLORS.mint}20`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = COLORS.mint;
                        e.currentTarget.style.background = COLORS.surface;
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsCustomTyping(true)}
                  style={{
                    width: "100%", background: COLORS.sidebar, border: "none", borderRadius: 12,
                    padding: "12px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer",
                    textAlign: "center", transition: "all 0.2s", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.sidebarDark}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.sidebar}
                >
                  Other
                </button>
              </div>
            ) : (
              <form onSubmit={send} style={{ display: "flex", gap: 10 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your custom doubt..."
                  style={{
                    flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.mint}`,
                    borderRadius: 12, padding: "12px 16px", fontSize: 13, color: COLORS.text, outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => e.target.style.borderColor = COLORS.sidebar}
                  onBlur={e => e.target.style.borderColor = COLORS.mint}
                />
                <button
                  type="submit"
                  style={{ background: COLORS.sidebar, border: "none", borderRadius: 12, padding: "0 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name="send" size={16} color="#fff" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomTyping(false)}
                  style={{ background: "none", border: `1px solid ${COLORS.mint}`, borderRadius: 12, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.teal, fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}
                >
                  Back
                </button>
              </form>
            )}
          </div>
        )}
    </div>
  );
}
