from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

# Base Class for common attributes
class UserBase(BaseModel):
    email: EmailStr
    full_name: str  
    role: Optional[str] = "cliente"  # Default role is "cliente"
    is_active: Optional[bool] = True  # Default is active

# Schema for creating a new user
class UserCreate(UserBase):
    password: str  # Plain password for user creation

# Login schema for user authentication
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for response to frontend, user views
# Not include password for security reasons
class UserOut(UserBase):
    id: int  # Include ID in response

    model_config = ConfigDict(from_attributes=True)  # Enable Pydantic to read from SQLAlchemy models