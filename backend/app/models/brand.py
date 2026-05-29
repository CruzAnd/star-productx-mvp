from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Brand(Base):
    __tablename__ = "marcas" # Table name match in PostgreSQL

    id_marca: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre_marca: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # Forein Key aimed to clientes.id_empresa with cascade delete
    id_empresa: Mapped[int] = mapped_column(Integer, ForeignKey("clientes.id_empresa", ondelete="CASCADE"))

    # Inverse relationship each brand belongs to one client, and each client can have multiple brands
    cliente = relationship("Client", back_populates="marcas")
    # Each brand can have multiple products, and each product belongs to one brand. The relationship is defined using the relationship function, which allows us to access the related Product objects from a Brand instance.
    productos = relationship("Product", back_populates="marca", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Brand {self.nombre_marca}>"

