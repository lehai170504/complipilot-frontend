# CompliPilot Frontend

CompliPilot Frontend is the Next.js web application for **CompliPilot — AI Compliance & Evidence OS**.

The frontend provides a modern SaaS dashboard for authentication, workspace selection, compliance controls, evidence management, task management, audit trail review, and end-to-end compliance operations.

---

## Tech Stack

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Cookie-based auth storage
* Lucide React icons
* React Server Components + Client Components
* Backend API: CompliPilot Spring Boot API

---

## Current Frontend Capabilities

Implemented frontend modules:

```txt
Module I — Frontend Foundation
Module J — Compliance & Evidence MVP UI
```

Completed capabilities:

```txt
Next.js App Router foundation
Tailwind CSS theme for B2B compliance SaaS
shadcn/ui component setup
TanStack Query provider
Cookie-based token storage
API client with refresh token retry
Login page
Register page
Logout flow
Protected app layout
Auth guard
Fixed SaaS sidebar
Fixed topbar
Scrollable main content only
Workspace selector
Active organization stored in cookie
Dashboard connected to backend APIs
Seed demo workspace button
Compliance controls page
Compliance status update
Compliance notes update
Evidence library page
Evidence filters
Evidence keyword search
Evidence sorting
Evidence pagination
Create URL evidence
Upload file evidence with presigned upload URL
Download file evidence with presigned download URL
Archive evidence
Tasks page connected to backend API
Audit page connected to backend API
Request ID error display
Reusable component / hook / API / type structure
```

---

## Backend Dependency

This frontend expects the CompliPilot backend to be running.

Local backend default:

```txt
http://localhost:8081
```

Backend local services:

```txt
PostgreSQL: localhost:5433
MinIO API: http://localhost:9000
MinIO Console: http://localhost:9001
```

Backend should expose:

```txt
GET  /api/v1/health
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/me
GET  /api/v1/me/organizations
```

And protected organization APIs:

```txt
Compliance APIs
Evidence APIs
Task APIs
Audit APIs
```

---

## Local Development Requirements

Install:

* Node.js 20+
* npm
* Git
* Docker Desktop
* Backend running locally
* VS Code or WebStorm

Check tools:

```powershell
node -v
npm -v
git --version
docker --version
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_ENABLE_DEMO_DEFAULTS=true
```

Create `.env.example` and commit it:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
NEXT_PUBLIC_APP_ENV=local
NEXT_PUBLIC_ENABLE_DEMO_DEFAULTS=true
```

Do not commit:

```txt
.env.local
.env.production.local
```

`.gitignore` should include:

```gitignore
.env*
!.env.example
```

---

## Install Dependencies

From frontend root:

```powershell
cd D:\GitHub\complipilot-frontend
npm install
```

Main packages used:

```txt
@tanstack/react-query
js-cookie
lucide-react
shadcn/ui
tailwindcss
```

---

## shadcn/ui Setup

This project uses shadcn/ui for reusable UI components.

Recommended init choices:

```txt
Style: New York
Base color: Slate
CSS variables: Yes
```

Common components used:

```txt
button
input
label
card
alert
badge
separator
dropdown-menu
skeleton
select
textarea
dialog
```

Add missing components:

```powershell
npx shadcn@latest add button input label card alert badge separator dropdown-menu skeleton select textarea dialog
```

---

## Run Local Development

Start backend first:

```powershell
cd D:\GitHub\complipilot-backend
docker compose up -d
.\mvnw.cmd spring-boot:run
```

Start frontend:

```powershell
cd D:\GitHub\complipilot-frontend
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Build

Run lint:

```powershell
npm run lint
```

Run production build:

```powershell
npm run build
```

Run production preview:

```powershell
npm run start
```

---

## Demo Account Flow

There is no hardcoded production account. For local development, create one through the register page.

Recommended demo data:

