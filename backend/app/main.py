from fastapi import FastAPI
from pydantic import BaseModel

from app.api.products import router as products_router

app = FastAPI(title="FamilyOfSix API")
app.include_router(products_router)


class HealthResponse(BaseModel):
    status: str
    service: str


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="familyofsix-api")
