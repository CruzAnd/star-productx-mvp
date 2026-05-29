from fastapi import FastAPI
from app.core.database import engine, Base
from app.models import user, client, brand,product, master_milestone, brand_tracking # Important to know the model exist to create the tables
from app.api.users import router as users_router # New import for the users router
from app.api.auth import router as auth_router # Import
from app.api.clients import router as clients_router # Import for clients router
from app.api.brands import router as brands_router # Import for brands router
from app.api.products import router as products_router # Import for products router
from app.api.tracking import router as tracking_router # Import for tracking router

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
app.include_router(clients_router) # Register the clients router
app.include_router(brands_router) # Register the brands router
app.include_router(products_router) # Register the products router
app.include_router(tracking_router) # Register the tracking router