from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.brand_tracking import BrandTracking
from app.models.brand import Brand
from app.schemas.tracking import BrandTrackingOut, BrandTrackingUpdate
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/tracking", tags=["Tracking"])

@router.get("/brand/{id_marca}", response_model=List[BrandTrackingOut])
def get_brand_tracking(id_marca: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get full line of time and the status of the milestones for a specific brand. 
    This endpoint is used to visualize the progress of a brand in the frontend, 
    showing which milestones have been completed and which are pending.
    """
    # Verify the existence of the brand
    brand = db.query(Brand).filter(Brand.id_marca == id_marca).first()
    if not brand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="La marca especificada no existe.")
    
    # Return hierarchical milestone arranged by order, with the completion status for the specified brand
    tracking_list = db.query(BrandTracking).filter(BrandTracking.id_marca == id_marca).all()
    return tracking_list

@router.put("/{id_seguimiento}", response_model=BrandTrackingOut)
def update_milestone_status(
    id_seguimiento: int, 
    tracking_in: BrandTrackingUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Allows the administrator to mark a marketing milestone as completed or pending.
    """
    tracking_record = db.query(BrandTracking).filter(BrandTracking.id_seguimiento == id_seguimiento).first()
    if not tracking_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El registro de seguimiento no existe.")
    
    # Update the completion status of the milestone for the brand
    tracking_record.estado_completado = tracking_in.estado_completado
    db.commit()
    db.refresh(tracking_record)
    return tracking_record