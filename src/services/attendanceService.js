const { query } = require('../config/db');

/**
 * Checks in a participant.
 * Prevents double check-in and verifies active status.
 * @param {string} ticketId 
 * @param {string} eventId 
 * @returns {Promise<Object>} Updated attendance log record
 */
async function checkIn(ticketId, emailOrRegNo, eventId) {
  // Let's support checking in by either ticketId directly, OR email / register number (useful fallback for manual admin entry).
  // Wait, let's prioritize ticketId first as per the QR Attendance specifications.
  
  let ticketRes;
  if (ticketId) {
    ticketRes = await query(
      'SELECT * FROM tickets WHERE id = $1 AND event_id = $2',
      [ticketId, eventId]
    );
  } else if (emailOrRegNo) {
    // Fallback: lookup registration first to find ticket
    const regRes = await query(
      `SELECT t.* FROM registrations r
       JOIN tickets t ON t.registration_id = r.id
       WHERE r.event_id = $1 AND (r.email = $2 OR r.register_number = $2) AND r.is_archived = false`,
      [eventId, emailOrRegNo]
    );
    ticketRes = regRes;
  }

  if (!ticketRes || ticketRes.rows.length === 0) {
    throw new Error('Valid ticket or matching registration was not found for this event');
  }

  const ticket = ticketRes.rows[0];
  const targetTicketId = ticket.id;

  // Fetch active attendance record
  const attendanceRes = await query(
    'SELECT * FROM attendance WHERE ticket_id = $1 AND is_archived = false',
    [targetTicketId]
  );
  if (attendanceRes.rows.length === 0) {
    throw new Error('Active attendance record not found (may be archived or cancelled)');
  }

  const att = attendanceRes.rows[0];

  // Rule: Prevent duplicate check-in
  if (att.check_in_time) {
    const timeStr = new Date(att.check_in_time).toLocaleString();
    throw new Error(`Participant is already checked in (Checked in at: ${timeStr})`);
  }

  // Update check-in timestamp
  const updateRes = await query(
    `UPDATE attendance 
     SET check_in_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 
     RETURNING *`,
    [att.id]
  );

  return updateRes.rows[0];
}

/**
 * Checks out a participant.
 * Requires check-in first and prevents double check-out.
 * @param {string} ticketId 
 * @param {string} eventId 
 * @returns {Promise<Object>} Updated attendance log record
 */
async function checkOut(ticketId, emailOrRegNo, eventId) {
  let ticketRes;
  if (ticketId) {
    ticketRes = await query(
      'SELECT * FROM tickets WHERE id = $1 AND event_id = $2',
      [ticketId, eventId]
    );
  } else if (emailOrRegNo) {
    const regRes = await query(
      `SELECT t.* FROM registrations r
       JOIN tickets t ON t.registration_id = r.id
       WHERE r.event_id = $1 AND (r.email = $2 OR r.register_number = $2) AND r.is_archived = false`,
      [eventId, emailOrRegNo]
    );
    ticketRes = regRes;
  }

  if (!ticketRes || ticketRes.rows.length === 0) {
    throw new Error('Valid ticket or matching registration was not found for this event');
  }

  const ticket = ticketRes.rows[0];
  const targetTicketId = ticket.id;

  // Fetch active attendance record
  const attendanceRes = await query(
    'SELECT * FROM attendance WHERE ticket_id = $1 AND is_archived = false',
    [targetTicketId]
  );
  if (attendanceRes.rows.length === 0) {
    throw new Error('Active attendance record not found (may be archived or cancelled)');
  }

  const att = attendanceRes.rows[0];

  // Rule: Check-out allowed only after check-in
  if (!att.check_in_time) {
    throw new Error('Check-out failed: Participant must check in first before checking out.');
  }

  // Rule: Prevent duplicate checkout
  if (att.check_out_time) {
    const timeStr = new Date(att.check_out_time).toLocaleString();
    throw new Error(`Participant is already checked out (Checked out at: ${timeStr})`);
  }

  // Update check-out timestamp
  const updateRes = await query(
    `UPDATE attendance 
     SET check_out_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 
     RETURNING *`,
    [att.id]
  );

  return updateRes.rows[0];
}

module.exports = {
  checkIn,
  checkOut
};
