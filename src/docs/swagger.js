const env = require('../config/env');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Cloud Enthusiasts Registration & Attendance System API',
    version: '1.0.0',
    description: 'API-first production-ready backend designed exclusively for the Cloud Enthusiasts Club. Handles student registrations, dynamic registration form configuration, QR-based check-in/check-out tracking, CSV/Excel exports, and a safe archive-rollback workflow.',
    contact: {
      name: 'Cloud Enthusiasts Club Team',
      email: 'admin@cloudenthusiasts.club'
    }
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Active Server instance'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Admin JWT token in the format: Bearer <token>'
      }
    },
    schemas: {
      AdminLoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'admin' },
          password: { type: 'string', example: 'CloudEnthusiasts2026!' }
        }
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['oldPassword', 'newPassword'],
        properties: {
          oldPassword: { type: 'string', example: 'CloudEnthusiasts2026!' },
          newPassword: { type: 'string', example: 'NewSecurePassword2026!' }
        }
      },
      RegisterStudentRequest: {
        type: 'object',
        required: ['email', 'registerNumber', 'responses'],
        properties: {
          email: { type: 'string', format: 'email', example: 'student@college.edu' },
          registerNumber: { type: 'string', example: '917722104050' },
          responses: {
            type: 'object',
            additionalProperties: true,
            example: {
              Name: 'Sam Devaraja',
              Email: 'student@college.edu',
              'Register Number': '917722104050',
              Department: 'Computer Science',
              Year: '3rd Year',
              'Phone Number': '9876543210'
            }
          }
        }
      },
      CheckInRequest: {
        type: 'object',
        required: ['eventId'],
        properties: {
          ticketId: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
          emailOrRegNo: { type: 'string', example: 'student@college.edu', description: 'Fallback identifier if barcode fails' },
          eventId: { type: 'string', format: 'uuid', example: 'b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22' }
        }
      },
      ConfirmExportRequest: {
        type: 'object',
        required: ['exportLogId'],
        properties: {
          exportLogId: { type: 'string', format: 'uuid', example: 'd3eedc99-9c0b-4ef8-bb6d-6bb9bd380a44' }
        }
      },
      RollbackArchiveRequest: {
        type: 'object',
        required: ['archiveLogId'],
        properties: {
          archiveLogId: { type: 'string', format: 'uuid', example: 'e4eedc99-9c0b-4ef8-bb6d-6bb9bd380a55' }
        }
      }
    }
  },
  paths: {
    '/api/auth/login': {
      post: {
        summary: 'Admin Login',
        description: 'Authenticates admin and returns a JWT token.',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AdminLoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Admin authentication successful',
                  data: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    admin: {
                      id: '8f729226-c229-4d64-8742-fa3ee70172e2',
                      username: 'admin'
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/auth/change-password': {
      post: {
        summary: 'Change Admin Password',
        description: 'Updates administrative login password.',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Password changed successfully',
            content: { 'application/json': { example: { success: true, message: 'Password updated successfully', data: {} } } }
          },
          400: { description: 'Incorrect old password or invalid new password length' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/events/live': {
      get: {
        summary: 'List Live Events',
        description: 'Retrieves all active, non-archived cloud enthusiast events.',
        tags: ['Events'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          200: {
            description: 'List of events retrieved',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Active events retrieved successfully',
                  data: {
                    events: [
                      {
                        id: 'b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22',
                        name: 'AWS Cloud Practitioner Kickstart',
                        description: 'AWS computing fundamentals.',
                        venue: 'Seminar Hall A',
                        date: '2026-07-15',
                        start_time: '09:30:00',
                        end_time: '12:30:00',
                        registration_open: '2026-06-01T00:00:00.000Z',
                        registration_close: '2026-07-14T23:59:59.000Z',
                        event_banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
                        max_participants: 150,
                        event_status: 'ACTIVE'
                      }
                    ],
                    pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/{eventId}': {
      get: {
        summary: 'Get Event Details',
        description: 'Returns metadata for a specific event.',
        tags: ['Events'],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Details returned successfully' },
          404: { description: 'Event not found or archived' }
        }
      }
    },
    '/api/events/{eventId}/form': {
      get: {
        summary: 'Get Registration Form fields',
        description: 'Returns the custom layout fields configured for registration.',
        tags: ['Events'],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: {
            description: 'Form fields structure',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Event registration form configuration retrieved successfully',
                  data: {
                    fields: [
                      { id: 'f1', field_name: 'Name', field_label: 'Full Name', field_type: 'text', is_required: true, is_default: true },
                      { id: 'f2', field_name: 'Year', field_label: 'Year of Study', field_type: 'select', is_required: true, is_default: false, select_options: ['1st Year', '2nd Year'] }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/{eventId}/register': {
      post: {
        summary: 'Student Registration',
        description: 'Submits student details for an event registration. Validates duplicates, deadline, and capacity.',
        tags: ['Registrations'],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterStudentRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Registration successful. Returns QR payload.',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Registration completed successfully',
                  data: {
                    registrationId: 'r5eedc99-9c0b-4ef8-bb6d-6bb9bd380a55',
                    ticketId: 't6eedc99-9c0b-4ef8-bb6d-6bb9bd380a66',
                    qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAAN...'
                  }
                }
              }
            }
          },
          400: { description: 'Validation failed, event full, deadline crossed, or duplicate email/roll number' }
        }
      }
    },
    '/api/attendance/checkin': {
      post: {
        summary: 'Check-In Participant',
        description: 'Scans QR code payload to perform check-in. Prevents double check-in.',
        tags: ['Attendance'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckInRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Check-in successful' },
          400: { description: 'Duplicate check-in or invalid ticket' }
        }
      }
    },
    '/api/attendance/checkout': {
      post: {
        summary: 'Check-Out Participant',
        description: 'Scans QR code payload to perform check-out. Prevent duplicate check-out. Allowed only after check-in.',
        tags: ['Attendance'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckInRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Check-out successful' },
          400: { description: 'Already checked out, or check-in not performed first' }
        }
      }
    },
    '/api/events/{eventId}/stats': {
      get: {
        summary: 'Get Event Statistics',
        description: 'Returns real-time totals of registrations, check-ins, check-outs, and available capacity.',
        tags: ['Analytics'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: {
            description: 'Statistics returned successfully',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Event statistics retrieved successfully',
                  data: {
                    totalRegistrations: 45,
                    checkedIn: 32,
                    checkedOut: 10,
                    remainingSeats: 105
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/{eventId}/export/registrations/csv': {
      get: {
        summary: 'Export Active Registrations to CSV',
        tags: ['Exports & Archiving'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'CSV file binary returned' }
        }
      }
    },
    '/api/events/{eventId}/export/registrations/excel': {
      get: {
        summary: 'Export Active Registrations to Excel',
        tags: ['Exports & Archiving'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'XLSX sheet binary returned' }
        }
      }
    },
    '/api/events/{eventId}/export/attendance/csv': {
      get: {
        summary: 'Export Active Attendance Logs to CSV',
        tags: ['Exports & Archiving'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'CSV file binary returned' }
        }
      }
    },
    '/api/events/{eventId}/export/attendance/excel': {
      get: {
        summary: 'Export Active Attendance Logs to Excel',
        tags: ['Exports & Archiving'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'XLSX sheet binary returned' }
        }
      }
    },
    '/api/events/{eventId}/export/confirm': {
      post: {
        summary: 'Confirm Export Download & Archive Data',
        description: 'Updates export log to CONFIRMED. Copies active records to archive tables and flags main tables with is_archived = true.',
        tags: ['Exports & Archiving'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConfirmExportRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Data successfully archived',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Export download confirmed and data archived successfully',
                  data: {
                    id: 'arch-uuid',
                    event_id: 'event-uuid',
                    export_log_id: 'export-log-uuid',
                    record_count: 45,
                    checksum: 'checksum-sha256',
                    metadata: { file_name: 'registrations_...' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/events/{eventId}/archive/rollback': {
      post: {
        summary: 'Rollback Archived Data',
        description: 'Reverts the soft-archived records back to active, clearing archive table entries and updating log status.',
        tags: ['Exports & Archiving'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'eventId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RollbackArchiveRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Rollback completed successfully' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
