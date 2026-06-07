const { getClient } = require('../config/db');

/**
 * Confirms an export download and archives the event data.
 * Moves records to archived_registrations and archived_attendance,
 * then marks active records as is_archived = true.
 * @param {string} eventId 
 * @param {string} exportLogId 
 * @returns {Promise<Object>} The generated archive log entry
 */
async function confirmExportAndArchive(eventId, exportLogId) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Fetch export log for update to prevent concurrent confirm anomalies
    const logRes = await client.query(
      'SELECT * FROM export_logs WHERE id = $1 AND event_id = $2 FOR UPDATE',
      [exportLogId, eventId]
    );
    if (logRes.rows.length === 0) {
      throw new Error('Export log not found for this event');
    }

    const exportLog = logRes.rows[0];
    if (exportLog.status === 'CONFIRMED') {
      throw new Error('This export log has already been confirmed and archived');
    }

    // 2. Fetch all active registrations to archive
    const regRes = await client.query(
      `SELECT id, event_id, email, register_number, registration_timestamp 
       FROM registrations 
       WHERE event_id = $1 AND is_archived = false`,
      [eventId]
    );
    const registrations = regRes.rows;

    if (registrations.length === 0) {
      throw new Error('No active registration records found to archive for this event');
    }

    // Fetch dynamic field responses
    const valuesRes = await client.query(
      `SELECT rfv.registration_id, ff.field_name, rfv.field_value 
       FROM registration_field_values rfv
       JOIN form_fields ff ON ff.id = rfv.field_id
       JOIN registrations r ON r.id = rfv.registration_id
       WHERE r.event_id = $1 AND r.is_archived = false`,
      [eventId]
    );
    const values = valuesRes.rows;

    // Group values by registration_id
    const responsesMap = {};
    for (const v of values) {
      if (!responsesMap[v.registration_id]) {
        responsesMap[v.registration_id] = {};
      }
      responsesMap[v.registration_id][v.field_name] = v.field_value;
    }

    // Insert into archived_registrations
    for (const r of registrations) {
      const formResponses = responsesMap[r.id] || {};
      await client.query(
        `INSERT INTO archived_registrations 
          (registration_id, event_id, email, register_number, registration_timestamp, form_responses)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [r.id, r.event_id, r.email, r.register_number, r.registration_timestamp, JSON.stringify(formResponses)]
      );
    }

    // 3. Fetch active attendance logs to archive
    const attRes = await client.query(
      `SELECT id, registration_id, ticket_id, event_id, check_in_time, check_out_time 
       FROM attendance 
       WHERE event_id = $1 AND is_archived = false`,
      [eventId]
    );
    const attendanceRecords = attRes.rows;

    // Insert into archived_attendance
    for (const a of attendanceRecords) {
      await client.query(
        `INSERT INTO archived_attendance 
          (attendance_id, registration_id, ticket_id, event_id, check_in_time, check_out_time)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [a.id, a.registration_id, a.ticket_id, a.event_id, a.check_in_time, a.check_out_time]
      );
    }

    // 4. Create archive_logs entry
    const archiveMetadata = {
      file_name: exportLog.file_name,
      export_type: exportLog.export_type,
      archived_record_count: registrations.length,
      confirmed_at: new Date().toISOString()
    };

    const archLogRes = await client.query(
      `INSERT INTO archive_logs (event_id, export_log_id, record_count, checksum, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [eventId, exportLogId, registrations.length, exportLog.file_checksum, JSON.stringify(archiveMetadata)]
    );

    // 5. Update export_logs status to CONFIRMED
    await client.query(
      "UPDATE export_logs SET status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [exportLogId]
    );

    // 6. Soft delete active records: is_archived = true
    await client.query(
      'UPDATE registrations SET is_archived = true, updated_at = CURRENT_TIMESTAMP WHERE event_id = $1 AND is_archived = false',
      [eventId]
    );

    await client.query(
      'UPDATE attendance SET is_archived = true, updated_at = CURRENT_TIMESTAMP WHERE event_id = $1 AND is_archived = false',
      [eventId]
    );

    await client.query('COMMIT');

    return archLogRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Rolls back an archiving operation by restoring archived registrations/attendance to active status.
 * @param {string} eventId 
 * @param {string} archiveLogId 
 * @returns {Promise<boolean>}
 */
async function rollbackArchive(eventId, archiveLogId) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // 1. Fetch archive log for update
    const archRes = await client.query(
      'SELECT * FROM archive_logs WHERE id = $1 AND event_id = $2 FOR UPDATE',
      [archiveLogId, eventId]
    );
    if (archRes.rows.length === 0) {
      throw new Error('Archive log not found or doesn’t belong to this event');
    }

    const archiveLog = archRes.rows[0];

    // 2. Restore active status: set is_archived = false
    await client.query(
      `UPDATE registrations 
       SET is_archived = false, updated_at = CURRENT_TIMESTAMP 
       WHERE event_id = $1 AND id IN (SELECT registration_id FROM archived_registrations WHERE event_id = $1)`,
      [eventId]
    );

    await client.query(
      `UPDATE attendance 
       SET is_archived = false, updated_at = CURRENT_TIMESTAMP 
       WHERE event_id = $1 AND registration_id IN (SELECT registration_id FROM archived_registrations WHERE event_id = $1)`,
      [eventId]
    );

    // 3. Clear copies in archive tables to prevent duplication on re-archiving
    await client.query(
      'DELETE FROM archived_registrations WHERE event_id = $1',
      [eventId]
    );

    await client.query(
      'DELETE FROM archived_attendance WHERE event_id = $1',
      [eventId]
    );

    // 4. Update corresponding export_logs status back to EXPORTED
    if (archiveLog.export_log_id) {
      await client.query(
        "UPDATE export_logs SET status = 'EXPORTED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [archiveLog.export_log_id]
      );
    }

    // 5. Remove the archive_logs entry
    await client.query('DELETE FROM archive_logs WHERE id = $1', [archiveLogId]);

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  confirmExportAndArchive,
  rollbackArchive
};
