from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.hosted_zone import (
    HostedZoneType,
    HostedZoneCreate,
    HostedZoneUpdate,
    HostedZoneResponse,
    HostedZoneListResponse,
)
from app.services.hosted_zone import HostedZoneService

router = APIRouter()


@router.get("", response_model=HostedZoneListResponse)
def list_hosted_zones(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by hosted zone name"),
    type: Optional[HostedZoneType] = Query(None, description="Filter by hosted zone type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneListResponse:
    zone_type = type.value if type else None
    return HostedZoneService.list_hosted_zones(
        db=db,
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search,
        zone_type=zone_type,
    )


@router.post("", response_model=HostedZoneResponse, status_code=status.HTTP_201_CREATED)
def create_hosted_zone(
    zone_in: HostedZoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneResponse:
    return HostedZoneService.create_hosted_zone(
        db=db,
        zone_in=zone_in,
        user_id=current_user.id,
    )


@router.get("/{zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(
    zone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneResponse:
    zone = HostedZoneService.get_hosted_zone(db=db, zone_id=zone_id, user_id=current_user.id)
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone with ID {zone_id} not found",
        )
    return zone


@router.put("/{zone_id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    zone_id: int,
    zone_in: HostedZoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HostedZoneResponse:
    zone = HostedZoneService.update_hosted_zone(
        db=db,
        zone_id=zone_id,
        zone_in=zone_in,
        user_id=current_user.id,
    )
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone with ID {zone_id} not found",
        )
    return zone


@router.delete("/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hosted_zone(
    zone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = HostedZoneService.delete_hosted_zone(db=db, zone_id=zone_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone with ID {zone_id} not found",
        )
    return None
