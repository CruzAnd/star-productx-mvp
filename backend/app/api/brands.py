from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.brand import Brand
from app.models.client import Client
from app.schemas.brand import BrandCreate, BrandOut
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/brands", tags=["Brands"])

@router.post("/", response_model=BrandOut, status_code=status.HTTP_201_CREATED)
def create_brand(
    brand_in: BrandCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Protected Endoint
):
    """
    Create a new brand linked to an existing company (client) in the EDR. This endpoint ensures that
      the company exists before allowing the brand to be created. If the company does not exist, 
      it returns a 404 error. If the company exists, it proceeds to create and store the brand in 
      the Postgres database.
    """
    # Validate that company really exists in the EDR before creating the brand
    client_exists = db.query(Client).filter(Client.id_empresa == brand_in.id_empresa).first()
    if not client_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La empresa con id_empresa {brand_in.id_empresa} no existe."
        )
    
    # If brands exists, create the brand in the database
    db_brand = Brand(**brand_in.model_dump())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand