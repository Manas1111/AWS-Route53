"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { HostedZone } from "@/types/api";

interface DeleteHostedZoneModalProps {
  isOpen: boolean;
  zone: HostedZone | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const DeleteHostedZoneModal: React.FC<DeleteHostedZoneModalProps> = ({
  isOpen,
  zone,
  onClose,
  onSuccess,
  onError,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !zone) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.deleteHostedZone(zone.id);
      onSuccess();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete hosted zone.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="aws-modal-backdrop" onClick={onClose}>
      <div className="aws-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>Delete hosted zone</h2>
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
              <strong>Warning:</strong> Deleting this hosted zone permanently removes the zone <strong>{zone.name}</strong> and all associated DNS records. This action cannot be undone.
            </span>
          </div>

          <p style={{ fontSize: "13px", color: "var(--aws-text-secondary)", lineHeight: 1.5 }}>
            Are you sure you want to delete hosted zone <strong>{zone.name}</strong> (ID: {zone.id})?
          </p>
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