```txt
Full name: Lê Hoàng Hải
Organization: CompliPilot Demo Company
Email: hai+demo@example.com
Password: 12345678
```

If email already exists, use:

```txt
hai+demo1@example.com
hai+demo2@example.com
hai+demo3@example.com
```

Flow:

```txt
1. Open http://localhost:3000/register
2. Register with demo data
3. App auto logs in
4. Go to Dashboard
5. Click Seed demo workspace
6. Use Compliance / Evidence / Tasks / Audit pages
```

---

## Authentication Design

The app stores auth tokens in browser cookies:

```txt
complipilot_access_token
complipilot_refresh_token
```

Active organization is also stored in cookie:

```txt
complipilot_active_organization
```

Current implementation uses client-readable cookies through `js-cookie`.

Security note:

```txt
This is acceptable for local MVP frontend development, but production should eventually move token storage to HttpOnly Secure SameSite cookies through a backend-for-frontend or Next.js route-handler auth layer.
```

Current cookie settings:

```txt
sameSite: strict
secure: true in production
expires: 30 days
path: /
```

---

## Auth Refresh Flow

API client behavior:

```txt
1. Attach access token to protected API requests.
2. If API returns 401 and refresh token exists:
   - call POST /api/v1/auth/refresh
   - store new accessToken and refreshToken
   - retry original request once
3. If refresh fails:
   - clear auth cookies
   - redirect user to login through guard flow
```

Important rule:

```txt
Login and register requests must use auth: false so expired cookies do not block public auth endpoints.
```

---

## Request ID

Every API request sends:

```http
X-Request-Id: <generated-request-id>
```

Backend echoes request ID in errors.

Frontend displays request ID when possible, so debugging is easier:

```txt
Something went wrong
Validation failed
Request ID: 8f8a3c5d-...
```

---

## Project Structure

Recommended structure:

```txt
src
├── app
│   ├── (app)
│   │   ├── audit
│   │   ├── compliance
│   │   ├── dashboard
│   │   ├── evidence
│   │   ├── tasks
│   │   └── layout.tsx
│   ├── (auth)
│   │   ├── login
│   │   ├── register
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components
│   ├── brand
│   ├── feedback
│   ├── layout
│   └── ui
├── features
│   ├── audit
│   │   ├── api
│   │   ├── components
│   │   └── hooks
│   ├── auth
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   └── types
│   ├── compliance
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   └── constants.ts
│   ├── dashboard
│   │   └── components
│   ├── evidence
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   └── constants.ts
│   ├── organizations
│   │   ├── api
│   │   ├── hooks
│   │   └── types
│   └── tasks
│       ├── api
│       ├── components
│       └── hooks
└── lib
    ├── api
    ├── auth
    ├── config
    ├── query
    └── utils.ts
```

---

## Core App Routes

Public routes:

```txt
/
 /login
/register
```

Protected routes:

```txt
/dashboard
/compliance
/evidence
/tasks
/audit
```

Protected routes are wrapped by:

```txt
src/app/(app)/layout.tsx
src/components/layout/app-shell.tsx
src/features/auth/components/auth-guard.tsx
```

---

## Layout Behavior

The app shell is designed as a SaaS workspace:

```txt
Sidebar: fixed height
Topbar: fixed inside right column
Main content: scrollable
```

Expected behavior:

```txt
Only main content scrolls.
Sidebar and topbar remain fixed.
```

Core layout pattern:

```txt
h-screen overflow-hidden
sidebar h-screen
right column h-screen overflow-hidden
topbar shrink-0
main flex-1 overflow-y-auto
```

---

## UI / UX Direction

Design language:

```txt
B2B compliance SaaS
Trustworthy
Audit-ready
Clean dashboard layout
Slate / navy / cyan palette
Rounded cards
Clear status badges
Error states with request ID
Reusable shadcn components
```

Theme files:

```txt
src/app/globals.css
src/app/layout.tsx
```

