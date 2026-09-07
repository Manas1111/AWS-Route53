from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, hosted_zones, dns_records

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(hosted_zones.router, prefix="/hosted-zones", tags=["hosted-zones"])
api_router.include_router(
    dns_records.router,
    prefix="/hosted-zones/{zone_id}/records",
    tags=["dns-records"],
)
