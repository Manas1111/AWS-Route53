import { config } from "./config";
import type {
  HealthStatus,
  LoginResponse,
  LogoutResponse,
  User,
  HostedZone,
  HostedZoneCreateInput,
  HostedZoneUpdateInput,
  HostedZoneListResponse,
  DNSRecord,
  DNSRecordCreateInput,
  DNSRecordUpdateInput,
  DNSRecordListResponse,
} from "@/types/api";

const TOKEN_STORAGE_KEY = "route53_session_token";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = config.apiUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkErr: any) {
      throw new Error(
        networkErr?.message === "Failed to fetch"
          ? "Unable to connect to Route 53 API service. Please verify that the backend server is running."
          : networkErr?.message || "Network error occurred."
      );
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // Fallback to generic message if response body is not JSON
      }

      const error = new Error(errorMessage) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>("/health", { method: "GET", cache: "no-store" });
  }

  async getApiV1Health(): Promise<HealthStatus> {
    return this.request<HealthStatus>("/api/v1/health", { method: "GET", cache: "no-store" });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await this.request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const res = await this.request<LogoutResponse>("/api/v1/auth/logout", {
        method: "POST",
      });
      return res;
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<User> {
    return this.request<User>("/api/v1/auth/me", {
      method: "GET",
      cache: "no-store",
    });
  }

  async getHostedZones(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  } = {}): Promise<HostedZoneListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search && params.search.trim()) query.set("search", params.search.trim());
    if (params.type && params.type !== "ALL") query.set("type", params.type);

    const queryString = query.toString();
    const endpoint = `/api/v1/hosted-zones${queryString ? `?${queryString}` : ""}`;
    return this.request<HostedZoneListResponse>(endpoint, {
      method: "GET",
      cache: "no-store",
    });
  }

  async getHostedZone(id: number): Promise<HostedZone> {
    return this.request<HostedZone>(`/api/v1/hosted-zones/${id}`, {
      method: "GET",
      cache: "no-store",
    });
  }

  async createHostedZone(data: HostedZoneCreateInput): Promise<HostedZone> {
    return this.request<HostedZone>("/api/v1/hosted-zones", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateHostedZone(id: number, data: HostedZoneUpdateInput): Promise<HostedZone> {
    return this.request<HostedZone>(`/api/v1/hosted-zones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteHostedZone(id: number): Promise<void> {
    await this.request<void>(`/api/v1/hosted-zones/${id}`, {
      method: "DELETE",
    });
  }

  async getDNSRecords(
    zoneId: number,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    } = {}
  ): Promise<DNSRecordListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search && params.search.trim()) query.set("search", params.search.trim());
    if (params.type && params.type !== "ALL") query.set("type", params.type);

    const queryString = query.toString();
    const endpoint = `/api/v1/hosted-zones/${zoneId}/records${queryString ? `?${queryString}` : ""}`;
    return this.request<DNSRecordListResponse>(endpoint, {
      method: "GET",
      cache: "no-store",
    });
  }

  async getDNSRecord(zoneId: number, recordId: number): Promise<DNSRecord> {
    return this.request<DNSRecord>(`/api/v1/hosted-zones/${zoneId}/records/${recordId}`, {
      method: "GET",
      cache: "no-store",
    });
  }

  async createDNSRecord(zoneId: number, data: DNSRecordCreateInput): Promise<DNSRecord> {
    return this.request<DNSRecord>(`/api/v1/hosted-zones/${zoneId}/records`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDNSRecord(
    zoneId: number,
    recordId: number,
    data: DNSRecordUpdateInput
  ): Promise<DNSRecord> {
    return this.request<DNSRecord>(`/api/v1/hosted-zones/${zoneId}/records/${recordId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteDNSRecord(zoneId: number, recordId: number): Promise<void> {
    await this.request<void>(`/api/v1/hosted-zones/${zoneId}/records/${recordId}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
