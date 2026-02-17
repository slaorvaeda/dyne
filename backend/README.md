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

### 2. Install dependencies & run

```bash
cd backend
cp .env.example .env   # optional: edit if needed
npm install
npm run dev
```

Server runs at `http://localhost:5000`. API base: `http://localhost:5000/api`.

### 3. Test

```bash
curl http://localhost:5000/api/health
```

## Environment

| Variable   | Default    | Description          |
|-----------|------------|----------------------|
| PORT      | 5000       | API server port      |
| PG_HOST   | localhost  | PostgreSQL host      |
| PG_PORT   | 5432       | PostgreSQL port      |
| PG_DATABASE | dyne_sales | Database name        |
| PG_USER   | postgres   | Database user        |
| PG_PASSWORD | postgres | Database password    |
