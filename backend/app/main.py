from fastapi import FastAPI
from app.core.database import engine, Base
from app.models import user # Important to know the model exist to create the tables
from app.api.users import router as users_router # New import for the users router
from app.api.auth import router as auth_router # Import

# Create the tables in the database if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="STARPRODUCTX API")

#Router registration
app.include_router(users_router)

@app.get("/")
def read_root():
    return {"message": "API de STARPRODUCTX LLC funcionando correctamente"}

# rest of the imports and code...
app.include_router(auth_router) # Register 
app.include_router(users_router)