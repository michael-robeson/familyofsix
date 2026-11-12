import asyncio
import uuid
from collections.abc import Iterator
from datetime import UTC, datetime, timedelta
from typing import Any
from unittest.mock import Mock

import httpx
from sqlalchemy.orm import Session

from app.database import get_db
from app.main import app
from app.models.product import Product


def request_products(db: Any) -> httpx.Response:
    def override_get_db() -> Iterator[Any]:
        yield db

    previous_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db

    async def get_response() -> httpx.Response:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://testserver",
        ) as client:
            return await client.get("/api/products")

    try:
        return asyncio.run(get_response())
    finally:
        if previous_override is None:
            app.dependency_overrides.pop(get_db, None)
        else:
            app.dependency_overrides[get_db] = previous_override


def test_products_returns_published_products_and_fields(
    database_session: Session,
) -> None:
    suffix = uuid.uuid4()
    published = Product(
        name="API Test Published",
        slug=f"api-test-published-{suffix}",
        description="A published catalog test item.",
        category="Test",
        base_price_cents=2575,
        currency="USD",
        status="published",
        is_customizable=True,
    )
    draft = Product(
        name="API Test Draft",
        slug=f"api-test-draft-{suffix}",
        category="Test",
        base_price_cents=100,
        status="draft",
    )
    archived = Product(
        name="API Test Archived",
        slug=f"api-test-archived-{suffix}",
        category="Test",
        base_price_cents=200,
        status="archived",
    )
    database_session.add_all([published, draft, archived])
    database_session.flush()

    response = request_products(database_session)

    assert response.status_code == 200
    response_products = response.json()
    response_ids = {item["id"] for item in response_products}
    published_response = next(
        item for item in response_products if item["id"] == str(published.id)
    )

    assert str(draft.id) not in response_ids
    assert str(archived.id) not in response_ids
    assert published_response == {
        "id": str(published.id),
        "slug": published.slug,
        "name": published.name,
        "description": published.description,
        "category": published.category,
        "base_price_cents": 2575,
        "currency": "USD",
        "is_customizable": True,
    }


def test_products_are_ordered_deterministically(
    database_session: Session,
) -> None:
    now = datetime.now(UTC)
    products = [
        Product(
            name=name,
            slug=f"api-order-{name.lower()}-{uuid.uuid4()}",
            category="Test",
            base_price_cents=100,
            status="published",
            created_at=now + timedelta(seconds=index),
        )
        for index, name in enumerate(("Zebra API Test", "Alpha API Test"))
    ]
    database_session.add_all(products)
    database_session.flush()

    first_response = request_products(database_session)
    second_response = request_products(database_session)

    assert first_response.status_code == 200
    first_products = first_response.json()
    assert first_products == second_response.json()
    assert [(item["name"], item["id"]) for item in first_products] == sorted(
        (item["name"], item["id"]) for item in first_products
    )


def test_products_returns_empty_array_when_catalog_is_empty() -> None:
    empty_db = Mock()
    empty_db.scalars.return_value.all.return_value = []

    response = request_products(empty_db)

    assert response.status_code == 200
    assert response.json() == []
