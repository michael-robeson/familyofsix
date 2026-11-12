from dataclasses import dataclass

from sqlalchemy.engine import make_url
from sqlalchemy import select

from app.database import get_database_url, get_session_factory
from app.models.product import Product


@dataclass(frozen=True)
class SampleProduct:
    slug: str
    name: str
    description: str
    category: str
    base_price_cents: int
    is_customizable: bool = False


# Explicit development sample data copied from the Phase 1C storefront catalog.
SAMPLE_PRODUCTS = (
    SampleProduct(
        "custom-t-shirt",
        "Custom T-Shirt",
        "A comfy everyday tee with your own personal touch. Choose a color, fit, size, and design to make it yours.",
        "Wearables",
        2400,
        True,
    ),
    SampleProduct(
        "custom-sweatshirt",
        "Custom Sweatshirt",
        "A cozy layer, made special just for you. Pick from our sample colors, sizes, and designs.",
        "Wearables",
        4200,
        True,
    ),
    SampleProduct(
        "custom-hoodie",
        "Custom Hoodie",
        "Your new favorite hoodie with a custom detail. Select from available sample combinations.",
        "Wearables",
        4800,
        True,
    ),
    SampleProduct(
        "handmade-tote-bag",
        "Handmade Tote Bag",
        "A roomy, reusable companion for everyday outings.",
        "Bags & Wearables",
        3200,
    ),
    SampleProduct(
        "scrunchie-set",
        "Scrunchie Set",
        "A cheerful little set to add color to your day.",
        "Accessories",
        1400,
    ),
    SampleProduct(
        "leather-keyring",
        "Leather Keyring",
        "A small, thoughtful detail for keys and bags.",
        "Accessories",
        1200,
    ),
    SampleProduct(
        "patchwork-scarf",
        "Patchwork Scarf",
        "A colorful, one-of-a-kind accent for cooler days.",
        "Wearables",
        3600,
    ),
)


def verify_development_database() -> None:
    database_url = make_url(get_database_url())
    if (
        database_url.drivername != "postgresql+psycopg"
        or database_url.host not in {"127.0.0.1", "localhost"}
        or database_url.port not in {None, 5432}
        or database_url.database != "familyofsix"
        or database_url.username != "familyofsix_app"
    ):
        raise RuntimeError(
            "Refusing to seed: DATABASE_URL must target the local "
            "familyofsix database as familyofsix_app."
        )


def seed_sample_products() -> tuple[int, int]:
    verify_development_database()
    session_factory = get_session_factory()
    inserted = 0
    existing = 0

    with session_factory.begin() as session:
        for sample in SAMPLE_PRODUCTS:
            product = session.scalar(
                select(Product).where(Product.slug == sample.slug)
            )
            if product is not None:
                existing += 1
                continue

            session.add(
                Product(
                    slug=sample.slug,
                    name=sample.name,
                    description=sample.description,
                    category=sample.category,
                    base_price_cents=sample.base_price_cents,
                    currency="USD",
                    status="published",
                    is_customizable=sample.is_customizable,
                )
            )
            inserted += 1

    return inserted, existing


def main() -> None:
    inserted, existing = seed_sample_products()
    print(
        f"Sample catalog seed complete: inserted {inserted}; "
        f"left {existing} existing products unchanged."
    )


if __name__ == "__main__":
    main()
