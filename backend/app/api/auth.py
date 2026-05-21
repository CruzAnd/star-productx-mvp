from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.core.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. Search user by email (username in OAuth2PasswordRequestForm is the email)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # 2. Validate existence and password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create JWT token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # 4. Return the token (Standard OAuth2 format)
    return {"access_token": access_token, "token_type": "bearer"}