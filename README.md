# Route 53 Management Console

A full-stack AWS Route 53 clone built for the software engineering assignment. The application provides an authentic AWS Management Console experience for managing public and private DNS hosted zones and authoritative resource record sets with full CRUD support, search, type filtering, pagination, session-based authentication, and persistent SQLite storage.

---

## Live Deployment & API Endpoints

**Frontend:**  
https://aws-route53-iota.vercel.app

**Backend:**  
https://aws-route53.fastapicloud.dev

**Health checks:**
- `GET https://aws-route53.fastapicloud.dev/health`  
  Returns the backend service health status.
- `GET https://aws-route53.fastapicloud.dev/api/v1/health`  
  Returns the API v1 health status.

**FastAPI API documentation:**
- Swagger UI: https://aws-route53.fastapicloud.dev/docs
- OpenAPI schema: https://aws-route53.fastapicloud.dev/openapi.json

### API Overview

**Authentication:**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

**Hosted Zones:**
- `GET /api/v1/hosted-zones`
- `POST /api/v1/hosted-zones`
- `GET /api/v1/hosted-zones/{id}`
- `PUT /api/v1/hosted-zones/{id}`
- `DELETE /api/v1/hosted-zones/{id}`

**DNS Records:**
- `GET /api/v1/hosted-zones/{zone_id}/records`
- `POST /api/v1/hosted-zones/{zone_id}/records`
- `GET /api/v1/hosted-zones/{zone_id}/records/{record_id}`
- `PUT /api/v1/hosted-zones/{zone_id}/records/{record_id}`
- `DELETE /api/v1/hosted-zones/{zone_id}/records/{record_id}`

---

## Tech Stack

- **Frontend**:
  - Next.js 15 (App Router)
  - React 19
  - TypeScript
  - Vanilla CSS (AWS Console design system tokens; no external CSS frameworks)
- **Backend**:
  - FastAPI (Python 3.11+)
  - SQLAlchemy (ORM)
  - Pydantic v2 (Request/response validation)
  - SQLite (with `PRAGMA foreign_keys=ON`)
  - Uvicorn (ASGI server)
- **Authentication**:
  - Database-backed session tokens (`sessions` table) with 24-hour expiration

---

## Features

### Authentication
- Session-based login with pre-seeded demo credentials
- Logout invalidating the active session in the database
- Session persistence across browser reloads via token storage in `localStorage` and verification against `GET /api/v1/auth/me`
- Client-side route protection (`ProtectedRoute`) redirecting unauthenticated users to `/login`
- Development demo account auto-seeded on database initialization

### Hosted Zones
- **Create**: Add Public or Private hosted zones with domain name and optional description
- **Read**: View zone details (zone ID, domain name, type badge, record count, description, creation date)
- **Update**: Edit domain name, zone type, and description
- **Delete**: Remove a hosted zone with automatic cascade deletion of all child DNS records
- **Search**: Case-insensitive substring search by zone name
- **Filter**: Filter by zone type (`All types`, `Public`, `Private`)
- **Pagination**: Backend pagination with page limit controls and total record indicators

### DNS Records
Authoritative DNS record management nested within each hosted zone.

- **Supported Record Types** (all 9 Route 53 standard types):
  `A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`
- **Create**: Add new records with name, type selector, TTL (seconds, minimum 1), and routing value
- **Read**: Dense AWS-style records table displaying record name, mono type badge, routing target, TTL, and actions
- **Update**: Edit record name, type, TTL, and routing values
- **Delete**: Confirmation dialog displaying record details before deletion
- **Search**: 300ms debounced multi-field search matching both record name and record value
- **Filter**: Filter by record type (`All types` or any of the 9 supported types)
- **Pagination**: Backend pagination with record range counts and page controls
- **TTL Validation**: Enforced positive integers (`ttl >= 1`, default 300)

### Console Navigation
- Route 53 navigation hierarchy with category groupings:
  - **DNS Management**: Overview (`/`), Hosted zones (`/hosted-zones`)
  - **Traffic Routing**: Traffic policies (`/traffic-policies`)
  - **Monitoring**: Health checks (`/health-checks`)
  - **DNS Firewall & Resolver**: Resolver (`/resolver`), Profiles (`/profiles`)
- **Placeholder Sections**:
  The sections `/traffic-policies`, `/health-checks`, `/resolver`, and `/profiles` are clean, authentic AWS console placeholders explaining feature availability and linking back to `/hosted-zones`. They are not implemented as functional backend features.

---

## Architecture