The app uses CSS variables from shadcn/ui and a custom compliance SaaS theme.

---

## API Client

Main API client:

```txt
src/lib/api/api-client.ts
```

Responsibilities:

```txt
Base URL config
Request ID header
Authorization header
Refresh token retry
Error normalization
204 handling
```

API error class:

```txt
src/lib/api/api-error.ts
```

Types:

```txt
src/lib/api/api-types.ts
```

---

## TanStack Query

Provider:

```txt
src/lib/query/query-provider.tsx
src/app/providers.tsx
```

Usage pattern:

```txt
API functions go in features/<module>/api
Query hooks go in features/<module>/hooks
Components call hooks, not raw API functions
Mutations invalidate relevant query keys
```

Example modules:

```txt
features/auth
features/compliance
features/evidence
features/tasks
features/audit
```

---

## Backend API Contract

The frontend follows **CompliPilot FE API Contract v0.9**.

Important list APIs support:

```txt
pagination:
  page
  size

filters:
  status / priority / evidenceType / sourceType / action / resourceType

keyword search:
  q

sorting:
  sortBy
  sortDirection
```

Paginated endpoints:

```http
GET /api/v1/organizations/{organizationId}/tasks?page=0&size=20
GET /api/v1/organizations/{organizationId}/evidence?page=0&size=20
GET /api/v1/organizations/{organizationId}/audit-events?page=0&size=20
```

Response shape:

```ts
export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};
```

---

## Dashboard Page

Route:

```txt
/dashboard
```

Uses APIs:

```http
GET /api/v1/me
GET /api/v1/me/organizations
GET /api/v1/organizations/{organizationId}/compliance-summary
GET /api/v1/organizations/{organizationId}/compliance-items/due-soon
GET /api/v1/organizations/{organizationId}/compliance-items/overdue
GET /api/v1/organizations/{organizationId}/tasks/summary
GET /api/v1/organizations/{organizationId}/tasks?status=OPEN&page=0&size=5&sortBy=dueDate&sortDirection=ASC
GET /api/v1/organizations/{organizationId}/audit-events?page=0&size=5&sortBy=createdAt&sortDirection=DESC
```

Features:

```txt
Compliance readiness
Open task count
Due soon count
Overdue count
Recent open tasks
Compliance status breakdown
Recent audit events
Seed demo workspace button
```

---

## Seed Demo Workspace

The dashboard and compliance page include a seed demo workspace action.

Flow:

```txt
1. POST /api/v1/compliance/frameworks/seed/security-baseline
2. POST /api/v1/organizations/{organizationId}/compliance-frameworks/{frameworkId}/apply
3. Invalidate compliance, tasks, and audit queries
```

This creates demo compliance controls for the active organization.

---

## Compliance Page

Route:

```txt
/compliance
```

Uses APIs:

```http
GET /api/v1/organizations/{organizationId}/compliance-summary
GET /api/v1/organizations/{organizationId}/compliance-items
PATCH /api/v1/organizations/{organizationId}/compliance-items/{itemId}
```

Features:

```txt
Summary cards
Control cards
Status badge
Status update
Notes update
Due date display
Seed demo workspace if no controls
Audit invalidation after updates
```

Compliance statuses:

```txt
OPEN
IN_PROGRESS
READY_FOR_REVIEW
COMPLIANT
NON_COMPLIANT
WAIVED
```

---

## Evidence Page

Route:

```txt
/evidence
```

Uses APIs:

```http
GET    /api/v1/organizations/{organizationId}/evidence?page=0&size=10
POST   /api/v1/organizations/{organizationId}/evidence
POST   /api/v1/organizations/{organizationId}/evidence/upload-url
POST   /api/v1/organizations/{organizationId}/evidence/{evidenceId}/download-url
DELETE /api/v1/organizations/{organizationId}/evidence/{evidenceId}
```

Features:

