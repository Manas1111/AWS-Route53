"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { DNSRecord } from "@/types/api";

interface DeleteDNSRecordModalProps {
  isOpen: boolean;
  zoneId: number;
  record: DNSRecord | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const DeleteDNSRecordModal: React.FC<DeleteDNSRecordModalProps> = ({
  isOpen,
  zoneId,
  record,
  onClose,
  onSuccess,
  onError,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !record) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.deleteDNSRecord(zoneId, record.id);
      onSuccess();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete DNS record.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="aws-modal-backdrop" onClick={onClose}>
      <div className="aws-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>Delete record</h2>
          <button
            type="button"
            className="aws-modal-close"
            onClick={onClose}
            disabled={isDeleting}
          >
            ×
          </button>
        </div>

        <div className="aws-modal-body">
          <div className="aws-alert error" style={{ marginBottom: "16px" }}>
            <span>
              <strong>Warning:</strong> Deleting this DNS record permanently removes it from the hosted zone. This action cannot be undone.
            </span>
          </div>

          <p style={{ fontSize: "13px", color: "var(--aws-text-secondary)", lineHeight: 1.5, marginBottom: "12px" }}>
            Are you sure you want to delete the following record?
          </p>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid var(--aws-border-subtle)",
              borderRadius: "2px",
              padding: "12px 16px",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            <div><strong>Name:</strong> <code>{record.name}</code></div>
            <div><strong>Type:</strong> <span className="aws-record-type-badge">{record.type}</span></div>
            <div><strong>Value:</strong> <code style={{ wordBreak: "break-all" }}>{record.value}</code></div>
            <div><strong>TTL:</strong> {record.ttl} seconds</div>
          </div>
        </div>

        <div className="aws-modal-footer">
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="aws-btn aws-btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span
                  className="aws-spinner"
                  style={{ width: "12px", height: "12px", borderWidth: "2px", borderTopColor: "#ffffff" }}
                  aria-hidden="true"
                />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
