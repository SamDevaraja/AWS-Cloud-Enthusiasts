-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. admins
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    registration_open TIMESTAMP NOT NULL,
    registration_close TIMESTAMP NOT NULL,
    event_banner_url TEXT,
    max_participants INTEGER NOT NULL,
    event_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CANCELLED
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. form_fields
CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    select_options JSONB DEFAULT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. registrations
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
    email VARCHAR(255) NOT NULL,
    register_number VARCHAR(100) NOT NULL,
    registration_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. registration_field_values
CREATE TABLE IF NOT EXISTS registration_field_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    field_id UUID REFERENCES form_fields(id) ON DELETE CASCADE,
    field_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    ticket_code VARCHAR(100) UNIQUE NOT NULL,
    qr_code_base64 TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    registration_id UUID UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP DEFAULT NULL,
    check_out_time TIMESTAMP DEFAULT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. export_logs
CREATE TABLE IF NOT EXISTS export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    export_type VARCHAR(50) NOT NULL, -- REGISTRATIONS_CSV, REGISTRATIONS_EXCEL, ATTENDANCE_CSV, ATTENDANCE_EXCEL
    status VARCHAR(50) DEFAULT 'EXPORTED', -- EXPORTED, CONFIRMED
    file_name VARCHAR(255) NOT NULL,
    file_checksum VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. archive_logs
CREATE TABLE IF NOT EXISTS archive_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    export_log_id UUID REFERENCES export_logs(id) ON DELETE SET NULL,
    archive_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_count INTEGER NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    metadata JSONB DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. archived_registrations
CREATE TABLE IF NOT EXISTS archived_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL,
    event_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    register_number VARCHAR(100) NOT NULL,
    registration_timestamp TIMESTAMP NOT NULL,
    form_responses JSONB NOT NULL,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. archived_attendance
CREATE TABLE IF NOT EXISTS archived_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_id UUID NOT NULL,
    registration_id UUID NOT NULL,
    ticket_id UUID NOT NULL,
    event_id UUID NOT NULL,
    check_in_time TIMESTAMP DEFAULT NULL,
    check_out_time TIMESTAMP DEFAULT NULL,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high concurrency & fast querying
CREATE INDEX IF NOT EXISTS idx_events_status_archived ON events(event_status, is_archived);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_email ON registrations(event_id, email) WHERE (is_archived = FALSE);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_regno ON registrations(event_id, register_number) WHERE (is_archived = FALSE);
CREATE INDEX IF NOT EXISTS idx_reg_field_values_reg_id ON registration_field_values(registration_id);
CREATE INDEX IF NOT EXISTS idx_tickets_reg_id ON tickets(registration_id);
CREATE INDEX IF NOT EXISTS idx_attendance_ticket_id ON attendance(ticket_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance(event_id, is_archived);

-- 12. users (Registered Club Members)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
