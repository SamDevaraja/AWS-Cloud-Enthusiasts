# Cloud Enthusiasts Registration & Attendance System Backend

A production-ready, API-first backend built using **Node.js**, **Express.js**, and **PostgreSQL (NeonDB)**. Designed for high performance under concurrency, dynamic registration forms builder, secure ticketing, and a safe, auditable archive-rollback workflow.

---

## Technical Stack
- **Runtime**: Node.js (>= 18)
- **Framework**: Express.js
- **Database**: PostgreSQL (NeonDB-ready) with connection pooling via `pg.Pool`
- **Security**: JWT authentication, password hashing via `bcrypt`, API rate-limiting via `express-rate-limit`
- **Features**: QR Ticket generation (`qrcode` package), CSV & Excel generators (`json2csv`, `exceljs`), API documentation (`swagger-ui-express`)
- **Containers**: Docker and Docker-Compose support

---

## Directory Structure
```
EventManagementBackend/
├── src/
│   ├── config/             # DB & Env Configurations
│   ├── db/                 # Migrations & Seeds
│   ├── middleware/         # Auth, Validation, Error, Rate Limiters
│   ├── controllers/        # Express Route Handlers
│   ├── routes/             # Route Definitions
│   ├── services/           # Business Logic & DB Transactions
│   ├── utils/              # Helper utilities (QR, Checksum, Response)
│   ├── docs/               # Swagger Spec
│   ├── app.js              # Express app setup
│   └── server.js           # Server listener
├── tests/                  # Jest Unit tests
├── exports/                # Exported CSVs/Excel temp storage
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
├── PostmanCollection.json
└── API_Integration_Guide.md
```

---

## Getting Started

### 1. Installation
Install the project dependencies locally:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file at the project root matching `.env.example`:
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=super_secret_jwt_key_cloud_enthusiasts_2026
JWT_EXPIRES_IN=24h
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 3. Apply Schema Migrations
Run the schema setup script to construct tables, constraints, and indexes:
```bash
npm run db:migrate
```

### 4. Seed Default Records
Populate initial cloud events, dynamic form field layouts, and the default admin user:
```bash
npm run db:seed
```
*Default Credentials:*
- **Username**: `admin`
- **Password**: `CloudEnthusiasts2026!`

### 5. Start the Server
Run the development environment using nodemon auto-reloads:
```bash
npm run dev
```
The server will start on port `5000` by default.
- **Root endpoint**: `http://localhost:5000/`
- **Interactive Swagger Docs**: `http://localhost:5000/api-docs`

---

## Running Jest Tests
Verify structural routing, schema parameters, and validation middleware:
```bash
npm test
```

---

## Running with Docker Compose
If you want to run the application alongside a local PostgreSQL instance:
```bash
docker-compose up --build -d
```
This automatically boots:
1. PostgreSQL container listening on `5432` and initializing the `cloud_enthusiasts` database.
2. Node.js backend container listening on `5000` (after waiting for Postgres health check).

---

## Key Workflows
- **Dynamic Registration Forms**: Each event loads its specific layout parameters via `GET /api/events/:eventId/form`. The client dynamically builds input components.
- **Concurreny Check**: DB transactions lock event records during student enrollment (`POST /api/events/:eventId/register`) to prevent overbooking past `max_participants`.
- **Safe Archiving**: Admin download routes log files as `EXPORTED` with SHA-256 hashes. Triggering `POST /api/events/:eventId/export/confirm` updates the log state to `CONFIRMED`, archives the registration data to archive tables, and flags rows as `is_archived = true` in active tables (Soft Delete). If there is any download issue, the admin can rollback via `POST /api/events/:eventId/archive/rollback`.
- **QR Scans**: Scanned QR codes contain `{ticketId, eventId, registrationId}` and are transmitted to `/api/attendance/checkin` or `/api/attendance/checkout` to secure attendance.