```text
AWS ROUTE53/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py
│   │   │       │   ├── dns_records.py
│   │   │       │   ├── health.py
│   │   │       │   └── hosted_zones.py
│   │   │       └── router.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── dns_record.py
│   │   │   ├── hosted_zone.py
│   │   │   ├── session.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── dns_record.py
│   │   │   ├── health.py
│   │   │   ├── hosted_zone.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── dns_record.py
│   │   │   └── hosted_zone.py
│   │   └── main.py
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── route53.db
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── health-checks/page.tsx
│   │   │   ├── hosted-zones/
│   │   │   │   ├── [zoneId]/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── profiles/page.tsx
│   │   │   ├── resolver/page.tsx
│   │   │   ├── traffic-policies/page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── common/
│   │   │   │   └── NotificationToast.tsx
│   │   │   ├── dns-records/
│   │   │   │   ├── CreateDNSRecordModal.tsx
│   │   │   │   ├── DeleteDNSRecordModal.tsx
│   │   │   │   ├── DNSRecordTable.tsx
│   │   │   │   └── EditDNSRecordModal.tsx
│   │   │   ├── hosted-zones/
│   │   │   │   ├── CreateHostedZoneModal.tsx
│   │   │   │   ├── DeleteHostedZoneModal.tsx
│   │   │   │   └── EditHostedZoneModal.tsx
│   │   │   └── layout/
│   │   │       ├── ConsoleHeader.tsx
│   │   │       ├── ConsoleLayout.tsx
│   │   │       ├── PageContainer.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── config.ts
│   │   └── types/
│   │       └── api.ts
│   ├── .env.example
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
└── README.md
```

### Component Responsibilities

- **API Endpoints (`backend/app/api/v1/endpoints/`)**: Handle HTTP routing, validate query parameters and request bodies, invoke services, and return standardized JSON responses.
- **Services (`backend/app/services/`)**: Encapsulate business logic, database queries, search/filtering, pagination math, and entity lifecycle operations.
- **SQLAlchemy Models (`backend/app/models/`)**: Define database tables, foreign keys, cascade delete constraints, and ORM relationships.
- **Pydantic Schemas (`backend/app/schemas/`)**: Define serialization rules, data types, and validation schemas for requests and responses.
- **Authentication & Security (`backend/app/core/security.py`)**: `get_current_user` FastAPI dependency extracting session tokens from `Authorization: Bearer <token>` or `X-Session-Token` headers and validating against active database sessions.
- **Frontend Components (`frontend/src/components/`)**: Modular UI components (tables, modals, navigation, toasts) styled with pure AWS console tokens.
- **API Client (`frontend/src/lib/api-client.ts`)**: Unified client handling HTTP requests, error parsing, and Bearer token attachment.
- **Auth Context (`frontend/src/context/AuthContext.tsx`)**: React Context provider managing user state, login/logout actions, and token persistence.

---

## Database Schema

SQLite database with foreign key support enabled at connection time via `PRAGMA foreign_keys=ON`.

### Models

#### `User` (`users`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key | User ID |
| `email` | String(255) | Unique, Not Null, Indexed | Account email |
| `password` | String(255) | Not Null | Stored password |
| `created_at` | DateTime | Default UTC now | Registration timestamp |

#### `HostedZone` (`hosted_zones`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key | Zone ID |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | Owning user |
| `name` | String(255) | Not Null, Indexed | Domain name (e.g. `example.com`) |
| `type` | String(32) | Default `PUBLIC`, Not Null | Zone type (`PUBLIC` or `PRIVATE`) |
| `description` | String(255) | Nullable | Optional description |
| `created_at` | DateTime | Default UTC now | Creation timestamp |
| `updated_at` | DateTime | Default UTC now, on update UTC now | Modification timestamp |

#### `DNSRecord` (`dns_records`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key | Record ID |
| `hosted_zone_id` | Integer | Foreign Key (`hosted_zones.id`), Not Null | Parent hosted zone |
| `name` | String(255) | Not Null, Indexed | Record name (e.g. `www.example.com`) |
| `type` | String(32) | Not Null | Record type (A, AAAA, CNAME, TXT, etc.) |
| `ttl` | Integer | Default 300, Not Null | Time to Live in seconds |
| `value` | String(1024) | Not Null | Routing value / target |
| `created_at` | DateTime | Default UTC now | Creation timestamp |
| `updated_at` | DateTime | Default UTC now, on update UTC now | Modification timestamp |

#### `SessionModel` (`sessions`)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key | Session ID |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null | Authenticated user |
| `token` | String(255) | Unique, Not Null, Indexed | Opaque session token |
| `created_at` | DateTime | Default UTC now | Session creation timestamp |
| `expires_at` | DateTime | Not Null | Session expiry timestamp (24h) |

### Relationships & Cascade Behavior

- **User &rarr; HostedZones**: One-to-many relationship with `cascade="all, delete-orphan"` and foreign key `ondelete="CASCADE"`. Deleting a user removes all their hosted zones.
- **HostedZone &rarr; DNSRecords**: One-to-many relationship with `cascade="all, delete-orphan"` and foreign key `ondelete="CASCADE"`. Deleting a hosted zone automatically removes all associated DNS records.
- **User &rarr; Sessions**: One-to-many relationship with `cascade="all, delete-orphan"` and foreign key `ondelete="CASCADE"`. Deleting a user terminates all active sessions.

