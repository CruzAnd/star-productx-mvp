import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Cargar variables del archivo .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Real conn management load database using engine
engine = create_engine(DATABASE_URL)

# Local section use each call to  API
SesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This Class is base for all model Class (tables)


class Base(DeclarativeBase):
    pass
# Dependency function to get section on Database - endpoints


def get_db():
    db = SesionLocal()
    try:
        yield db
    finally:
        db.close()
