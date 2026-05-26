from pydantic import BaseModel, EmailStr
from typing import Optional

# Frontend send when create a new client
class ClientCreate(BaseModel):
    nombre_empresa: str
    telefono: Optional[str]= None
    direccion: Optional[str]= None
    ciudad: Optional[str] = None
    correo_empresa: Optional[EmailStr] = None
    tipologia: Optional[str] = None
    usuario_amazon: Optional[str] = None
    contrasena_amazon: Optional[str] = None

# Schema to send data to the frontend when request client info
class ClientOut(BaseModel):
    id_empresa: int
    nombre_empresa: str
    telefono: Optional[str]= None
    direccion: Optional[str]= None
    ciudad: Optional[str] = None
    correo_empresa: Optional[EmailStr] = None
    tipologia: Optional[str] = None
    id_usuario: int # shows which user(admin) created the client

class Config:
        from_attributes = True # Allows to read SQLAlchemy models