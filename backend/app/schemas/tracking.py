from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schema for visualizing the master milestones in the frontend
class MasterMilestoneOut(BaseModel):
    id_hito: int
    nombre_hito: str
    orden: int
    tipologia_aplicable: Optional[str] = None

    class Config:
        from_attributes = True

# Schema for updating the tracking status of a milestone for a brand
class BrandTrackingUpdate(BaseModel):
    estado_completado: bool

# Schema for detailed output to the frontend
class BrandTrackingOut(BaseModel):
    id_seguimiento: int
    id_marca: int
    id_hito: int
    estado_completado: bool
    fecha_actualizacion: datetime
    hito_maestro: Optional[MasterMilestoneOut] = None # Injection of metadata about the milestone for frontend visualization

    class Config:
        from_attributes = True