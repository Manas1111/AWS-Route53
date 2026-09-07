"use client";

import React, { useState, useEffect, useCallback, useRef, use } from "react";
import Link from "next/link";
import { NotificationToast, type NotificationState } from "@/components/common/NotificationToast";
import { DNSRecordTable } from "@/components/dns-records/DNSRecordTable";
import { CreateDNSRecordModal } from "@/components/dns-records/CreateDNSRecordModal";
import { EditDNSRecordModal } from "@/components/dns-records/EditDNSRecordModal";
import { DeleteDNSRecordModal } from "@/components/dns-records/DeleteDNSRecordModal";
import { apiClient } from "@/lib/api-client";
import type { HostedZone, DNSRecord, DNSRecordListResponse } from "@/types/api";

const RECORD_TYPES = ["ALL","A","AAAA","CNAME","TXT","MX","NS","PTR","SRV","CAA"];

export default function HostedZoneDetailPage({
  params,
}: {
  params: Promise<{ zoneId: string }>;
}) {
  const resolvedParams = use(params);
  const zoneId = parseInt(resolvedParams.zoneId, 10);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [zoneLoading, setZoneLoading] = useState(true);
  const [zoneError, setZoneError] = useState<string | null>(null);

  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<DNSRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DNSRecord | null>(null);

  const [notification, setNotification] = useState<NotificationState | null>(null);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const loadZone = useCallback(async () => {
    if (isNaN(zoneId)) { setZoneError("Invalid zone ID."); setZoneLoading(false); return; }
    setZoneLoading(true); setZoneError(null);
    try { setZone(await apiClient.getHostedZone(zoneId)); }
    catch (e) { setZoneError(e instanceof Error ? e.message : "Failed to load zone."); }
    finally { setZoneLoading(false); }
  }, [zoneId]);

  const loadRecords = useCallback(async () => {
    if (isNaN(zoneId)) return;
    setRecordsLoading(true); setRecordsError(null);
    try {
      const res: DNSRecordListResponse = await apiClient.getDNSRecords(zoneId, {
        page, limit,
        search: debouncedSearch,
        type: typeFilter !== "ALL" ? typeFilter : undefined,
      });
      setRecords(res.items);
      setTotal(res.total);
      setTotalPages(res.total_pages);
      setSelectedRecord((prev) => prev ? res.items.find((r) => r.id === prev.id) ?? null : null);
    } catch (e) { setRecordsError(e instanceof Error ? e.message : "Failed to load records."); }
    finally { setRecordsLoading(false); }
  }, [zoneId, page, limit, debouncedSearch, typeFilter]);

  useEffect(() => { loadZone(); }, [loadZone]);
  useEffect(() => { loadRecords(); }, [loadRecords]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value; setSearch(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setDebouncedSearch(v); setPage(1); }, 300);
  };
  const clearSearch = () => { setSearch(""); setDebouncedSearch(""); setPage(1); };

  const onCreateSuccess = (r: DNSRecord) => {
    setNotification({ type: "success", message: `Record "${r.name}" (${r.type}) created.` });
    setSelectedRecord(r);
    loadRecords(); loadZone();
  };
  const onEditSuccess = (r: DNSRecord) => {
    setNotification({ type: "success", message: `Record "${r.name}" (${r.type}) updated.` });
    setSelectedRecord(r);
    loadRecords(); loadZone();
  };
  const onDeleteSuccess = () => {
    setNotification({ type: "success", message: "DNS record deleted." });
    setSelectedRecord(null);
    loadRecords(); loadZone();
  };
  const onError = (msg: string) => setNotification({ type: "error", message: msg });

  const startRecord = total > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, total);

  if (zoneLoading) {
    return (
      <div className="aws-page">
        <div className="aws-table-empty">
          <span className="aws-spinner" />
          <p style={{ marginTop: "12px" }}>Loading hosted zone...</p>
        </div>
      </div>
    );
  }

  if (zoneError || !zone) {
    return (
      <div className="aws-page">
        <div className="aws-alert error" style={{ marginBottom: "16px" }}>{zoneError || "Zone not found."}</div>
        <Link href="/hosted-zones" className="aws-btn aws-btn-primary">Return to Hosted zones</Link>
      </div>
    );
  }

  return (
    <div className="aws-page">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      {/* Page title */}
      <div className="aws-page-title-row" style={{ marginBottom: "16px" }}>
        <h1 className="aws-page-h1">{zone.name}</h1>
        <div className="aws-page-actions">
          <Link href="/hosted-zones" className="aws-btn aws-btn-secondary">
            ← Hosted zones
          </Link>
        </div>
      </div>

      {/* Zone details panel */}
      <div className="aws-panel" style={{ marginBottom: "16px" }}>
        <div className="aws-panel-header"><h2>Hosted zone details</h2></div>
        <div className="aws-panel-body">
          <div className="aws-kv-grid">
            <div className="aws-kv-cell">
              <span className="aws-kv-label">Hosted zone ID</span>
              <span className="aws-kv-value aws-mono">{zone.id}</span>
            </div>
            <div className="aws-kv-cell">
              <span className="aws-kv-label">Domain name</span>
              <span className="aws-kv-value aws-mono">{zone.name}</span>
            </div>
            <div className="aws-kv-cell">
              <span className="aws-kv-label">Type</span>
              <span className="aws-kv-value">
                <span className={zone.type === "PUBLIC" ? "aws-badge-public" : "aws-badge-private"}>
                  {zone.type === "PUBLIC" ? "Public" : "Private"}
                </span>
              </span>
            </div>
            <div className="aws-kv-cell">
              <span className="aws-kv-label">Record count</span>
              <span className="aws-kv-value">{zone.record_count ?? total}</span>
            </div>
            <div className="aws-kv-cell" style={{ gridColumn: "span 2" }}>
              <span className="aws-kv-label">Description</span>
              <span className="aws-kv-value">{zone.description || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Records section title + toolbar */}
      <div className="aws-page-title-row" style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--aws-text-primary)" }}>
          Records{!recordsLoading && <span className="aws-page-count"> ({total})</span>}
        </h2>
        <div className="aws-page-actions">
          {/* Refresh records */}
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            onClick={loadRecords}
            disabled={recordsLoading}
            title="Refresh"
            aria-label="Refresh records"
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: recordsLoading ? "spin 0.8s linear infinite" : "none" }}
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            disabled={!selectedRecord}
            onClick={() => selectedRecord && setEditingRecord(selectedRecord)}
          >
            Edit record
          </button>
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            disabled={!selectedRecord}
            onClick={() => selectedRecord && setDeletingRecord(selectedRecord)}
          >
            Delete record
          </button>
          <button
            type="button"
            className="aws-btn aws-btn-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            Create record
          </button>
        </div>
      </div>

      {/* Filter + mini pagination row */}
      <div className="aws-table-controls">
        <div className="aws-filter-bar" style={{ flex: 1 }}>
          <span className="aws-filter-bar-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            className="aws-filter-bar-input"
            value={search}
            onChange={handleSearchChange}
            placeholder="Filter records by name or value"
            aria-label="Filter DNS records"
          />
          {search && (
            <>
              <button type="button" className="aws-filter-bar-clear" onClick={clearSearch} aria-label="Clear">×</button>
              <div className="aws-filter-bar-sep" />
            </>
          )}
          <select
            className="aws-filter-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            aria-label="Filter by record type"
          >
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>{t === "ALL" ? "All types" : t}</option>
            ))}
          </select>
        </div>
        <div className="aws-mini-pagination">
          <button
            type="button"
            className="aws-mini-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || recordsLoading}
            aria-label="Previous page"
          >‹</button>
          <span className="aws-mini-page-num">{page}</span>
          <button
            type="button"
            className="aws-mini-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || recordsLoading}
            aria-label="Next page"
          >›</button>
        </div>
      </div>

      {/* Records table */}
      <div className="aws-panel" style={{ marginBottom: 0 }}>
        {recordsError ? (
          <div style={{ padding: "24px", textAlign: "center" }}>
            <div className="aws-alert error" style={{ display: "inline-flex", marginBottom: "16px" }}>{recordsError}</div>
            <div><button type="button" className="aws-btn aws-btn-secondary" onClick={loadRecords}>Retry</button></div>
          </div>
        ) : recordsLoading && records.length === 0 ? (
          <div className="aws-table-empty">
            <span className="aws-spinner" />
            <p style={{ marginTop: "12px" }}>Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="aws-table-empty">
            {debouncedSearch || typeFilter !== "ALL" ? (
              <>
                <h3>No records match the filter</h3>
                <p style={{ marginTop: "6px", marginBottom: "16px" }}>Try adjusting your search or type filter.</p>
                <button type="button" className="aws-btn aws-btn-secondary" onClick={() => { clearSearch(); setTypeFilter("ALL"); }}>
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <h3>No records</h3>
                <p style={{ marginTop: "6px", marginBottom: "16px" }}>
                  This hosted zone has no DNS records.
                </p>
                <button type="button" className="aws-btn aws-btn-primary" onClick={() => setIsCreateOpen(true)}>
                  Create record
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <DNSRecordTable
              records={records}
              selectedRecord={selectedRecord}
              onSelectRecord={setSelectedRecord}
              onEdit={(r) => setEditingRecord(r)}
              onDelete={(r) => setDeletingRecord(r)}
            />
            <div className="aws-pagination">
              <span>
                Showing <strong>{startRecord}</strong>–<strong>{endRecord}</strong> of <strong>{total}</strong> records
              </span>
              <div className="aws-pagination-controls">
                <button
                  type="button"
                  className="aws-btn aws-btn-secondary aws-pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || recordsLoading}
                >← Previous</button>
                <span className="aws-page-num">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  className="aws-btn aws-btn-secondary aws-pagination-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || recordsLoading}
                >Next →</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateDNSRecordModal
        isOpen={isCreateOpen}
        zoneId={zone.id}
        zoneName={zone.name}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={onCreateSuccess}
        onError={onError}
      />
      <EditDNSRecordModal
        isOpen={!!editingRecord}
        zoneId={zone.id}
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSuccess={onEditSuccess}
        onError={onError}
      />
      <DeleteDNSRecordModal
        isOpen={!!deletingRecord}
        zoneId={zone.id}
        record={deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onSuccess={onDeleteSuccess}
        onError={onError}
      />
    </div>
  );
}
