from sqlalchemy import String, Integer, Text, Numeric, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from datetime import date

class Product(Base):
    __tablename__ = "productos" # Table name in Spanish
    id_producto: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre_producto: Mapped[str] = mapped_column(String(100), nullable=False)
    descripcion_producto: Mapped[str] = mapped_column(Text, nullable=True)
    costo_producto: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    envio_producto: Mapped[str] = mapped_column(String(50), nullable=True)
    costo_envio: Mapped[float] = mapped_column(Numeric(10, 2), nullable=True)
    calificacion: Mapped[float] = mapped_column(Numeric(3, 1), nullable=True)
    lanzamiento: Mapped[date] = mapped_column(Date, nullable=True)
    imagen_url: Mapped[str] = mapped_column(Text, nullable=True)
    
    # FK pointing to the Brand. id_marca is the foreign key column that references the id_marca in the marcas table.
    id_marca: Mapped[int] = mapped_column(Integer, ForeignKey("marcas.id_marca", ondelete="CASCADE"))

    # Brand relationship. Each product belongs to one brand, and each brand can have multiple products. The relationship is defined using the relationship function, which allows us to access the related Brand object from a Product instance.
    marca = relationship("Brand", back_populates="productos")
    def __repr__(self):
        return f"<Product {self.nombre_producto}>"