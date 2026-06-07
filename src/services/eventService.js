const { query } = require('../config/db');

/**
 * Formats a database event record into a frontend-compatible structure.
 */
function formatEvent(row) {
  if (!row) return null;

  // Format start_time (HH:MM:SS) to standard 12-hour AM/PM format (e.g. "10:00 AM")
  let timeStr = row.start_time;
  try {
    const timeParts = row.start_time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    timeStr = `${displayHours}:${minutes} ${ampm}`;
  } catch (err) {
    console.error('Time formatting error:', err);
  }

  // Format date to YYYY-MM-DD
  let dateStr = row.date;
  try {
    dateStr = new Date(row.date).toISOString().split('T')[0];
  } catch (err) {
    console.error('Date formatting error:', err);
  }

  // Deterministically assign harmonized modern gradients based on event name
  const gradients = [
    'linear-gradient(135deg, #6FB6B3, #BFE3DE)',
    'linear-gradient(135deg, #005E63, #6FB6B3)',
    'linear-gradient(135deg, #7D6A8F, #BFE3DE)',
    'linear-gradient(135deg, #E4BC63, #E4D4C4)',
    'linear-gradient(135deg, #004F54, #7D6A8F)',
    'linear-gradient(135deg, #E4D4C4, #BFE3DE)'
  ];
  const bannerBg = row.event_banner_url || gradients[row.name.length % gradients.length];

  const icons = ['cloud', 'layers', 'shield', 'code', 'brain', 'database', 'network', 'terminal'];
  const icon = icons[row.name.length % icons.length];

  const categories = ['Workshop', 'Bootcamp', 'Specialty', 'Development', 'AI/ML', 'Analytics'];
  let category = categories[row.name.length % categories.length];
  let speaker = 'Cloud Enthusiasts Lead Speaker';
  let agenda = [
    'Welcome & Check-in Desk Open',
    'Deep Dive & Core Tech session',
    'Live Hands-on Labs & Demos',
    'Q&A & Community Networking Session'
  ];

  if (row.name.toLowerCase().includes('investiture')) {
    category = 'Ceremony';
    speaker = 'Cloud Captain: Prathakshanaa T';
    agenda = [
      'Inauguration & Lighting of the Lamp',
      'Address by Faculty Coordinator: Bhuvaneswaran B',
      'Investiture of Office Bearers',
      'Oath Taking Ceremony & Plan of Action Presentation',
      'Networking & Interactive Session'
    ];
  } else if (row.name.toLowerCase().includes('matrix')) {
    category = 'Specialty';
    speaker = 'AWS Cloud Clubs REC Panel';
    agenda = [
      'Welcome Remarks & Networking Desk Open',
      'Session 1: Cloud Computing Basics & Fundamentals',
      'Session 2: Career Opportunities & AWS Certifications Map',
      'Open Q&A with AWS Cloud Club Leads',
      'Closing Remarks & Feedbacks'
    ];
  } else if (row.name.toLowerCase().includes('community')) {
    category = 'Community Day';
    speaker = 'Tech Leaders & AWS Experts';
    agenda = [
      '09:30 AM - Welcome Address & Cloud Club Introduction',
      '10:00 AM - Keynote: Build the Cloud, Shape the Future',
      '11:30 AM - Panel Discussion: Code, Community & Innovation',
      '01:30 PM - Hands-on Cloud Builder Labs & Demos',
      '03:30 PM - Developer Networking & High Tea'
    ];
  }

  const local = new Date();
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, '0');
  const day = String(local.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const ev = new Date(row.date);
  const evYear = ev.getFullYear();
  const evMonth = String(ev.getMonth() + 1).padStart(2, '0');
  const evDay = String(ev.getDate()).padStart(2, '0');
  const eventDateStr = `${evYear}-${evMonth}-${evDay}`;

  let calculatedStatus = 'Completed';
  if (row.event_status === 'ACTIVE' && eventDateStr >= todayStr) {
    calculatedStatus = 'Upcoming';
  }

  return {
    id: row.id,
    title: row.name,
    description: row.description,
    date: dateStr,
    time: timeStr,
    venue: row.venue,
    capacity: row.max_participants,
    registered: parseInt(row.registered_count || 0, 10),
    status: calculatedStatus,
    category: category,
    icon: icon,
    bannerBg: bannerBg,
    speaker: speaker,
    agenda: agenda
  };
}

/**
 * Retrieves paginated live/upcoming events.
 * Filtered by: event_status = 'ACTIVE' and is_archived = false.
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise<Object>} Object containing events array and pagination metadata
 */
