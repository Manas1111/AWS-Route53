"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { HostedZone, HostedZoneType } from "@/types/api";

interface EditHostedZoneModalProps {
  isOpen: boolean;
  zone: HostedZone | null;
  onClose: () => void;
  onSuccess: (updated: HostedZone) => void;
  onError: (message: string) => void;
}

export const EditHostedZoneModal: React.FC<EditHostedZoneModalProps> = ({
  isOpen,
  zone,
  onClose,
  onSuccess,
  onError,
}) => {
  const [type, setType] = useState<HostedZoneType>("PUBLIC");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (zone) {
      setType(zone.type);
      setDescription(zone.description || "");
    }
  }, [zone]);

  if (!isOpen || !zone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await apiClient.updateHostedZone(zone.id, {
        type,
        description: description.trim() || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update hosted zone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aws-modal-backdrop" onClick={onClose}>
      <div className="aws-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>Edit hosted zone</h2>
          <button
            type="button"
            className="aws-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="aws-modal-body">
            <div className="aws-form-group">
              <label className="aws-label">Domain name</label>
              <input
                type="text"
                className="aws-input"
                value={zone.name}
                disabled
                readOnly
              />
              <span className="aws-form-hint">
                The domain name of a hosted zone cannot be changed after creation.
              </span>
            </div>

            <div className="aws-form-group">
              <label htmlFor="edit-zone-type" className="aws-label">Type</label>
              <select
                id="edit-zone-type"
                className="aws-select"
                value={type}
                onChange={(e) => setType(e.target.value as HostedZoneType)}
                disabled={isSubmitting}
              >
                <option value="PUBLIC">Public hosted zone</option>
                <option value="PRIVATE">Private hosted zone</option>
              </select>
            </div>

            <div className="aws-form-group">
              <label htmlFor="edit-zone-desc" className="aws-label">Description - optional</label>
              <textarea
                id="edit-zone-desc"
                className="aws-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of this hosted zone"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="aws-modal-footer">
            <button
              type="button"
              className="aws-btn aws-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="aws-btn aws-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="aws-spinner"
                    style={{ width: "12px", height: "12px", borderWidth: "2px" }}
                    aria-hidden="true"
                  />
                  <span>Saving...</span>
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
