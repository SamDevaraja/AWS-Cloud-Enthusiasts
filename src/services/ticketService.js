const { query } = require('../config/db');

/**
 * Fetches ticket metadata for display in the frontend QRTicket component.
 * @param {string} ticketId 
 * @returns {Promise<Object>} Formatted ticket object
 */
async function getTicketDetails(ticketId) {
  const res = await query(
    `SELECT t.id AS ticket_id, t.ticket_code, t.qr_code_base64,
            r.id AS registration_id, r.email, r.register_number,
            e.id AS event_id, e.name AS event_title, e.date, e.start_time, e.end_time, e.venue,
            (SELECT field_value FROM registration_field_values rfv 
             JOIN form_fields ff ON ff.id = rfv.field_id 
             WHERE rfv.registration_id = r.id AND ff.field_name = 'Name' LIMIT 1) AS participant_name,
            a.check_in_time, a.check_out_time
     FROM tickets t
     JOIN registrations r ON r.id = t.registration_id
     JOIN events e ON e.id = t.event_id
     LEFT JOIN attendance a ON a.ticket_id = t.id
     WHERE t.id = $1 AND r.is_archived = false`,
    [ticketId]
  );

  if (res.rows.length === 0) {
    throw new Error('Ticket not found or has been archived');
  }

  const row = res.rows[0];

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

  return {
    ticketId: row.ticket_id,
    regId: row.ticket_code, // Map ticket code to regId for frontend compatibility
    registrationId: row.registration_id,
    eventId: row.event_id,
    name: row.participant_name || 'Participant',
    email: row.email,
    registerNumber: row.register_number,
    eventTitle: row.event_title,
    date: dateStr,
    time: timeStr,
    venue: row.venue,
    qrCodeUrl: row.qr_code_base64,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
  };
}

module.exports = {
  getTicketDetails
};
