from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.core.security import get_password_hash
from app.api.deps import get_current_user # Import new dependency

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    New user register.
    """
    # 1.Verify if the email is already registered
    user_exists = db.query(User).filter(User.email == user_in.email).first()
    if user_exists:
        raise HTTPException(
            status_code=400,
            detail="El correo electrónico ya está registrado."
        )

    # 2. Hashear the pasword before saving it to the database
    hashed_pass = get_password_hash(user_in.password)

    # 3. Create the instance of the SQLAlchemy model
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hashed_pass,
        role=user_in.role
    )

    # 4. Save on the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/me", response_model=UserOut)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Returns the information of the authenticated user based on the token.
    """
    return current_user