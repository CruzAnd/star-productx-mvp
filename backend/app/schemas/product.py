from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import date

# Frontend sends this to create a new product (Request Model)
class ProductCreate(BaseModel):
    nombre_producto: str
    descripcion_producto: Optional[str] = None
    costo_producto: Optional[float] = None
    envio_producto: Optional[str] = None
    costo_envio: Optional[float] = None
    calificacion: Optional[float] = None
    lanzamiento: Optional[date] = None
    imagen_url: Optional[str] = None # string if we send relative path or HttpUrl if we want to validate it's a proper URL
    id_marca: int # Mandatory field to linked an existing brand

# API returns(Response Model)
class ProductOut(BaseModel):
    id_producto: int
    nombre_producto: str
    descripcion_producto: Optional[str] = None
    costo_producto: Optional[float] = None
    envio_producto: Optional[str] = None
    costo_envio: Optional[float] = None
    calificacion: Optional[float] = None
    lanzamiento: Optional[date] = None
    imagen_url: Optional[str] = None
    id_marca: int

    class Config:
        from_attributes = True