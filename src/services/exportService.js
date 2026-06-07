const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');
const { query } = require('../config/db');
const { calculateHash } = require('../utils/fileHash');

const EXPORTS_DIR = path.join(__dirname, '../../exports');

// Ensure exports folder exists
if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

/**
 * Helper to fetch and flatten registrations (including dynamic custom values)
 */
async function getFlattenedRegistrations(eventId) {
  // Fetch configured form fields to dynamically establish column order
  const fieldsRes = await query(
    `SELECT id, field_name, field_label 
     FROM form_fields 
     WHERE event_id = $1 
     ORDER BY sort_order ASC, created_at ASC`,
    [eventId]
  );
  const fields = fieldsRes.rows;

  // Fetch active (non-archived) registrations
  const regRes = await query(
    `SELECT id, email, register_number, registration_timestamp 
     FROM registrations 
     WHERE event_id = $1 AND is_archived = false 
     ORDER BY registration_timestamp ASC`,
    [eventId]
  );
  const registrations = regRes.rows;

  // Fetch answers to dynamic fields
  const valuesRes = await query(
    `SELECT rfv.registration_id, rfv.field_id, rfv.field_value 
     FROM registration_field_values rfv
     JOIN registrations r ON r.id = rfv.registration_id
     WHERE r.event_id = $1 AND r.is_archived = false`,
    [eventId]
  );
  const values = valuesRes.rows;

  // Build a lookup map of values: { registrationId: { fieldId: value } }
  const valuesMap = {};
  for (const v of values) {
    if (!valuesMap[v.registration_id]) {
      valuesMap[v.registration_id] = {};
    }
    valuesMap[v.registration_id][v.field_id] = v.field_value;
  }

  // Create a flattened array of data objects
  const flattened = registrations.map(r => {
    const record = {
      'Registration ID': r.id,
      'Email': r.email,
      'Register Number': r.register_number,
      'Registration Date': new Date(r.registration_timestamp).toLocaleString()
    };

    // Add answers dynamically by field_label
    const regAnswers = valuesMap[r.id] || {};
    for (const f of fields) {
      record[f.field_label] = regAnswers[f.id] || '';
    }

    return record;
  });

  return { flattened, fields };
}

/**
 * Helper to fetch and flatten attendance logs
 */
async function getFlattenedAttendance(eventId) {
  const fieldsRes = await query(
    `SELECT id, field_name, field_label 
     FROM form_fields 
     WHERE event_id = $1 
     ORDER BY sort_order ASC, created_at ASC`,
    [eventId]
  );
  const fields = fieldsRes.rows;

  // Fetch active attendance logs joined with registrations and ticket codes
  const attRes = await query(
    `SELECT a.id AS attendance_id, a.check_in_time, a.check_out_time, 
            r.id AS registration_id, r.email, r.register_number, 
            t.ticket_code
     FROM attendance a
     JOIN registrations r ON r.id = a.registration_id
     JOIN tickets t ON t.id = a.ticket_id
     WHERE a.event_id = $1 AND a.is_archived = false
     ORDER BY a.check_in_time ASC NULLS LAST`,
    [eventId]
  );
  const attendanceLogs = attRes.rows;

  // Fetch answers to dynamic fields
  const valuesRes = await query(
    `SELECT rfv.registration_id, rfv.field_id, rfv.field_value 
     FROM registration_field_values rfv
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
    valuesMap[v.registration_id][v.field_id] = v.field_value;
  }

  // Flatten
  const flattened = attendanceLogs.map(a => {
    const record = {
      'Ticket Code': a.ticket_code,
      'Register Number': a.register_number,
      'Email': a.email,
      'Check-In Time': a.check_in_time ? new Date(a.check_in_time).toLocaleString() : 'Not Checked In',
      'Check-Out Time': a.check_out_time ? new Date(a.check_out_time).toLocaleString() : 'Not Checked Out',
      'Attendance ID': a.attendance_id
    };

    const regAnswers = valuesMap[a.registration_id] || {};
    for (const f of fields) {
      record[f.field_label] = regAnswers[f.id] || '';
    }

    return record;
  });

  return { flattened, fields };
}

/**
 * Generate CSV or Excel file, log it in export_logs, and return file attributes.
 * @param {string} eventId 
 * @param {string} type 'registrations' | 'attendance'
 * @param {boolean} isExcel 
 * @returns {Promise<Object>} Attributes for controller streaming
 */
async function generateExportFile(eventId, type, isExcel = false) {
  // Check if event exists
  const eventRes = await query('SELECT name FROM events WHERE id = $1 AND is_archived = false', [eventId]);
  if (eventRes.rows.length === 0) {
    throw new Error('Event not found or has been archived');
  }

  let dataObj;
  if (type === 'registrations') {
    dataObj = await getFlattenedRegistrations(eventId);
  } else if (type === 'attendance') {
    dataObj = await getFlattenedAttendance(eventId);
  } else {
    throw new Error('Invalid export category');
  }

  const { flattened } = dataObj;

  // Setup column headers
  let headers = [];
  if (flattened.length > 0) {
    headers = Object.keys(flattened[0]);
  } else {
    // Default fallback headers if dataset is empty
    headers = type === 'registrations'
      ? ['Registration ID', 'Email', 'Register Number', 'Registration Date']
      : ['Ticket Code', 'Register Number', 'Email', 'Check-In Time', 'Check-Out Time', 'Attendance ID'];
  }

  let fileContent;
  let fileExtension;
  let mimeType;

  if (isExcel) {
    fileExtension = 'xlsx';
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type === 'registrations' ? 'Registrations' : 'Attendance');
    
    worksheet.columns = headers.map(h => ({ header: h, key: h, width: 25 }));
    worksheet.addRows(flattened);
    
    fileContent = await workbook.xlsx.writeBuffer();
  } else {
    fileExtension = 'csv';
    mimeType = 'text/csv';

    try {
      const parser = new Parser({ fields: headers });
      fileContent = parser.parse(flattened);
    } catch (err) {
      // Safe fallback CSV generator in case of parsing library issues
      const csvRows = [headers.join(',')];
      for (const row of flattened) {
        const values = headers.map(h => {
          const val = row[h] === undefined || row[h] === null ? '' : row[h];
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      fileContent = csvRows.join('\n');
    }
  }

  // Calculate file hash (SHA-256)
  const checksum = calculateHash(fileContent);
  const timestamp = Date.now();
  const fileName = `${type}_${eventId}_${timestamp}.${fileExtension}`;
  const filePath = path.join(EXPORTS_DIR, fileName);

  // Write file to filesystem
  fs.writeFileSync(filePath, fileContent);

  // Insert log
  const exportType = `${type.toUpperCase()}_${isExcel ? 'EXCEL' : 'CSV'}`;
  const logRes = await query(
    `INSERT INTO export_logs (event_id, export_type, status, file_name, file_checksum)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [eventId, exportType, 'EXPORTED', fileName, checksum]
  );

  return {
    exportLog: logRes.rows[0],
    filePath,
    fileName,
    mimeType
  };
}

module.exports = {
  generateExportFile
};
