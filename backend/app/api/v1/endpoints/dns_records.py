from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.dns_record import (
    RecordType,
    DNSRecordCreate,
    DNSRecordUpdate,
    DNSRecordResponse,
    DNSRecordListResponse,
)
from app.services.dns_record import DNSRecordService

router = APIRouter()


@router.get("", response_model=DNSRecordListResponse)
def list_records(
    zone_id: int,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by record name or value"),
    type: Optional[RecordType] = Query(None, description="Filter by record type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DNSRecordListResponse:
    rec_type = type.value if type else None
    result = DNSRecordService.list_records(
        db=db,
        zone_id=zone_id,
        user_id=current_user.id,
        page=page,
        limit=limit,
        search=search,
        record_type=rec_type,
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone with ID {zone_id} not found",
        )
    return result


@router.post("", response_model=DNSRecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    zone_id: int,
    record_in: DNSRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DNSRecordResponse:
    record = DNSRecordService.create_record(
        db=db,
        zone_id=zone_id,
        user_id=current_user.id,
        record_in=record_in,
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hosted zone with ID {zone_id} not found",
        )
    return record


@router.get("/{record_id}", response_model=DNSRecordResponse)
def get_record(
    zone_id: int,
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DNSRecordResponse:
    record = DNSRecordService.get_record(
        db=db,
        zone_id=zone_id,
        record_id=record_id,
        user_id=current_user.id,
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DNS record with ID {record_id} not found in hosted zone {zone_id}",
        )
    return record


@router.put("/{record_id}", response_model=DNSRecordResponse)
def update_record(
    zone_id: int,
    record_id: int,
    record_in: DNSRecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DNSRecordResponse:
    record = DNSRecordService.update_record(
        db=db,
        zone_id=zone_id,
        record_id=record_id,
        user_id=current_user.id,
        record_in=record_in,
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DNS record with ID {record_id} not found in hosted zone {zone_id}",
        )
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(
    zone_id: int,
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = DNSRecordService.delete_record(
        db=db,
        zone_id=zone_id,
        record_id=record_id,
        user_id=current_user.id,
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"DNS record with ID {record_id} not found in hosted zone {zone_id}",
        )
    return None
