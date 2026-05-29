from sqlalchemy import Integer, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from datetime import datetime

class BrandTracking(Base):
    __tablename__ = "seguimiento_marcas"

    id_seguimiento: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_marca: Mapped[int] = mapped_column(Integer, ForeignKey("marcas.id_marca", ondelete="CASCADE"))
    id_hito: Mapped[int] = mapped_column(Integer, ForeignKey("hitos_maestros.id_hito"))
    estado_completado: Mapped[bool] = mapped_column(Boolean, default=False)
    fecha_actualizacion: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Inverse relationships to entitties Brand and MasterMilestone
    marca = relationship("Brand", back_populates="seguimientos")
    hito_maestro = relationship("MasterMilestone", back_populates="seguimientos")

    def __repr__(self):
        return f"<BrandTracking Marca: {self.id_marca} - Hito: {self.id_hito} - OK: {self.estado_completado}>"