async function getLiveEvents(page = 1, limit = 50) {
  const offset = (page - 1) * limit;

  // Get total count for metadata
  const countRes = await query(
    "SELECT COUNT(*) FROM events WHERE event_status = 'ACTIVE' AND is_archived = false"
  );
  const total = parseInt(countRes.rows[0].count, 10);

  // Fetch paginated events with registrations count joined
  const res = await query(
    `SELECT e.id, e.name, e.description, e.venue, e.date, e.start_time, e.end_time, 
            e.registration_open, e.registration_close, e.event_banner_url, 
            e.max_participants, e.event_status, e.created_at,
            (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.is_archived = false) AS registered_count
     FROM events e
     WHERE e.event_status = 'ACTIVE' AND e.is_archived = false 
     ORDER BY e.date ASC, e.start_time ASC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return {
    events: res.rows.map(formatEvent),
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Retrieves details for a specific event.
 * @param {string} eventId 
 * @returns {Promise<Object>} Event details
 */
async function getEventById(eventId) {
  const res = await query(
    `SELECT e.*, 
            (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.is_archived = false) AS registered_count
     FROM events e
     WHERE e.id = $1 AND e.is_archived = false`,
    [eventId]
  );

  if (res.rows.length === 0) {
    throw new Error('Event not found or has been archived');
  }

  return formatEvent(res.rows[0]);
}

/**
 * Retrieves custom/dynamic registration fields for an event.
 * @param {string} eventId 
 * @returns {Promise<Array>} List of form field configurations
 */
async function getEventFormFields(eventId) {
  // Verify event existence and active status
  await getEventById(eventId);

  const res = await query(
    `SELECT id, field_name, field_label, field_type, is_required, is_default, select_options, sort_order 
     FROM form_fields 
     WHERE event_id = $1 
     ORDER BY sort_order ASC, created_at ASC`,
    [eventId]
  );

  return res.rows;
}

/**
 * Retrieves registration and attendance statistics for a given event.
 * @param {string} eventId 
 * @returns {Promise<Object>} Object containing totalRegistrations, checkedIn, checkedOut, and remainingSeats
 */
async function getEventStats(eventId) {
  // Verify event existence and extract maximum capacity
  const event = await getEventById(eventId);

  // High performance single roundtrip count query
  const statsRes = await query(
    `SELECT 
       (SELECT COUNT(*) FROM registrations WHERE event_id = $1 AND is_archived = false) AS total_registrations,
       (SELECT COUNT(*) FROM attendance WHERE event_id = $1 AND check_in_time IS NOT NULL AND is_archived = false) AS checked_in,
       (SELECT COUNT(*) FROM attendance WHERE event_id = $1 AND check_out_time IS NOT NULL AND is_archived = false) AS checked_out`,
    [eventId]
  );

  const stats = statsRes.rows[0];
  const totalRegistrations = parseInt(stats.total_registrations, 10);
  const checkedIn = parseInt(stats.checked_in, 10);
  const checkedOut = parseInt(stats.checked_out, 10);
  const remainingSeats = Math.max(0, event.capacity - totalRegistrations);

  return {
    totalRegistrations,
    checkedIn,
    checkedOut,
    remainingSeats
  };
}

/**
 * Retrieves all active registrations for an event with attendance and form values flattened.
 * @param {string} eventId 
 * @returns {Promise<Array>} List of registration records
 */
async function getEventRegistrations(eventId) {
  await getEventById(eventId);

  const regRes = await query(
    `SELECT r.id AS registration_id, r.email, r.register_number, r.registration_timestamp,
            a.check_in_time, a.check_out_time, t.id AS ticket_id, t.ticket_code
     FROM registrations r
     LEFT JOIN attendance a ON a.registration_id = r.id
     LEFT JOIN tickets t ON t.registration_id = r.id
     WHERE r.event_id = $1 AND r.is_archived = false
     ORDER BY r.registration_timestamp DESC`,
    [eventId]
  );
  const registrations = regRes.rows;

  const valuesRes = await query(
    `SELECT rfv.registration_id, ff.field_name, rfv.field_value 
     FROM registration_field_values rfv
     JOIN form_fields ff ON ff.id = rfv.field_id
     JOIN registrations r ON r.id = rfv.registration_id
     WHERE r.event_id = $1 AND r.is_archived = false`,
    [eventId]
  );
  const values = valuesRes.rows;

  const valuesMap = {};
  for (const v of values) {
    if (!valuesMap[v.registration_id]) {
      valuesMap[v.registration_id] = {};
    }
    valuesMap[v.registration_id][v.field_name] = v.field_value;
  }

  return registrations.map(r => {
    const answers = valuesMap[r.registration_id] || {};
    return {
      id: r.registration_id,
      name: answers.Name || 'Participant',
      email: r.email,
      registerNumber: r.register_number,
      rollNumber: r.register_number, // Alias for rollNumber matching
      department: answers.Department || 'N/A',
      year: answers.Year ? answers.Year.replace(' Year', '') : 'N/A',
      ticketId: r.ticket_id,
      ticketCode: r.ticket_code,
      attended: r.check_in_time !== null,
      checkInTime: r.check_in_time,
      checkOutTime: r.check_out_time,
      status: r.check_in_time !== null ? 'Checked In' : 'Confirmed'
    };
  });
}

/**
 * Retrieves all archive logs (Admin Only)
 * @returns {Promise<Array>} List of archive log entries
 */
async function getArchiveLogs() {
  const res = await query(
    `SELECT al.id, al.event_id, al.export_log_id, al.archive_timestamp, al.record_count, al.checksum, al.metadata,
            e.name AS event_title
     FROM archive_logs al
     LEFT JOIN events e ON e.id = al.event_id
     ORDER BY al.archive_timestamp DESC`
  );
  return res.rows;
}

module.exports = {
  getLiveEvents,
  getEventById,
  getEventFormFields,
  getEventStats,
  getEventRegistrations,
  getArchiveLogs,
};
