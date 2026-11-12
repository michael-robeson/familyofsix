import os
from collections.abc import Generator

import pytest
from sqlalchemy import Engine, create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.database import get_database_url


@pytest.fixture
def database_session() -> Generator[Session, None, None]:
    try:
        database_url = get_database_url()
    except RuntimeError:
        pytest.skip("Set TEST_DATABASE_URL or DATABASE_URL to run PostgreSQL tests.")
    database_url = os.getenv("TEST_DATABASE_URL") or database_url
    if not database_url.startswith("postgresql+psycopg://"):
        pytest.skip("Database tests require a PostgreSQL psycopg DATABASE_URL.")

    engine: Engine = create_engine(database_url, pool_pre_ping=True)
    try:
        connection = engine.connect()
    except OperationalError as error:
        engine.dispose()
        pytest.skip(f"PostgreSQL is unavailable: {error.orig}")

    transaction = connection.begin()
    session = Session(bind=connection, autoflush=False, expire_on_commit=False)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
        engine.dispose()
