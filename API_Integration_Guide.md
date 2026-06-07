# API Integration Guide - Cloud Enthusiasts Registration & Attendance System

This integration guide explains how to connect any frontend UI (web, mobile, or scanning client) with the backend API.

## Default Credentials
- **Username**: `admin`
- **Password**: `CloudEnthusiasts2026!`

---

## 1. Authentication Workflow

All administrative operations (Check-in/Check-out, Exports, Archiving, Statistics) require authorization via a JSON Web Token (JWT).

### Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Payload**:
  ```json
  {
    "username": "admin",
    "password": "CloudEnthusiasts2026!"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Admin authentication successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "admin": {
        "id": "8f729226-c229-4d64-8742-fa3ee70172e2",
        "username": "admin"
      }
    }
  }
  ```

### Using the JWT Token
Attach the returned token to the `Authorization` header on all protected requests:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Headers**: JWT Protected
- **Payload**:
  ```json
  {
    "oldPassword": "CloudEnthusiasts2026!",
    "newPassword": "NewSecurePassword2026!"
  }
  ```

---

## 2. Event & Dynamic Registration Forms Workflow

### Fetch Live Events (Public)
Gets active and unarchived events.
- **Endpoint**: `GET /api/events/live`
- **Query Params**: `?page=1&limit=10`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Active events retrieved successfully",
    "data": {
      "events": [
        {
          "id": "b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22",
          "name": "AWS Cloud Practitioner Kickstart",
          "description": "Learn the fundamentals of AWS cloud...",
          "venue": "Seminar Hall A",
          "date": "2026-07-15",
          "start_time": "09:30:00",
          "end_time": "12:30:00",
          "registration_open": "2026-06-01T00:00:00.000Z",
          "registration_close": "2026-07-14T23:59:59.000Z",
          "event_banner_url": "...",
          "max_participants": 150,
          "event_status": "ACTIVE"
        }
      ],
      "pagination": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
    }
  }
  ```

### Fetch Form Configuration (Public)
Each event has custom dynamic fields. Render inputs dynamically based on this setup.
- **Endpoint**: `GET /api/events/:eventId/form`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Event registration form configuration retrieved successfully",
    "data": {
      "fields": [
        {
          "id": "8f03be93-3d02-4541-b847-a87796d11f58",
          "field_name": "Name",
          "field_label": "Full Name",
          "field_type": "text",
          "is_required": true,
          "is_default": true
        },
        {
          "id": "ca04be93-3d02-4541-b847-a87796d11f60",
          "field_name": "Year",
          "field_label": "Year of Study",
          "field_type": "select",
          "is_required": true,
          "is_default": false,
          "select_options": ["1st Year", "2nd Year", "3rd Year", "4th Year"]
        }
      ]
    }
  }
  ```

---

## 3. Student Registration Workflow

### Register Student (Public)
Submit the answers inside the `responses` block mapping directly to `field_name` keys. `email` and `registerNumber` are default identifiers.
- **Endpoint**: `POST /api/events/:eventId/register`
- **Payload**:
  ```json
  {
    "email": "sam.dev@gmail.com",
    "registerNumber": "917722104050",
    "responses": {
      "Name": "Sam Devaraja",
      "Email": "sam.dev@gmail.com",
      "Register Number": "917722104050",
      "Department": "Computer Science",
      "Year": "3rd Year",
      "Phone Number": "9876543210"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Registration completed successfully",
    "data": {
      "registrationId": "58f4a13d-be66-41e9-a46e-1d54238e83be",
      "ticketId": "0bc8a0d9-e41d-4e31-89f4-3635730c8000",
      "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
    }
  }
  ```

---

## 4. Attendance Check-in / Check-out Workflow

QR code tickets encode a JSON payload structure:
```json
{
  "ticketId": "0bc8a0d9-e41d-4e31-89f4-3635730c8000",
  "eventId": "b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  "registrationId": "58f4a13d-be66-41e9-a46e-1d54238e83be"
}
```

### Scan Check-In (Admin Only)
- **Endpoint**: `POST /api/attendance/checkin`
- **Payload**:
  ```json
  {
    "ticketId": "0bc8a0d9-e41d-4e31-89f4-3635730c8000",
    "eventId": "b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22"
  }
  ```
- **Alternate (Manual Entry Fallback)**:
  ```json
  {
    "emailOrRegNo": "917722104050",
    "eventId": "b1eedc99-9c0b-4ef8-bb6d-6bb9bd380a22"
  }
  ```

### Scan Check-Out (Admin Only)
*Must follow check-in, otherwise fails.*
- **Endpoint**: `POST /api/attendance/checkout`
- **Payload**: Same schema as check-in.

---

## 5. Safe Export & Archive Workflow

Archive operations utilize a safe two-step workflow preventing accidental deletes:

1. **Generate Export**: Admin downloads file via GET. File registers in database as status `EXPORTED`.
2. **Confirm Download**: Admin client hits `/confirm` with the file metadata log ID. This automatically transfers the active data rows to archive tables (`archived_registrations`/`archived_attendance`), sets `is_archived = true` on the main tables, and changes log status to `CONFIRMED`.

### Confirm Download & Trigger Archive
- **Endpoint**: `POST /api/events/:eventId/export/confirm`
- **Payload**:
  ```json
  {
    "exportLogId": "d3eedc99-9c0b-4ef8-bb6d-6bb9bd380a44"
  }
  ```
- **Response**: Returns the details of the created `archive_logs` entry.

### Revert Archiving (Rollback)
Restores archived registration and attendance records to active status.
- **Endpoint**: `POST /api/events/:eventId/archive/rollback`
- **Payload**:
  ```json
  {
    "archiveLogId": "e4eedc99-9c0b-4ef8-bb6d-6bb9bd380a55"
  }
  ```

---

## 6. Statistics API

Provides real-time event analytics dashboards.
- **Endpoint**: `GET /api/events/:eventId/stats`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Event statistics retrieved successfully",
    "data": {
      "totalRegistrations": 105,
      "checkedIn": 82,
      "checkedOut": 45,
      "remainingSeats": 45
    }
  }
  ```
