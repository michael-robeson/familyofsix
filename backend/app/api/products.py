from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)) -> list[ProductResponse]:
    statement = (
        select(Product)
        .where(Product.status == "published")
        .order_by(Product.name, Product.id)
    )
    products = db.scalars(statement).all()
    return [ProductResponse.model_validate(product) for product in products]
