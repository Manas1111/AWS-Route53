export interface HealthStatus {
  status: string;
  service: string;
  database?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export type HostedZoneType = "PUBLIC" | "PRIVATE";

export interface HostedZone {
  id: number;
  user_id: number;
  name: string;
  type: HostedZoneType;
  description?: string | null;
  record_count?: number;
  created_at: string;
  updated_at: string;
}

export interface HostedZoneCreateInput {
  name: string;
  type: HostedZoneType;
  description?: string;
}

export interface HostedZoneUpdateInput {
  type?: HostedZoneType;
  description?: string;
}

export interface HostedZoneListResponse {
  items: HostedZone[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type RecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "TXT"
  | "MX"
  | "NS"
  | "SOA"
  | "PTR"
  | "SRV"
  | "CAA";

export interface DNSRecord {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: RecordType;
  ttl: number;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface DNSRecordCreateInput {
  name: string;
  type: RecordType;
  ttl: number;
  value: string;
}

export interface DNSRecordUpdateInput {
  name?: string;
  type?: RecordType;
  ttl?: number;
  value?: string;
}

export interface DNSRecordListResponse {
  items: DNSRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
