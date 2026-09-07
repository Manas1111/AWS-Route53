from datetime import datetime
from math import ceil
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordUpdate,
    DNSRecordResponse,
    DNSRecordListResponse,
)


class DNSRecordService:
    @staticmethod
    def get_user_zone(db: Session, zone_id: int, user_id: int) -> Optional[HostedZone]:
        return (
            db.query(HostedZone)
            .filter(HostedZone.id == zone_id, HostedZone.user_id == user_id)
            .first()
        )

    @staticmethod
    def list_records(
        db: Session,
        zone_id: int,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        record_type: Optional[str] = None,
    ) -> Optional[DNSRecordListResponse]:
        zone = DNSRecordService.get_user_zone(db, zone_id, user_id)
        if not zone:
            return None

        query = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone_id)

        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    DNSRecord.name.ilike(term),
                    DNSRecord.value.ilike(term),
                )
            )

        if record_type and record_type.strip():
            query = query.filter(DNSRecord.type == record_type.strip().upper())

        total = query.count()
        total_pages = ceil(total / limit) if total > 0 else 1
        offset = (page - 1) * limit

        records = query.order_by(DNSRecord.created_at.desc()).offset(offset).limit(limit).all()

        items = [
            DNSRecordResponse(
                id=record.id,
                hosted_zone_id=record.hosted_zone_id,
                name=record.name,
                type=record.type,
                ttl=record.ttl,
                value=record.value,
                created_at=record.created_at,
                updated_at=record.updated_at,
            )
            for record in records
        ]

        return DNSRecordListResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

    @staticmethod
    def create_record(
        db: Session,
        zone_id: int,
        user_id: int,
        record_in: DNSRecordCreate,
    ) -> Optional[DNSRecordResponse]:
        zone = DNSRecordService.get_user_zone(db, zone_id, user_id)
        if not zone:
            return None

        record = DNSRecord(
            hosted_zone_id=zone_id,
            name=record_in.name,
            type=record_in.type.value if hasattr(record_in.type, "value") else str(record_in.type),
            ttl=record_in.ttl,
            value=record_in.value,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(record)
        zone.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(record)

        return DNSRecordResponse(
            id=record.id,
            hosted_zone_id=record.hosted_zone_id,
            name=record.name,
            type=record.type,
            ttl=record.ttl,
            value=record.value,
            created_at=record.created_at,
            updated_at=record.updated_at,
        )

    @staticmethod
    def get_record(
        db: Session,
        zone_id: int,
        record_id: int,
        user_id: int,
    ) -> Optional[DNSRecordResponse]:
        zone = DNSRecordService.get_user_zone(db, zone_id, user_id)
        if not zone:
            return None

        record = (
            db.query(DNSRecord)
            .filter(DNSRecord.id == record_id, DNSRecord.hosted_zone_id == zone_id)
            .first()
        )
        if not record:
            return None

        return DNSRecordResponse(
            id=record.id,
            hosted_zone_id=record.hosted_zone_id,
            name=record.name,
            type=record.type,
            ttl=record.ttl,
            value=record.value,
            created_at=record.created_at,
            updated_at=record.updated_at,
        )

    @staticmethod
    def update_record(
        db: Session,
        zone_id: int,
        record_id: int,
        user_id: int,
        record_in: DNSRecordUpdate,
    ) -> Optional[DNSRecordResponse]:
        zone = DNSRecordService.get_user_zone(db, zone_id, user_id)
        if not zone:
            return None

        record = (
            db.query(DNSRecord)
            .filter(DNSRecord.id == record_id, DNSRecord.hosted_zone_id == zone_id)
            .first()
        )
        if not record:
            return None

        if record_in.name is not None:
            record.name = record_in.name

        if record_in.type is not None:
            record.type = record_in.type.value if hasattr(record_in.type, "value") else str(record_in.type)

        if record_in.ttl is not None:
            record.ttl = record_in.ttl

        if record_in.value is not None:
            record.value = record_in.value

        record.updated_at = datetime.utcnow()
        zone.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(record)

        return DNSRecordResponse(
            id=record.id,
            hosted_zone_id=record.hosted_zone_id,
            name=record.name,
            type=record.type,
            ttl=record.ttl,
            value=record.value,
            created_at=record.created_at,
            updated_at=record.updated_at,
        )

    @staticmethod
    def delete_record(
        db: Session,
        zone_id: int,
        record_id: int,
        user_id: int,
    ) -> bool:
        zone = DNSRecordService.get_user_zone(db, zone_id, user_id)
        if not zone:
            return False

        record = (
            db.query(DNSRecord)
            .filter(DNSRecord.id == record_id, DNSRecord.hosted_zone_id == zone_id)
            .first()
        )
        if not record:
            return False

        db.delete(record)
        zone.updated_at = datetime.utcnow()
        db.commit()
        return True