---

## API Overview

Base URL: `http://localhost:8000`

### Authentication
- `POST /api/v1/auth/login`: Authenticate with email/password. Returns session token and user profile.
- `POST /api/v1/auth/logout`: Invalidate current session token.
- `GET /api/v1/auth/me`: Fetch currently authenticated user from session token.

### Hosted Zones
- `GET /api/v1/hosted-zones`: List hosted zones for authenticated user with pagination, search, and type filtering.
  - Query parameters:
    - `page` (int, default: 1): Page number
    - `limit` (int, default: 10): Items per page (max: 100)
    - `search` (str, optional): Case-insensitive domain name search
    - `type` (str, optional): `PUBLIC` or `PRIVATE`
- `POST /api/v1/hosted-zones`: Create a new hosted zone.
- `GET /api/v1/hosted-zones/{zone_id}`: Fetch single hosted zone by ID with record count.
- `PUT /api/v1/hosted-zones/{zone_id}`: Update hosted zone details.
- `DELETE /api/v1/hosted-zones/{zone_id}`: Delete hosted zone and cascade delete its DNS records.

### DNS Records
- `GET /api/v1/hosted-zones/{zone_id}/records`: List records for a specific hosted zone.
  - Query parameters:
    - `page` (int, default: 1): Page number
    - `limit` (int, default: 10): Items per page (max: 100)
    - `search` (str, optional): Case-insensitive search matching record name or record value
    - `type` (str, optional): Filter by type (`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`)
- `POST /api/v1/hosted-zones/{zone_id}/records`: Create a new DNS record.
- `GET /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Fetch record by ID.
- `PUT /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Update DNS record name, type, TTL, or value.
- `DELETE /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Delete DNS record.

### Health
- `GET /health`: Root service health check.
- `GET /api/v1/health`: API health check confirming SQLite database readiness.

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Backend Setup

From the repository root:

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (runs on port 8000)
uvicorn app.main:app --reload --port 8000
```

The SQLite database file `route53.db` is initialized and seeded with the demo user on first startup.

### 2. Frontend Setup

In a separate terminal, from the repository root:

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server (runs on port 3000)
npm run dev -- --port 3000
```

Open `http://localhost:3000` in your browser.

---

## Demo Credentials

The backend automatically seeds this development account during startup:

- **Email**: `demo@route53.local`
- **Password**: `route53`

---

## Verification

The following verification suites were executed and passed:

1. **TypeScript Type Checking**:
   ```bash
   cd frontend
   npx tsc --noEmit
   ```
   Result: **Passed with 0 errors**.

2. **Next.js Production Build**:
   ```bash
   cd frontend
   npm run build
   ```
   Result: **Passed with exit code 0**. All static and dynamic routes compiled cleanly.

3. **HTTP Route Checks**:
   - `GET /` &rarr; HTTP 200
   - `GET /login` &rarr; HTTP 200
   - `GET /hosted-zones` &rarr; HTTP 200
   - `GET /hosted-zones/[zoneId]` &rarr; HTTP 200
   - `GET /traffic-policies` &rarr; HTTP 200
   - `GET /health-checks` &rarr; HTTP 200
   - `GET /resolver` &rarr; HTTP 200
   - `GET /profiles` &rarr; HTTP 200
   - Backend `GET /health` &rarr; HTTP 200
   - Backend `GET /api/v1/health` &rarr; HTTP 200

4. **Automated Integration & CRUD Workflows**:
   - Authentication flow (login, token validation, logout, invalid credentials rejection)
   - Hosted Zone full CRUD, name search, and type filtering
   - DNS Record full CRUD supporting all 9 standard types (`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`)
   - Debounced multi-field search (matching name or value)
   - Record type dropdown filtering
   - Pagination boundary checks without item overlap
   - SQLite cascade deletion (deleting a hosted zone removes its records)

### Verification Limitation Note
Automated browser session recording via Playwright could not be performed due to an external Azure CDN 404 error during browser binary download (`playwright-1.57.0-win32_x64.zip`). All application functionality, server-rendered routes, API contracts, database persistence, and TypeScript interfaces were verified through automated Node.js integration scripts, HTTP checks, and compilation tests.

---

## Assignment Scope

- **Core Implementation** (Fully functional with backend API, database persistence, and UI):
  - Session-based authentication
  - Hosted Zone management (Create, Read, Update, Delete, Search, Filter, Pagination)
  - DNS Record management (Create, Read, Update, Delete, Name/Value Search, Type Filter, Pagination)
  - All 9 supported DNS record types
  - Persistent SQLite storage with cascading relationships
  - Route 53 Management Console UI (dark header, sidebar navigation, dense data tables, modals, toast notifications)
- **Placeholder Sections** (UI console placeholders without backend services):
  - Traffic Policies (`/traffic-policies`)
  - Health Checks (`/health-checks`)
  - Resolver (`/resolver`)
  - Profiles (`/profiles`)