```txt
Evidence list
Pagination
Filter by evidenceType
Filter by sourceType
Keyword search q
Sort by createdAt / updatedAt / title / evidenceType / sourceType
Create URL evidence
Upload file evidence
Download file evidence
Archive evidence
```

Evidence source types:

```txt
FILE
URL
TEXT_NOTE
```

Evidence types:

```txt
POLICY
PROCEDURE
SCREENSHOT
REPORT
CONTRACT
CERTIFICATE
AUDIT_NOTE
OTHER
```

---

## Evidence Upload Flow

File upload uses presigned URL flow.

Frontend flow:

```txt
1. User selects file
2. Frontend calls POST /evidence/upload-url
3. Backend returns objectKey and uploadUrl
4. Frontend PUTs file directly to uploadUrl
5. Frontend calls POST /evidence with metadata and fileObjectKey
6. Evidence list refreshes
```

Upload URL request body:

```json
{
  "filename": "mfa-screenshot.png",
  "contentType": "image/png",
  "fileSizeBytes": 12345
}
```

Important:

```txt
Backend expects filename, not fileName.
```

File size limit in UI:

```txt
10MB
```

---

## Evidence Download Flow

File download uses presigned GET URL.

Frontend flow:

```txt
1. User clicks Download
2. Frontend calls POST /evidence/{evidenceId}/download-url
3. Backend returns downloadUrl
4. Frontend opens downloadUrl in a new tab
```

This avoids fetching the file through the frontend API client.

---

## Tasks Page

Route:

```txt
/tasks
```

Uses APIs:

```http
GET    /api/v1/organizations/{organizationId}/tasks?page=0&size=20
GET    /api/v1/organizations/{organizationId}/tasks/summary
POST   /api/v1/organizations/{organizationId}/tasks
PATCH  /api/v1/organizations/{organizationId}/tasks/{taskId}
DELETE /api/v1/organizations/{organizationId}/tasks/{taskId}
```

Expected features:

```txt
Task list
Pagination
Filter by status
Filter by priority
Filter by complianceItemId
Search q
Sorting
Create task
Update task
Delete task
Task summary
```

Task statuses:

```txt
OPEN
IN_PROGRESS
DONE
CANCELLED
```

Task priorities:

```txt
LOW
MEDIUM
HIGH
CRITICAL
```

---

## Audit Page

Route:

```txt
/audit
```

Uses API:

```http
GET /api/v1/organizations/{organizationId}/audit-events?page=0&size=20
```

Features:

```txt
Audit event list
Pagination
Filter by action
Filter by resourceType
Keyword search q
Sorting
Recent system activity review
```

Audit events include:

```txt
COMPLIANCE_FRAMEWORK_APPLIED
COMPLIANCE_ITEM_CREATED
COMPLIANCE_ITEM_UPDATED
EVIDENCE_DOCUMENT_CREATED
EVIDENCE_DOCUMENT_UPDATED
EVIDENCE_DOCUMENT_ARCHIVED
EVIDENCE_LINK_CREATED
EVIDENCE_LINK_DELETED
COMPLIANCE_TASK_CREATED
COMPLIANCE_TASK_UPDATED
COMPLIANCE_TASK_DELETED
```

---

## Workspace State

Active organization is selected from memberships returned by:

```http
GET /api/v1/me/organizations
```

Stored in cookie:

```txt
complipilot_active_organization
```

If stored organization no longer exists in memberships, app falls back to the first available organization.

Permission helper:

```txt
canManageCompliance = OWNER / ADMIN / COMPLIANCE_MANAGER
```

---

## Common Troubleshooting

### Login returns “Access token expired”

Cause:

```txt
Expired token cookie was attached to /auth/login.
```

Fix:

```txt
Auth endpoints must call apiClient with auth: false.
Login should clear old auth cookies before sending request.
```

Also clear browser cookies manually once:

