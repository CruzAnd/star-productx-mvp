from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class MasterMilestone(Base):
    __tablename__ = "hitos_maestros"

    id_hito: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre_hito: Mapped[str] = mapped_column(String(100), nullable=False)
    orden: Mapped[int] = mapped_column(Integer, nullable=False)
    tipologia_aplicable: Mapped[str] = mapped_column(String(50), nullable=True)

    # Relation one to many with BrandTracking table.
    seguimientos = relationship("BrandTracking", back_populates="hito_maestro")

    def __repr__(self):
        return f"<MasterMilestone {self.orden} - {self.nombre_hito}>"