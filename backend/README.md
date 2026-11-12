# FamilyOfSix API

The backend is a FastAPI service with an independent health endpoint and a
PostgreSQL-backed product catalog. `GET /api/health` does not connect to the
database.

## Requirements

Python 3.12 or newer and a local PostgreSQL server/database.

## Create the virtual environment and install dependencies

From the repository root:

```sh
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements-dev.txt
```

The runtime dependencies include FastAPI, Uvicorn, Pydantic, SQLAlchemy 2,
Alembic, psycopg 3 with its binary extra, and python-dotenv. Test dependencies
include pytest and httpx.

## Shared local PostgreSQL and DATABASE_URL

FamilyOfSix uses the existing local `robecruit-db-1` PostgreSQL container. Start
that container from the repository root and wait for PostgreSQL to accept
connections:

```sh
docker start robecruit-db-1
docker exec robecruit-db-1 pg_isready -h 127.0.0.1 -p 5432
```

The shared PostgreSQL server keeps the applications isolated in separate
databases and roles. FamilyOfSix uses database `familyofsix` and login role
`familyofsix_app`; that role owns only the FamilyOfSix database and has no
superuser, database-creation, or role-creation privileges. Do not use the
Robecruit application role for FamilyOfSix.

Copy `.env.example` to `.env` in `backend/` and configure `DATABASE_URL` for the
FamilyOfSix database and application role:

```sh
cp .env.example .env
```

The application and Alembic load `backend/.env` when database configuration is
used. `DATABASE_URL` can also be exported in the shell. The URL must use the
`postgresql+psycopg://` driver. Keep the local `.env` private; it is ignored by
Git. Do not put credentials in documentation or commit them.

## Run the API

From the `backend/` directory:

```sh
.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The health endpoint is available at `http://127.0.0.1:8000/api/health`.
The health endpoint remains available even when PostgreSQL is stopped or
`DATABASE_URL` is unset.

## Apply database migrations

From `backend/`, with the shared container running and `DATABASE_URL` configured:

```sh
.venv/bin/alembic upgrade head
.venv/bin/alembic current
```

To create a future migration after changing SQLAlchemy models:

```sh
.venv/bin/alembic revision --autogenerate -m "describe the schema change"
```

Review generated migrations before applying them. The initial migration creates
the `products` table only.

## Development sample catalog

After confirming that `DATABASE_URL` targets the local `familyofsix` database
as `familyofsix_app`, run the seed command from `backend/`:

```sh
.venv/bin/python -m app.seed
```

The command inserts the seven clearly documented development sample products
with stable slugs and placeholder prices. It refuses to run unless its target is
the local `familyofsix` database on port 5432 as `familyofsix_app`. It inserts
only missing slugs: rerunning it leaves existing records, including manually
edited records, unchanged and never deletes products. The seed does not run on
application startup.

With the API running, retrieve the published catalog:

```sh
curl http://127.0.0.1:8000/api/products
```

To confirm sample records are present, run the seed command and inspect the
returned catalog. The API returns published products only; no records means it
returns an empty JSON array:

```sh
curl --fail http://127.0.0.1:8000/api/products
```

Sample prices are for development display only. The future order API must
validate selections and calculate authoritative prices.

## Run backend tests

From `backend/`, after applying migrations to the FamilyOfSix database:

```sh
.venv/bin/python -m pytest
```

PostgreSQL integration tests use `TEST_DATABASE_URL` when set, otherwise they
use `DATABASE_URL`. Each test runs inside a transaction that is rolled back;
tests do not drop tables or commit test products. Tests connect as
`familyofsix_app` to the FamilyOfSix database and do not access or modify
Robecruit's database. If no PostgreSQL URL is set or the database cannot be
reached, database tests are skipped with a reason. Use a local development/test
database, not a production database.

## Run frontend and backend together

Use two terminals. In the first, start the API with the command above. In the
second, from the repository root:

```sh
cd frontend
npm run dev
```

Vite forwards requests under `/api` to the local API at `http://127.0.0.1:8000`.
The storefront footer reports whether the health endpoint is reachable.

## Troubleshooting

- **Connection refused:** Start `robecruit-db-1` and confirm PostgreSQL is
  accepting connections on port 5432. No service or container is started
  automatically by the application.
- **Database does not exist:** Create the local database, then retry the
  migration command. The application does not create databases.
- **Authentication failed:** Check the local role/password and URL-encode
  reserved characters in credentials.
- **Missing `DATABASE_URL`:** Copy `.env.example` to `.env` and set the URL, or
  export `DATABASE_URL` before running migrations or database tests.
- **Migration table missing:** Apply `.venv/bin/alembic upgrade head` before
  persistence tests.
