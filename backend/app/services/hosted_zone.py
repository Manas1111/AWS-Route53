from datetime import datetime
from math import ceil
from hashlib import md5
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.schemas.hosted_zone import HostedZoneCreate, HostedZoneUpdate, HostedZoneResponse, HostedZoneListResponse


# ---------------------------------------------------------------------------
# Helpers for deterministic mock AWS-style name servers
# ---------------------------------------------------------------------------

def _generate_name_servers(zone_name: str) -> List[str]:
    """
    Produce 4 deterministic, stable mock AWS-style name server hostnames
    derived from a hash of the hosted zone's domain name.

    The generated values deliberately look like real Route 53 NS entries but
    are not real DNS servers — this application performs no actual DNS lookups.
    """
    h = int(md5(zone_name.encode("utf-8")).hexdigest(), 16)

    # Extract four independent 12-bit segments from the hash so each NS
    # gets its own unique-looking number.
    n0 = (h >>  0) & 0xFFF   # 0-4095
    n1 = (h >> 12) & 0xFFF
    n2 = (h >> 24) & 0xFFF
    n3 = (h >> 36) & 0xFFF

    # Sub-domain letters: derive an a-z letter from another hash nibble
    l0 = chr(ord('a') + ((h >> 48) % 26))
    l1 = chr(ord('a') + ((h >> 52) % 26))
    l2 = chr(ord('a') + ((h >> 56) % 26))
    l3 = chr(ord('a') + ((h >> 60) % 26))

    return [
        f"ns-{n0}.awsdns-{l0}{l1}.com.",
        f"ns-{n1}.awsdns-{l0}{l2}.net.",
        f"ns-{n2}.awsdns-{l1}{l2}.org.",
        f"ns-{n3}.awsdns-{l2}{l3}.co.uk.",
    ]


def _build_soa_value(zone_name: str, primary_ns: str) -> str:
    """
    Build a realistic mock SOA record RDATA string.

    Format (RFC 1035):
        <primary-ns> <responsible-mailbox> <serial> <refresh> <retry> <expire> <minimum-ttl>
    """
    # Route 53 uses awsdns-hostmaster.amazon.com. as the responsible mailbox
    responsible = "awsdns-hostmaster.amazon.com."
    # Use a fixed serial based on the zone name hash so it is stable across restarts
    h = int(md5(zone_name.encode("utf-8")).hexdigest(), 16)
    serial = 1 + (h % 99999999)
    # Standard Route 53 SOA timing values
    refresh = 7200
    retry = 900
    expire = 1209600
    minimum = 86400
    return (
        f"{primary_ns} {responsible} "
        f"{serial} {refresh} {retry} {expire} {minimum}"
    )


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
        zone_type_str = zone_in.type.value if hasattr(zone_in.type, "value") else str(zone_in.type)

        try:
            # 1. Insert the hosted zone (no commit yet)
            zone = HostedZone(
                user_id=user_id,
                name=zone_in.name,
                type=zone_type_str,
                description=zone_in.description,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            db.add(zone)
            db.flush()  # assigns zone.id without committing

            # 2. Generate deterministic name servers for this domain
            name_servers = _generate_name_servers(zone_in.name)
            primary_ns = name_servers[0]

            # NS value: all 4 name servers joined by newline (one per line)
            ns_value = "\n".join(name_servers)

            # SOA value: standard Route 53-style RDATA
            soa_value = _build_soa_value(zone_in.name, primary_ns)

            now = datetime.utcnow()

            # 3. Insert NS record
            ns_record = DNSRecord(
                hosted_zone_id=zone.id,
                name=zone_in.name,
                type="NS",
                ttl=172800,  # 48 hours — standard Route 53 NS TTL
                value=ns_value,
                created_at=now,
                updated_at=now,
            )
            db.add(ns_record)

            # 4. Insert SOA record
            soa_record = DNSRecord(
                hosted_zone_id=zone.id,
                name=zone_in.name,
                type="SOA",
                ttl=900,  # 15 minutes — standard Route 53 SOA TTL
                value=soa_value,
                created_at=now,
                updated_at=now,
            )
            db.add(soa_record)

            # 5. Single commit — atomic: if anything above failed we never reach here
            db.commit()
            db.refresh(zone)

        except Exception:
            db.rollback()
            raise

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
