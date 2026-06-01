# CompliPilot Frontend

CompliPilot Frontend is the Next.js web application for **CompliPilot — AI Compliance & Evidence OS**.

It provides the user interface for managing compliance controls, evidence, tasks, audit history, organization workspaces, member roles, and AI-assisted evidence review.

## Tech Stack

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* next-intl
* lucide-react
* Sonner
* Cookie-based auth tokens

## Main Features

* Authentication pages

  * Login
  * Register
  * Protected application routes

* Organization workspace management

  * Active workspace selector
  * Workspace-aware API calls
  * Role-based UI permissions

* Compliance controls

  * View compliance controls
  * Create controls from frameworks
  * Update control status and notes
  * View control details
  * Link evidence to controls

* Evidence library

  * Add URL evidence
  * Upload file evidence through presigned URLs
  * Download file evidence
  * Edit evidence metadata
  * Archive evidence
  * Search, filter, sort evidence

* AI-assisted evidence review

  * Analyze evidence with AI
  * View latest AI review
  * View AI review history
  * Re-run evidence review
  * Suggest missing evidence for a compliance control

* Compliance tasks

  * Create tasks
  * Update task status, priority, due date, and description
  * Delete tasks
  * Search, filter, sort task list

* Audit trail

  * View organization audit events
  * Search, filter, and sort audit history

* Members and roles

  * Organization members page
  * Role-based access display
  * Demo user seeding support

* Internationalization

  * English
  * Vietnamese

## Local Prerequisites

Install:

* Node.js 20+
* npm
* Docker Desktop for backend infrastructure
* Java 21 for backend
* Python 3.12 if running AI service locally without Docker

Recommended local folder structure:

```txt
D:\GitHub\
  complipilot-backend
  complipilot-frontend
  complipilot-ai-service
```

## Environment Variables

Create `.env.local` in `complipilot-frontend`.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

If your project uses a different env variable name, keep it consistent with:

```txt
src/lib/config/app-config.ts
```

The frontend should call the Spring Boot backend only.

The frontend should not call the AI service directly.

## Run Full Local Stack

Start infrastructure from backend repository:

```powershell
cd D:\GitHub\complipilot-backend

docker compose up -d --build --remove-orphans
```

This starts:

```txt
PostgreSQL
MinIO
FastAPI AI service
```

Start backend:

```powershell
cd D:\GitHub\complipilot-backend

.\mvnw.cmd spring-boot:run
```

Start frontend:

```powershell
cd D:\GitHub\complipilot-frontend

npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Useful Local URLs

```txt
Frontend:        http://localhost:3000
Backend API:     http://localhost:8081
Backend Swagger: http://localhost:8081/swagger-ui/index.html
Backend Health:  http://localhost:8081/actuator/health
AI Swagger:      http://localhost:8000/docs
AI Health:       http://localhost:8000/health
MinIO Console:   http://localhost:9001
PostgreSQL:      localhost:5433
```

## Recommended Development Flow

1. Start Docker services:

```powershell
cd D:\GitHub\complipilot-backend
docker compose up -d --build --remove-orphans
```

2. Start backend:

```powershell
cd D:\GitHub\complipilot-backend
.\mvnw.cmd spring-boot:run
```

3. Start frontend:

```powershell
cd D:\GitHub\complipilot-frontend
npm run dev
```

4. Open:

```txt
http://localhost:3000
```

## Project Structure

```txt
src/
  app/
    (auth)/
      login/
      register/
    (app)/
      dashboard/
      compliance/
      evidence/
      tasks/
      audit/
      workspaces/
    layout.tsx
    providers.tsx

  components/
    brand/
    feedback/
    layout/
    ui/

  features/
    auth/
    compliance/
    dashboard/
    evidence/
    organizations/
    tasks/

  lib/
    api/
    auth/
    config/
    validation-schemas.ts

  messages/
    en.json
    vi.json
```

## Important Frontend Concepts

### API Client

The shared API client is responsible for:

* Setting `Content-Type`
* Attaching `Authorization: Bearer <token>`
* Adding request IDs
* Refreshing access tokens on unauthorized responses
* Parsing backend error responses

Typical API calls are located in:

```txt
src/features/*/api/
```

### Query Hooks

TanStack Query hooks are located in:

```txt
src/features/*/hooks/
```

Use hooks for:

* Fetching lists
* Loading detail data
* Running mutations
* Invalidating query cache after updates

### Active Workspace

The active organization is stored locally and used by workspace-aware pages.

Important files:

```txt
src/features/organizations/api/organization-storage.ts
src/features/organizations/hooks/organization-hooks.ts
```

### Role-Based UI

UI permissions are derived from the active organization membership.

Examples:

* Owners and admins can manage members
* Compliance managers can manage controls, evidence, and tasks
* Auditors can view audit and evidence review context
* Members have limited workspace access

### Internationalization

Messages are stored in:

```txt
src/messages/en.json
src/messages/vi.json
```

When adding new UI text, add keys to both files.

Avoid hard-coded text in components when the page already uses `next-intl`.

## Key Pages

### Landing Page

```txt
/
```

Public marketing page explaining the product.

### Dashboard

```txt
/dashboard
```

Shows compliance readiness, tasks, due soon controls, overdue controls, and recent audit activity.

### Compliance

```txt
/compliance
/compliance/[itemId]
```

Used to manage controls, notes, status, linked evidence, and AI missing-evidence recommendations.

### Evidence

```txt
/evidence
```

Used to create, upload, edit, archive, download, analyze, and review evidence.

### Tasks

```txt
/tasks
```

Used to track compliance action items.

### Audit

```txt
/audit
```

Used to review audit events.

### Workspaces

```txt
/workspaces
```

Used to view and switch organizations.

## AI Workflow in Frontend

Evidence AI review flow:

```txt
Evidence card
→ Analyze evidence
→ Backend calls AI service
→ Backend saves analysis result
→ Frontend shows latest analysis
→ User can view analysis history
```

Compliance AI suggestion flow:

```txt
Compliance detail page
→ AI suggest missing evidence
→ Backend sends control + linked evidence context to AI service
→ Frontend shows coverage, missing evidence, risk, and next actions
```

## Build

Run lint:

```powershell
cd D:\GitHub\complipilot-frontend

npm run lint
```

Run production build:

```powershell
npm run build
```

## Common Issues

### Backend is not reachable

Check `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

Check backend:

```txt
http://localhost:8081/actuator/health
```

### AI buttons return backend error

Frontend calls the backend, not the AI service directly.

Check:

```txt
Backend is running on http://localhost:8081
AI service is running on http://localhost:8000
Backend app.ai.base-url points to http://localhost:8000
```

### Missing translation message

If you see an error like:

```txt
MISSING_MESSAGE
```

Add the missing key to both:

```txt
src/messages/en.json
src/messages/vi.json
```

### Token/session issues

Try logging out and logging in again.

Auth cookies are cleared during logout.

### Port 3000 already in use

Run on a different port:

```powershell
npm run dev -- -p 3001
```

Or stop the process using port 3000.

## Recommended Commit Checks

Before pushing frontend changes:

```powershell
cd D:\GitHub\complipilot-frontend

npm run lint
npm run build
```

Then commit:

```powershell
git status
git add .
git commit -m "docs: document frontend setup"
git push
```

## Related Repositories

Recommended local setup:

```txt
complipilot-backend      Spring Boot backend API and local Docker Compose
complipilot-frontend     Next.js frontend
complipilot-ai-service   FastAPI AI service
```
