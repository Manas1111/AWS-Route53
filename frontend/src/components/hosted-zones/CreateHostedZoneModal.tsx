"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { HostedZone, HostedZoneType } from "@/types/api";

interface CreateHostedZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (zone: HostedZone) => void;
  onError: (message: string) => void;
}

export const CreateHostedZoneModal: React.FC<CreateHostedZoneModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<HostedZoneType>("PUBLIC");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().toLowerCase().replace(/\.+$/, "");
    if (!cleanName) {
      setValidationError("Domain name is required.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const created = await apiClient.createHostedZone({
        name: cleanName,
        type,
        description: description.trim() || undefined,
      });
      setName("");
      setType("PUBLIC");
      setDescription("");
      onSuccess(created);
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create hosted zone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName("");
      setDescription("");
      setValidationError(null);
      onClose();
    }
  };

  return (
    <div className="aws-modal-backdrop" onClick={handleClose}>
      <div className="aws-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>Create hosted zone</h2>
          <button
            type="button"
            className="aws-modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="aws-modal-body">
            {validationError && (
              <div className="aws-alert error" style={{ marginBottom: "16px" }}>
                <span>{validationError}</span>
              </div>
            )}

            <div className="aws-form-group">
              <label htmlFor="create-zone-name" className="aws-label">
                Domain name <span style={{ color: "var(--aws-error)" }}>*</span>
              </label>
              <input
                id="create-zone-name"
                type="text"
                className="aws-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="example.com"
                required
                disabled={isSubmitting}
                autoFocus
              />
              <span className="aws-form-hint">
                Enter a fully qualified domain name, such as <code>example.com</code> or <code>subdomain.example.com</code>.
              </span>
            </div>

            <div className="aws-form-group">
              <label htmlFor="create-zone-type" className="aws-label">Type</label>
              <select
                id="create-zone-type"
                className="aws-select"
                value={type}
                onChange={(e) => setType(e.target.value as HostedZoneType)}
                disabled={isSubmitting}
              >
                <option value="PUBLIC">Public hosted zone</option>
                <option value="PRIVATE">Private hosted zone</option>
              </select>
              <span className="aws-form-hint">
                Public hosted zones route traffic on the internet. Private hosted zones route traffic within private networks.
              </span>
            </div>

            <div className="aws-form-group">
              <label htmlFor="create-zone-desc" className="aws-label">Description - optional</label>
              <textarea
                id="create-zone-desc"
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
              onClick={handleClose}
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
                  <span>Creating...</span>
                </>
              ) : (
                "Create hosted zone"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