```txt
complipilot_access_token
complipilot_refresh_token
complipilot_active_organization
```

---

### Hydration mismatch in protected routes

Cause:

```txt
AuthGuard reads browser cookies during initial render.
```

Fix:

```txt
AuthGuard must wait until client mounted before reading cookies.
Render a stable loading screen before mounted.
```

---

### Upload URL returns filename must not be blank

Cause:

```txt
Frontend sent fileName instead of filename.
```

Correct request body:

```json
{
  "filename": "example.pdf",
  "contentType": "application/pdf",
  "fileSizeBytes": 12345
}
```

---

### Upload URL returns 500

Likely backend / MinIO issue:

```txt
MinIO not running
Bucket missing
Wrong MinIO credentials
Wrong MINIO_ENDPOINT
Wrong MINIO_PUBLIC_ENDPOINT
```

Check:

```powershell
cd D:\GitHub\complipilot-backend
docker compose ps
```

Open MinIO:

```txt
http://localhost:9001
```

Credentials:

```txt
Username: complipilot
Password: complipilot_minio_password
```

Bucket should exist:

```txt
complipilot-evidence
```

---

### MinIO upload CORS issue

If browser blocks PUT to MinIO, configure bucket CORS.

Expected local public endpoint:

```env
MINIO_PUBLIC_ENDPOINT=http://localhost:9000
```

Backend local Maven should use:

```env
MINIO_ENDPOINT=http://localhost:9000
```

Backend Docker should use internal service endpoint.

---

### Frontend cannot call backend

Check `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

Check backend health:

```powershell
Invoke-RestMethod http://localhost:8081/api/v1/health
```

Check CORS backend env:

```env
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## Development Commands

Run dev:

```powershell
npm run dev
```

Lint:

```powershell
npm run lint
```

Build:

```powershell
npm run build
```

Start production build:

```powershell
npm run start
```

Git status:

```powershell
git status
```

Commit:

```powershell
git add .
git commit -m "message"
git push
```

---

## Pre-Commit Checklist

Before pushing:

```powershell
npm run lint
npm run build
git status
```

Manual test:

```txt
Register
Login
Seed demo workspace
Dashboard
Compliance update
Evidence create URL
Evidence upload file
Evidence download file
Evidence archive
Tasks page
Audit page
Logout
Login again
Refresh protected routes
```

---

## Production Checklist

Before deploying frontend:

```txt
Set NEXT_PUBLIC_API_BASE_URL to deployed backend URL
Set NEXT_PUBLIC_APP_ENV=production
Disable or hide demo defaults if needed
Run npm run build
Verify no localhost hardcoded outside env
Verify auth cookie secure=true in production
Verify backend CORS allows frontend domain
Verify upload/download works with production object storage
Verify error requestId is visible
Verify protected routes redirect correctly
```

Recommended production env:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_DEMO_DEFAULTS=false
```

---

## Deployment

Recommended deployment:

```txt
Frontend: Vercel
Backend: Render
Database: Neon PostgreSQL or Render PostgreSQL
Object Storage: S3-compatible storage / MinIO-compatible provider
```

Vercel environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_DEMO_DEFAULTS=false
```

Backend must allow Vercel origin:

```env
APP_CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## Current MVP Status

Completed:

```txt
Backend contract integration
Cookie auth
Refresh token flow
Protected SaaS shell
Workspace state
Dashboard
Compliance controls
Evidence library
Evidence URL creation
Evidence file upload
Evidence file download
Evidence archive
Tasks page
Audit page
shadcn reusable UI
TanStack Query server state
Request ID error handling
```

Recommended next work:

```txt
J1 — Link evidence to compliance item
J2 — Compliance item detail page
J3 — Evidence detail drawer
J4 — Task detail drawer
J5 — Audit event metadata viewer
J6 — Report export
J7 — Production deployment
J8 — HttpOnly cookie auth layer
J9 — AI evidence extraction
```
