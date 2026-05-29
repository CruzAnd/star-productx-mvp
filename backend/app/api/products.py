from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.product import Product
from app.models.brand import Brand
from app.schemas.product import ProductCreate, ProductOut
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Protected with JWT authentication
):
    """
    it creates a new product asociated with a brand. It first checks if the brand exists in the EDR, and if it does, it saves the product in Postgres.
    """
    # Validate if the brand exists in the EDR
    brand_exists = db.query(Brand).filter(Brand.id_marca == product_in.id_marca).first()
    if not brand_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La marca con id_marca {product_in.id_marca} no existe."
        )
    
    # if it exists, save the product in Postgres
    db_product = Product(**product_in.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product