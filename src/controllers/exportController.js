const exportService = require('../services/exportService');
const archiveService = require('../services/archiveService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Export Registrations to CSV (Admin Only)
 */
async function exportRegistrationsCSV(req, res, next) {
  try {
    const { eventId } = req.params;
    const { filePath, fileName, mimeType, exportLog } = await exportService.generateExportFile(eventId, 'registrations', false);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('X-Export-Log-Id', exportLog.id);
    res.setHeader('X-Export-Log-Checksum', exportLog.file_checksum);
    res.setHeader('Access-Control-Expose-Headers', 'X-Export-Log-Id, X-Export-Log-Checksum');
    return res.download(filePath, fileName);
  } catch (error) {
    return errorResponse(res, 'Export failed', error.message, 400);
  }
}

/**
 * Export Registrations to Excel (Admin Only)
 */
async function exportRegistrationsExcel(req, res, next) {
  try {
    const { eventId } = req.params;
    const { filePath, fileName, mimeType, exportLog } = await exportService.generateExportFile(eventId, 'registrations', true);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('X-Export-Log-Id', exportLog.id);
    res.setHeader('X-Export-Log-Checksum', exportLog.file_checksum);
    res.setHeader('Access-Control-Expose-Headers', 'X-Export-Log-Id, X-Export-Log-Checksum');
    return res.download(filePath, fileName);
  } catch (error) {
    return errorResponse(res, 'Export failed', error.message, 400);
  }
}

/**
 * Export Attendance Logs to CSV (Admin Only)
 */
async function exportAttendanceCSV(req, res, next) {
  try {
    const { eventId } = req.params;
    const { filePath, fileName, mimeType, exportLog } = await exportService.generateExportFile(eventId, 'attendance', false);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('X-Export-Log-Id', exportLog.id);
    res.setHeader('X-Export-Log-Checksum', exportLog.file_checksum);
    res.setHeader('Access-Control-Expose-Headers', 'X-Export-Log-Id, X-Export-Log-Checksum');
    return res.download(filePath, fileName);
  } catch (error) {
    return errorResponse(res, 'Export failed', error.message, 400);
  }
}

/**
 * Export Attendance Logs to Excel (Admin Only)
 */
async function exportAttendanceExcel(req, res, next) {
  try {
    const { eventId } = req.params;
    const { filePath, fileName, mimeType, exportLog } = await exportService.generateExportFile(eventId, 'attendance', true);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('X-Export-Log-Id', exportLog.id);
    res.setHeader('X-Export-Log-Checksum', exportLog.file_checksum);
    res.setHeader('Access-Control-Expose-Headers', 'X-Export-Log-Id, X-Export-Log-Checksum');
    return res.download(filePath, fileName);
  } catch (error) {
    return errorResponse(res, 'Export failed', error.message, 400);
  }
}

/**
 * Confirm Export and Archive (Admin Only)
 */
async function confirmExport(req, res, next) {
  try {
    const { eventId } = req.params;
    const { exportLogId } = req.body;

    if (!exportLogId) {
      return errorResponse(res, 'Validation error: exportLogId is required', [], 400);
    }

    const archiveLog = await archiveService.confirmExportAndArchive(eventId, exportLogId);
    return successResponse(res, 'Export download confirmed and data archived successfully', archiveLog);
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

/**
 * Rollback Archived Data (Admin Only)
 */
async function rollbackExport(req, res, next) {
  try {
    const { eventId } = req.params;
    const { archiveLogId } = req.body;

    if (!archiveLogId) {
      return errorResponse(res, 'Validation error: archiveLogId is required', [], 400);
    }

    await archiveService.rollbackArchive(eventId, archiveLogId);
    return successResponse(res, 'Archive rollback completed successfully. Data is now active again.');
  } catch (error) {
    return errorResponse(res, error.message, [], 400);
  }
}

module.exports = {
  exportRegistrationsCSV,
  exportRegistrationsExcel,
  exportAttendanceCSV,
  exportAttendanceExcel,
  confirmExport,
  rollbackExport,
};
