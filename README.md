# Sales & Revenue Analytics Dashboard

Machine test submission for **Full Stack Developer** at Dyne Infotech Private Limited.

A full-stack dashboard that imports sales data via CSV/Excel, stores it in PostgreSQL, and visualizes revenue trends, product-wise sales, and revenue by region with filters.

---

## Tech Stack

| Layer    | Stack                    |
|----------|--------------------------|
| Frontend | React (Next.js 16), MUI, Recharts, Redux Toolkit |
| Backend  | Node.js, Express        |
| Database | PostgreSQL              |

---

## Prerequisites

- **Node.js** 18+
- **Docker & Docker Compose** (for PostgreSQL)
- **npm** or yarn

---

## Setup & Run

### 1. Clone and install

```bash
git clone <repository-url>
cd Dyne
```

### 2. Start PostgreSQL

From the project root:

```bash
docker-compose up -d
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # optional: edit PORT, DB credentials if needed
npm run setup-db       # creates `sales` table and indexes
npm run dev            # runs API with nodemon on http://localhost:5001
```

API base: **http://localhost:5001/api**

### 4. Frontend

In a new terminal:

```bash
cd frontend
npm install
```

Create `.env.local` (optional) if the API is not on default URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Then:

```bash
npm run dev
```

Open **http://localhost:3000** in the browser.

### 5. Load sample data (optional)

Place `Dataset.xlsx` in the project root.

- **Sales** (`/sales`): from `backend` run `node scripts/seed-dataset.js`, or use Sales dashboard Upload.
- **Ratings & Reviews** (home `/`): from `backend` run `node scripts/seed-ratings.js`, or use the home page Upload with the same Excel (needs product_name, category, rating, rating_count).

Alternatively use the dashboard Upload with “Replace existing data” checked and upload the same file from the UI.

---

## Features (vs task requirements)

### Backend ✅

- RESTful API (Node.js + Express)
- PostgreSQL with `sales` table
- **Import API**: `POST /api/sales/upload` — CSV/Excel → DB (with validation and error handling)
- **Endpoints**:
  - `GET /api/sales/summary?startDate=&endDate=&category=&region=` — total sales and revenue for a period
  - `GET /api/sales/trends?startDate=&endDate=&type=daily|weekly|monthly` — sales trend (daily/weekly/monthly revenue)
  - `GET /api/sales/product-wise` — product-wise sales (supports date, category, region)
  - `GET /api/sales/region-wise` — revenue by region
  - `GET /api/sales/categories`, `GET /api/sales/regions` — filter options
- Filtering by **category** and **region** (and date range) on summary, trends, product-wise, region-wise
- Validation and error handling on all APIs

### Frontend ✅

- React dashboard (Next.js)
- MUI for styling
- **Upload**: CSV/Excel upload with “Replace existing data” option and duplicate-row handling
- **Charts** (Recharts):
  - **Line chart**: Revenue trends over time
  - **Bar chart**: Product-wise sales
  - **Pie chart**: Revenue by region
- **Filters**: Date range, category, region (applied to all data)
- Redux Toolkit for state and API calls (fetch summary, trends, product-wise, region-wise, filters, upload)
- Error handling, validation, and loading indicators (snackbar, disabled states, empty states)

---

## API quick reference

| Method | Endpoint              | Description                    |
|--------|------------------------|--------------------------------|
| POST   | /api/sales/upload      | Upload CSV/Excel (body: `file`, optional `replace=true`) |
| GET    | /api/sales/summary     | Total revenue & quantity (query: startDate, endDate, category?, region?) |
| GET    | /api/sales/trends      | Trend data (query: startDate, endDate, type=daily\|weekly\|monthly, category?, region?) |
| GET    | /api/sales/product-wise| Product-wise revenue           |
| GET    | /api/sales/region-wise | Revenue by region              |
| GET    | /api/sales/categories  | List categories                |
| GET    | /api/sales/regions     | List regions                   |

---

## Project structure

```
Dyne/
├── backend/           # Express API
│   ├── src/
│   │   ├── config/    # DB
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── index.js
│   ├── scripts/       # init.sql, setup-db, seed-dataset
│   └── package.json
├── frontend/          # Next.js app
│   ├── app/           # layout, page
│   ├── components/    # Dashboard, Filters, charts, etc.
│   ├── store/        # Redux (sales slice)
│   ├── services/      # salesApi
│   └── package.json
├── docker-compose.yml # PostgreSQL
├── Dataset.xlsx       # Reference/sample data (optional)
└── README.md          # This file
```

---

## Bonus (deployment)

- Frontend can be deployed on **Vercel** (Next.js); set `NEXT_PUBLIC_API_URL` to the backend URL.
- Backend can be deployed on **Render** or **Railway**; use their PostgreSQL or an external DB and set `PG_*` env vars.

---

**Submission deadline:** Friday, 20 February 2026
