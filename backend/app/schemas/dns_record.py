from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, field_validator


class RecordType(str, Enum):
    A = "A"
    AAAA = "AAAA"
    CNAME = "CNAME"
    TXT = "TXT"
    MX = "MX"
    NS = "NS"
    SOA = "SOA"
    PTR = "PTR"
    SRV = "SRV"
    CAA = "CAA"


class DNSRecordBase(BaseModel):
    name: str
    type: RecordType
    ttl: int = 300
    value: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean or len(clean) > 255:
            raise ValueError("Record name must be between 1 and 255 characters")
        return clean

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, v: int) -> int:
        if v < 1 or v > 2147483647:
            raise ValueError("TTL must be a positive integer between 1 and 2147483647 seconds")
        return v

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Record value cannot be empty")
        return clean


class DNSRecordCreate(DNSRecordBase):
    pass


class DNSRecordUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[RecordType] = None
    ttl: Optional[int] = None
    value: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            clean = v.strip().lower()
            if not clean or len(clean) > 255:
                raise ValueError("Record name must be between 1 and 255 characters")
            return clean
        return v

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and (v < 1 or v > 2147483647):
            raise ValueError("TTL must be a positive integer between 1 and 2147483647 seconds")
        return v

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            clean = v.strip()
            if not clean:
                raise ValueError("Record value cannot be empty")
            return clean
        return v


class DNSRecordResponse(DNSRecordBase):
    id: int
    hosted_zone_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DNSRecordListResponse(BaseModel):
    items: List[DNSRecordResponse]
    total: int
    page: int
    limit: int
    total_pages: int
