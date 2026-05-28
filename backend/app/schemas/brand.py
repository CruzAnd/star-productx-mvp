from pydantic import BaseModel
from typing import Optional

# Frontend send when create a new brand
class BrandCreate(BaseModel):
    nombre_marca: str
    id_empresa: int # Mandatory to link the brand to a specific client (empresa)

# API returns (Response model) when request brand info
class BrandOut(BaseModel):
    id_marca: int
    nombre_marca: str
    id_empresa: int

    class Config:
        from_attributes = True # Pydantic understands how to read SQLAlchemy objects and convert them to the schema when returning responses