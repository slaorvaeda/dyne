# Sales & Revenue Analytics API

Node.js + Express + PostgreSQL backend.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)

## Setup

### 1. Start PostgreSQL with Docker

```bash
# From project root
docker-compose up -d

# Check it's running
docker ps
```

### 2. Create database schema (if not auto-created by Docker init)

```bash
cd backend
npm run setup-db
```

### 3. Install dependencies & run

```bash
npm install
cp .env.example .env   # optional: edit if needed
npm run dev
```

Server runs at `http://localhost:5001`. API base: `http://localhost:5001/api`.

### 4. Test

```bash
curl http://localhost:5001/api/health
```

## Environment

| Variable   | Default    | Description          |
|-----------|------------|----------------------|
| PORT      | 5001       | API server port      |
| PG_HOST   | localhost  | PostgreSQL host      |
| PG_PORT   | 5432       | PostgreSQL port      |
| PG_DATABASE | dyne_sales | Database name        |
| PG_USER   | postgres   | Database user        |
| PG_PASSWORD | postgres | Database password    |
| DATABASE_URL | —      | Full Postgres URL (Railway/Render; overrides PG_* if set) |

## Deploy to Railway (Docker)

1. Push the repo to GitHub. In Railway: **New Project** → **Deploy from GitHub** → select repo.
2. Set **Root Directory** to `backend` (if using a monorepo).
3. Add **Postgres** in Railway (Plugins / + New → Database → Postgres). Railway will set `DATABASE_URL` automatically.
4. In your backend service → **Settings** → **Build**: choose **Dockerfile** (Railway will use `backend/Dockerfile`).
5. In **Variables**, ensure:
   - `DATABASE_URL` is set (from Postgres plugin; usually auto-linked).
   - `PORT` is set by Railway; no need to add it.
6. Run DB migrations/schema once (e.g. Railway **Run Command** or a one-off job):  
   `npm run setup-db` (or run the SQL from `scripts/` against the Railway Postgres).
7. Deploy. Your API URL will be like `https://your-app.up.railway.app`. Use `https://your-app.up.railway.app/api` as the frontend `NEXT_PUBLIC_API_URL`.
