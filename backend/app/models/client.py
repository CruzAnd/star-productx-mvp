from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Client(Base):
    __tablename__ = "clientes" # Postgres table name

    id_empresa: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre_empresa: Mapped[str] = mapped_column(String(100), nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=True)
    direccion: Mapped[str] = mapped_column(Text, nullable=True)
    ciudad: Mapped[str] = mapped_column(String(50), nullable=True)
    correo_empresa: Mapped[str] = mapped_column(String(100), nullable=True)
    tipologia: Mapped[str] = mapped_column(String(50), nullable=True)
    usuario_amazon: Mapped[str] = mapped_column(String(100), nullable=True)
    contrasena_amazon: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # FK aiming to 'users.id'
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    # Relationship with User Model
    user = relationship("User", back_populates="clientes")

    def __repr__(self):
        return f"<Client {self.nombre_empresa}>"