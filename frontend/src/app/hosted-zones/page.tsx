"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationToast, type NotificationState } from "@/components/common/NotificationToast";
import { EditHostedZoneModal } from "@/components/hosted-zones/EditHostedZoneModal";
import { DeleteHostedZoneModal } from "@/components/hosted-zones/DeleteHostedZoneModal";
import { apiClient } from "@/lib/api-client";
import type { HostedZone, HostedZoneListResponse } from "@/types/api";

export default function HostedZonesPage() {
  const router = useRouter();

  const [zones, setZones] = useState<HostedZone[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingZone, setEditingZone] = useState<HostedZone | null>(null);
  const [deletingZone, setDeletingZone] = useState<HostedZone | null>(null);
  const [selectedZone, setSelectedZone] = useState<HostedZone | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const loadZones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: HostedZoneListResponse = await apiClient.getHostedZones({
        page,
        limit,
        search: debouncedSearch,
        type: typeFilter !== "ALL" ? typeFilter : undefined,
      });
      setZones(res.items);
      setTotal(res.total);
      setTotalPages(res.total_pages);
      setSelectedZone((prev) =>
        prev ? res.items.find((z) => z.id === prev.id) ?? null : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hosted zones.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, typeFilter]);

  useEffect(() => { loadZones(); }, [loadZones]);

  const handleEditSuccess = (z: HostedZone) => {
    setNotification({ type: "success", message: `Hosted zone "${z.name}" updated.` });
    setSelectedZone(z);
    loadZones();
  };
  const handleDeleteSuccess = () => {
    setNotification({ type: "success", message: "Hosted zone and its DNS records deleted." });
    setSelectedZone(null);
    loadZones();
  };

  const startRecord = total > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="aws-page">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      {/* Title row */}
      <div className="aws-page-title-row">
        <h1 className="aws-page-h1">
          Hosted zones
          {!isLoading && <span className="aws-page-count"> ({total})</span>}
        </h1>
        <div className="aws-page-actions">
          {/* Refresh */}
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            onClick={loadZones}
            disabled={isLoading}
            title="Refresh"
            aria-label="Refresh"
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: isLoading ? "spin 0.8s linear infinite" : "none" }}
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>

          {/* View details */}
          {selectedZone ? (
            <Link href={`/hosted-zones/${selectedZone.id}`} className="aws-btn aws-btn-secondary">
              View details
            </Link>
          ) : (
            <button type="button" className="aws-btn aws-btn-secondary" disabled>View details</button>
          )}

          {/* Edit */}
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            disabled={!selectedZone}
            onClick={() => selectedZone && setEditingZone(selectedZone)}
          >
            Edit
          </button>

          {/* Delete */}
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            disabled={!selectedZone}
            onClick={() => selectedZone && setDeletingZone(selectedZone)}
          >
            Delete
          </button>

          {/* Create (primary orange) */}
          <Link href="/hosted-zones/create" className="aws-btn aws-btn-primary">
            Create hosted zone
          </Link>
        </div>
      </div>

      {/* AWS-style subtitle / info line */}
      <p className="aws-page-subtitle">
        Automatic mode is the current search behavior optimized for best filter results.{" "}
        <a href="#" onClick={(e) => e.preventDefault()}>To change modes go to settings.</a>
      </p>

      {/* Filter + pagination row (matches AWS layout) */}
      <div className="aws-table-controls" style={{ marginBottom: "0" }}>
        {/* Filter bar */}
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
            placeholder="Filter records by property or value"
            aria-label="Filter hosted zones"
          />

          {search && (
            <>
              <button
                type="button"
                className="aws-filter-bar-clear"
                onClick={handleClearSearch}
                aria-label="Clear filter"
              >
                ×
              </button>
              <div className="aws-filter-bar-sep" />
            </>
          )}

          {/* Type filter inside the bar */}
          <select
            className="aws-filter-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            aria-label="Filter by type"
          >
            <option value="ALL">All types</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        {/* Mini pagination */}
        <div className="aws-mini-pagination">
          <button
            type="button"
            className="aws-mini-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="aws-mini-page-num">{page}</span>
          <button
            type="button"
            className="aws-mini-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            aria-label="Next page"
          >
            ›
          </button>
        </div>

        <button type="button" className="aws-mini-settings-btn" title="Column settings" aria-label="Column settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="aws-panel" style={{ marginBottom: 0 }}>
        {error ? (
          <div style={{ padding: "24px", textAlign: "center" }}>
            <div className="aws-alert error" style={{ marginBottom: "16px", display: "inline-flex" }}>
              {error}
            </div>
            <div><button type="button" className="aws-btn aws-btn-secondary" onClick={loadZones}>Retry</button></div>
          </div>
        ) : isLoading && zones.length === 0 ? (
          <div className="aws-table-empty">
            <span className="aws-spinner" />
            <p style={{ marginTop: "12px" }}>Loading hosted zones...</p>
          </div>
        ) : zones.length === 0 ? (
          <div className="aws-table-empty">
            {debouncedSearch || typeFilter !== "ALL" ? (
              <>
                <h3>No hosted zones match the filter</h3>
                <p style={{ marginTop: "6px", marginBottom: "16px" }}>Try adjusting your search or type filter.</p>
                <button type="button" className="aws-btn aws-btn-secondary" onClick={() => { handleClearSearch(); setTypeFilter("ALL"); }}>
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600, marginBottom: "6px" }}>No hosted zones</p>
                <p style={{ marginBottom: "16px" }}>There are no hosted zones created for this account.</p>
                <Link href="/hosted-zones/create" className="aws-btn aws-btn-primary">
                  Create hosted zone
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="aws-table-wrapper">
              <table className="aws-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px" }}></th>
                    <th>
                      <button type="button" className="aws-table-sort-btn">
                        Hosted zone name <span className="aws-table-sort-icon">▼</span>
                      </button>
                    </th>
                    <th>
                      <button type="button" className="aws-table-sort-btn">
                        Type <span className="aws-table-sort-icon">▼</span>
                      </button>
                    </th>
                    <th>
                      <button type="button" className="aws-table-sort-btn">
                        Created by <span className="aws-table-sort-icon">▼</span>
                      </button>
                    </th>
                    <th>
                      <button type="button" className="aws-table-sort-btn">
                        Record count <span className="aws-table-sort-icon">▼</span>
                      </button>
                    </th>
                    <th>
                      <button type="button" className="aws-table-sort-btn">
                        Description <span className="aws-table-sort-icon">▼</span>
                      </button>
                    </th>
                    <th>
                      <button type="button" className="aws-table-sort-btn">
                        Hosted zone ID <span className="aws-table-sort-icon">▼</span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => {
                    const sel = selectedZone?.id === zone.id;
                    return (
                      <tr
                        key={zone.id}
                        className={sel ? "selected" : ""}
                        onClick={() => setSelectedZone(zone)}
                        onDoubleClick={() => router.push(`/hosted-zones/${zone.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
                          <input
                            type="radio"
                            name="zone-select"
                            className="aws-table-radio"
                            checked={sel}
                            onChange={() => setSelectedZone(zone)}
                            aria-label={`Select ${zone.name}`}
                          />
                        </td>
                        <td>
                          <Link
                            href={`/hosted-zones/${zone.id}`}
                            className="aws-table-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {zone.name}
                          </Link>
                        </td>
                        <td>
                          <span className={zone.type === "PUBLIC" ? "aws-badge-public" : "aws-badge-private"}>
                            {zone.type === "PUBLIC" ? "Public" : "Private"}
                          </span>
                        </td>
                        <td style={{ color: "var(--aws-text-secondary)" }}>Route 53</td>
                        <td style={{ fontVariantNumeric: "tabular-nums" }}>{zone.record_count ?? 0}</td>
                        <td>
                          <span className="aws-table-truncate">{zone.description || "—"}</span>
                        </td>
                        <td className="aws-mono" style={{ color: "var(--aws-text-secondary)" }}>{zone.id}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="aws-pagination">
              <span>
                Showing <strong>{startRecord}</strong>–<strong>{endRecord}</strong> of <strong>{total}</strong> hosted zones
              </span>
              <div className="aws-pagination-controls">
                <button
                  type="button"
                  className="aws-btn aws-btn-secondary aws-pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                >
                  ← Previous
                </button>
                <span className="aws-page-num">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  className="aws-btn aws-btn-secondary aws-pagination-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals (Edit + Delete only; Create now lives at /hosted-zones/create) */}
      <EditHostedZoneModal
        isOpen={!!editingZone}
        zone={editingZone}
        onClose={() => setEditingZone(null)}
        onSuccess={handleEditSuccess}
        onError={(msg) => setNotification({ type: "error", message: msg })}
      />

      <DeleteHostedZoneModal
        isOpen={!!deletingZone}
        zone={deletingZone}
        onClose={() => setDeletingZone(null)}
        onSuccess={handleDeleteSuccess}
        onError={(msg) => setNotification({ type: "error", message: msg })}
      />
    </div>
  );
}
