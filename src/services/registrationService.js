const { getClient } = require('../config/db');
const { generateQRCodeBase64 } = require('../utils/qrCode');

/**
 * Registers a student for an event, validating deadlines, limits, duplicates, and custom fields.
 * Wraps database updates in a SQL transaction.
 * @param {string} eventId 
 * @param {string} email 
 * @param {string} registerNumber 
 * @param {Object} responses Key-value pairs matching form field names and user answers
 * @returns {Promise<Object>} Object containing registrationId, ticketId, and qrCodeUrl (base64)
 */
async function registerParticipant(eventId, email, registerNumber, responses = {}) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Fetch event and lock the row to prevent race conditions (for concurrent limit checks)
    const eventRes = await client.query(
      'SELECT * FROM events WHERE id = $1 AND is_archived = false FOR UPDATE',
      [eventId]
    );
    if (eventRes.rows.length === 0) {
      throw new Error('Event not found or has been archived');
    }

    const event = eventRes.rows[0];

    // Check status
    if (event.event_status !== 'ACTIVE') {
      throw new Error(`Registration is not open. Event status: ${event.event_status}`);
    }

    // Check deadline
    const now = new Date();
    const regOpen = new Date(event.registration_open);
    const regClose = new Date(event.registration_close);

    if (now < regOpen) {
      throw new Error('Registration for this event has not started yet');
    }
    if (now > regClose) {
      throw new Error('Registration for this event has closed');
    }

    // Check capacity limit
    const regCountRes = await client.query(
      'SELECT COUNT(*) FROM registrations WHERE event_id = $1 AND is_archived = false',
      [eventId]
    );
    const currentParticipants = parseInt(regCountRes.rows[0].count, 10);
    if (currentParticipants >= event.max_participants) {
      throw new Error('Registration limit reached. This event is fully booked.');
    }

    // 2. Validate email / register number duplicates (among active registrations)
    const emailCheck = await client.query(
      'SELECT id FROM registrations WHERE event_id = $1 AND email = $2 AND is_archived = false',
      [eventId, email]
    );
    if (emailCheck.rows.length > 0) {
      throw new Error('A user with this email has already registered for this event');
    }

    const regNoCheck = await client.query(
      'SELECT id FROM registrations WHERE event_id = $1 AND register_number = $2 AND is_archived = false',
      [eventId, registerNumber]
    );
    if (regNoCheck.rows.length > 0) {
      throw new Error('A user with this registration number has already registered for this event');
    }

    // 3. Retrieve dynamic form fields to perform validation
    const fieldsRes = await client.query(
      'SELECT * FROM form_fields WHERE event_id = $1 ORDER BY sort_order ASC',
      [eventId]
    );
    const formFields = fieldsRes.rows;

    const validatedAnswers = [];

    for (const field of formFields) {
      // Lookup value by field name (case insensitive/trim comparison might be helpful, but let's do direct match first)
      let value = responses[field.field_name];
      if (value === undefined || value === null) {
        // Fallback for key case mismatches (e.g. Email vs email)
        const matchedKey = Object.keys(responses).find(k => k.toLowerCase() === field.field_name.toLowerCase());
        if (matchedKey) value = responses[matchedKey];
      }

      // Check required
      if (field.is_required && (value === undefined || value === null || String(value).trim() === '')) {
        throw new Error(`Field '${field.field_label}' is required`);
      }

      // Validate value options for select type
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        const strVal = String(value).trim();
        if (field.field_type === 'select' && field.select_options) {
          const options = Array.isArray(field.select_options) 
            ? field.select_options 
            : JSON.parse(field.select_options);

          if (!options.includes(strVal)) {
            throw new Error(`Invalid value for field '${field.field_label}'. Must be one of: ${options.join(', ')}`);
          }
        }

        validatedAnswers.push({
          fieldId: field.id,
          value: strVal
        });
      }
    }

    // 4. Create registration record
    const registrationRes = await client.query(
      `INSERT INTO registrations (event_id, email, register_number)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [eventId, email, registerNumber]
    );
    const registrationId = registrationRes.rows[0].id;

    // Insert responses into registration_field_values
    for (const ans of validatedAnswers) {
      await client.query(
        `INSERT INTO registration_field_values (registration_id, field_id, field_value)
         VALUES ($1, $2, $3)`,
        [registrationId, ans.fieldId, ans.value]
      );
    }

    // 5. Generate Ticket with random code
    const ticketCode = 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + 
                       Math.random().toString(36).substring(2, 8).toUpperCase();

    // Insert temp ticket to get UUID id
    const ticketRes = await client.query(
      `INSERT INTO tickets (registration_id, event_id, ticket_code, qr_code_base64)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [registrationId, eventId, ticketCode, 'PENDING']
    );
    const ticketId = ticketRes.rows[0].id;

    // Generate base64 QR payload
    const qrPayload = {
      ticketId: ticketId,
      eventId: eventId,
      registrationId: registrationId
    };
    const qrCodeBase64 = await generateQRCodeBase64(qrPayload);

    // Save actual base64 image string to ticket
    await client.query(
      'UPDATE tickets SET qr_code_base64 = $1 WHERE id = $2',
      [qrCodeBase64, ticketId]
    );

    // 6. Pre-initialize attendance entry for this participant
    await client.query(
      `INSERT INTO attendance (ticket_id, registration_id, event_id)
       VALUES ($1, $2, $3)`,
      [ticketId, registrationId, eventId]
    );

    await client.query('COMMIT');

    return {
      registrationId,
      ticketId,
      qrCodeUrl: qrCodeBase64
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  registerParticipant
};
