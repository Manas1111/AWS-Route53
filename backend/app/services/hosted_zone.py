from datetime import datetime
from math import ceil
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.hosted_zone import HostedZone
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse, HostedZoneListResponse


class HostedZoneService:
    @staticmethod
    def get_or_create_dev_user(db: Session) -> User:
        user = db.query(User).filter(User.email == "default@route53.local").first()
        if not user:
            user = User(
                email="default@route53.local",
                password="development-password",
                created_at=datetime.utcnow(),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    @staticmethod
    def list_hosted_zones(
        db: Session,
        user_id: int,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        zone_type: Optional[str] = None,
    ) -> HostedZoneListResponse:
        query = db.query(HostedZone).filter(HostedZone.user_id == user_id)

        if search and search.strip():
            query = query.filter(HostedZone.name.ilike(f"%{search.strip()}%"))

        if zone_type and zone_type.strip():
            query = query.filter(HostedZone.type == zone_type.strip().upper())

        total = query.count()
        total_pages = ceil(total / limit) if total > 0 else 1
        offset = (page - 1) * limit

        zones = query.order_by(HostedZone.created_at.desc()).offset(offset).limit(limit).all()

        items = [
            HostedZoneResponse(
                id=zone.id,
                user_id=zone.user_id,
                name=zone.name,
                type=zone.type,
                description=zone.description,
                record_count=len(zone.records),
                created_at=zone.created_at,
                updated_at=zone.updated_at,
            )
            for zone in zones
        ]

        return HostedZoneListResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

    @staticmethod
    def get_hosted_zone(db: Session, zone_id: int, user_id: int) -> Optional[HostedZoneResponse]:
        zone = (
            db.query(HostedZone)
            .filter(HostedZone.id == zone_id, HostedZone.user_id == user_id)
            .first()
        )
        if not zone:
            return None

        return HostedZoneResponse(
            id=zone.id,
            user_id=zone.user_id,
            name=zone.name,
            type=zone.type,
            description=zone.description,
            record_count=len(zone.records),
            created_at=zone.created_at,
            updated_at=zone.updated_at,
        )

    @staticmethod
    def create_hosted_zone(
        db: Session,
        zone_in: HostedZoneCreate,
        user_id: int,
    ) -> HostedZoneResponse:
        zone = HostedZone(
            user_id=user_id,
            name=zone_in.name,
            type=zone_in.type.value if hasattr(zone_in.type, "value") else str(zone_in.type),
            description=zone_in.description,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(zone)
        db.commit()
        db.refresh(zone)

        return HostedZoneResponse(
            id=zone.id,
            user_id=zone.user_id,
            name=zone.name,
            type=zone.type,
            description=zone.description,
            record_count=0,
            created_at=zone.created_at,
            updated_at=zone.updated_at,
        )

    @staticmethod
    def update_hosted_zone(
        db: Session,
        zone_id: int,
        zone_in: HostedZoneUpdate,
        user_id: int,
    ) -> Optional[HostedZoneResponse]:
        zone = (
            db.query(HostedZone)
            .filter(HostedZone.id == zone_id, HostedZone.user_id == user_id)
            .first()
        )
        if not zone:
            return None

        if zone_in.description is not None:
            zone.description = zone_in.description

        if zone_in.type is not None:
            zone.type = zone_in.type.value if hasattr(zone_in.type, "value") else str(zone_in.type)

        zone.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(zone)

        return HostedZoneResponse(
            id=zone.id,
            user_id=zone.user_id,
            name=zone.name,
            type=zone.type,
            description=zone.description,
            record_count=len(zone.records),
            created_at=zone.created_at,
            updated_at=zone.updated_at,
        )

    @staticmethod
    def delete_hosted_zone(db: Session, zone_id: int, user_id: int) -> bool:
        zone = (
            db.query(HostedZone)
            .filter(HostedZone.id == zone_id, HostedZone.user_id == user_id)
            .first()
        )
        if not zone:
            return False

        db.delete(zone)
        db.commit()
        return True
