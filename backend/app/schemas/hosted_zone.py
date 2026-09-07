from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, field_validator


class HostedZoneType(str, Enum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"


class HostedZoneBase(BaseModel):
    name: str
    type: HostedZoneType = HostedZoneType.PUBLIC
    description: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip().lower().rstrip(".")
        if not clean or len(clean) > 253:
            raise ValueError("Domain name must be between 1 and 253 characters")
        return clean


class HostedZoneCreate(HostedZoneBase):
    pass


class HostedZoneUpdate(BaseModel):
    description: Optional[str] = None
    type: Optional[HostedZoneType] = None


class HostedZoneResponse(HostedZoneBase):
    id: int
    user_id: int
    record_count: Optional[int] = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HostedZoneListResponse(BaseModel):
    items: List[HostedZoneResponse]
    total: int
    page: int
    limit: int
    total_pages: int
