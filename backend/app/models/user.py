from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str]= mapped_column(String(150), unique=True, index=True,nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String(20),default="cliente") # Rol admin or client
    is_active: Mapped[bool] = mapped_column(Boolean,default=True)

    def __repr__(self):
        return f"<User {self.email}>"


 


