import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.product import Product


def test_database_connectivity(database_session: Session) -> None:
    assert database_session.scalar(text("SELECT 1")) == 1


def test_product_persists_and_can_be_retrieved(database_session: Session) -> None:
    slug = f"test-product-{uuid.uuid4()}"
    product = Product(
        name="Temporary Test Product",
        slug=slug,
        category="Test",
        base_price_cents=1250,
    )
    database_session.add(product)
    database_session.flush()
    product_id = product.id
    database_session.expunge_all()

    retrieved = database_session.get(Product, product_id)

    assert retrieved is not None
    assert retrieved.id == product_id
    assert retrieved.name == "Temporary Test Product"
    assert retrieved.slug == slug
    assert retrieved.currency == "USD"
    assert retrieved.status == "draft"


def test_database_rejects_negative_product_price(
    database_session: Session,
) -> None:
    product = Product(
        name="Invalid Test Product",
        slug=f"invalid-test-product-{uuid.uuid4()}",
        category="Test",
        base_price_cents=-1,
    )

    with pytest.raises(IntegrityError):
        with database_session.begin_nested():
            database_session.add(product)
            database_session.flush()
