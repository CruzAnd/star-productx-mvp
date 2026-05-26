from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.client import Client
from app.models.user import User
from app.schemas.client import ClientCreate, ClientOut
from app.api.deps import get_current_user # Security Guard for JWT Authentication

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.post("/", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(
    client_in: ClientCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user) # Protected with JWT
):
    """
    Create a new client associated with the authenticated admin user.
    """
    # Create the instance of the model with the data coming from the frontend, linking it to the authenticated user
    db_client = Client(
        **client_in.model_dump(),
        id_usuario=current_user.id # Linked automatically to the authenticated user
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client