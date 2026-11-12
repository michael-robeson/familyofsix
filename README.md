# FamilyOfSix

FamilyOfSix is an e-commerce application for a family-owned handmade-goods business.
The frontend and backend are separate applications: the React frontend presents the
store experience, while FastAPI owns pricing, validation, order creation, payments,
and other business rules.

## Architecture

- **Frontend:** React, TypeScript, and Vite (`frontend/`)
- **Backend:** Python FastAPI (`backend/`)
- **Database:** PostgreSQL with SQLAlchemy 2 and Alembic
- **Product images:** Google Cloud Storage
- **Payments:** Stripe-hosted Checkout with verified webhooks
- **Admin authentication:** Firebase Authentication
- **Production:** Firebase Hosting, Cloud Run, and managed PostgreSQL on GCP

The backend provides a database-independent health endpoint and a published
product catalog API backed by PostgreSQL. The frontend fetches catalog data from
the API; sample product presentation details and client-side cart behavior remain
local to the frontend. Cloud integrations and order processing are not
implemented yet.

## Local development

Requirements: Node.js, npm, and Python 3.12 or newer.

### Frontend

From the repository root:

```sh
cd frontend
npm install
npm run dev
```

Vite prints the local URL after startup. In the frontend directory, run:

```sh
npm run build
npm run lint
```

### Backend

From the repository root:

```sh
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements-dev.txt
```

Configure local PostgreSQL and `DATABASE_URL` as described in
[backend/README.md](./backend/README.md), then apply migrations and run the API:

```sh
.venv/bin/alembic upgrade head
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The health endpoint is at `http://127.0.0.1:8000/api/health` and remains
independent of database availability. Run backend tests from `backend/` with:

```sh
.venv/bin/python -m pytest
```

### Run both applications

Use two terminals: start the backend using its Uvicorn command above, then start
the frontend with `cd frontend && npm run dev`. Vite proxies `/api` requests to
the API on port 8000, and the storefront footer indicates API availability.

## Planned implementation phases

1. **Phase 1A — Project scaffolding:** Set up the frontend and repository structure.
2. **Phase 1B — Storefront layout:** Build the customer-facing storefront.
3. **Phase 1C — Product details:** Add product customization and the sample cart.
4. **Phase 2A — Backend foundation:** Set up FastAPI, health checks, and local API
   development.
5. **Phase 2B — Persistence foundation:** Add SQLAlchemy, Alembic, and the initial
   PostgreSQL product schema.
6. **Phase 2C — Product catalog API:** Serve published products from PostgreSQL
   and connect the storefront to the API.
7. **Future — Product images:** Add image storage with Google Cloud Storage.
8. **Future — Orders and payments:** Add server-owned pricing and order rules,
   Stripe-hosted Checkout, and verified webhooks.
9. **Future — Administration:** Add Firebase Authentication for admin access.
10. **Future — Production deployment:** Deploy the frontend to Firebase Hosting and
   the API to Cloud Run, backed by managed PostgreSQL on GCP.

Phases 1A–1C and 2A–2C are implemented. The backend does not yet include
administrative product management, authentication, payment processing, or cloud
integrations.
