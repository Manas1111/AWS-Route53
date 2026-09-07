"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { DNSRecord, RecordType } from "@/types/api";

const RECORD_TYPES: RecordType[] = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
];

interface EditDNSRecordModalProps {
  isOpen: boolean;
  zoneId: number;
  record: DNSRecord | null;
  onClose: () => void;
  onSuccess: (updated: DNSRecord) => void;
  onError: (message: string) => void;
}

export const EditDNSRecordModal: React.FC<EditDNSRecordModalProps> = ({
  isOpen,
  zoneId,
  record,
  onClose,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<RecordType>("A");
  const [ttl, setTtl] = useState(300);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; ttl?: string; value?: string }>({});

  useEffect(() => {
    if (record) {
      setName(record.name);
      setType(record.type);
      setTtl(record.ttl);
      setValue(record.value);
      setFieldErrors({});
      setValidationError(null);
      setApiError(null);
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim().toLowerCase();
    const cleanValue = value.trim();
    const errors: { name?: string; ttl?: string; value?: string } = {};

    if (!cleanName) {
      errors.name = "Record name is required.";
    }

    if (!cleanValue) {
      errors.value = "Value / Route traffic to is required.";
    }

    if (isNaN(ttl) || ttl < 1) {
      errors.ttl = "TTL must be a positive integer (minimum 1 second).";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setValidationError(Object.values(errors)[0]);
      return;
    }

    setFieldErrors({});
    setValidationError(null);
    setApiError(null);
    setIsSubmitting(true);

    try {
      const updated = await apiClient.updateDNSRecord(zoneId, record.id, {
        name: cleanName,
        type,
        ttl,
        value: cleanValue,
      });

      setFieldErrors({});
      setValidationError(null);
      setApiError(null);
      onSuccess(updated);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update DNS record.";
      setApiError(msg);
      onError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aws-modal-backdrop" onClick={onClose}>
      <div className="aws-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>Edit record</h2>
          <button
            type="button"
            className="aws-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="aws-modal-body">
            {(apiError || validationError) && (
              <div className="aws-alert error" style={{ marginBottom: "14px" }}>
                <span>{apiError || validationError}</span>
              </div>
            )}

            <div className="aws-form-group">
              <label htmlFor="edit-record-name" className="aws-label">
                Record name <span style={{ color: "var(--aws-error)" }}>*</span>
              </label>
              <input
                id="edit-record-name"
                type="text"
                className="aws-input"
                style={{
                  fontFamily: "var(--font-mono)",
                  borderColor: fieldErrors.name ? "var(--aws-error)" : undefined,
                }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  setValidationError(null);
                  setApiError(null);
                }}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.name && (
                <span style={{ color: "var(--aws-error)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="aws-form-group">
              <label htmlFor="edit-record-type" className="aws-label">
                Record type <span style={{ color: "var(--aws-error)" }}>*</span>
              </label>
              <select
                id="edit-record-type"
                className="aws-select"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as RecordType);
                  setApiError(null);
                }}
                disabled={isSubmitting}
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t} - {getRecordTypeDescription(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="aws-form-group">
              <label htmlFor="edit-record-ttl" className="aws-label">
                TTL (seconds) <span style={{ color: "var(--aws-error)" }}>*</span>
              </label>
              <input
                id="edit-record-ttl"
                type="number"
                min={1}
                className="aws-input"
                style={{
                  fontFamily: "var(--font-mono)",
                  borderColor: fieldErrors.ttl ? "var(--aws-error)" : undefined,
                }}
                value={ttl}
                onChange={(e) => {
                  setTtl(parseInt(e.target.value, 10));
                  if (fieldErrors.ttl) setFieldErrors((prev) => ({ ...prev, ttl: undefined }));
                  setValidationError(null);
                  setApiError(null);
                }}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.ttl ? (
                <span style={{ color: "var(--aws-error)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                  {fieldErrors.ttl}
                </span>
              ) : (
                <span className="aws-form-hint">
                  Standard TTL value in seconds (e.g. 300 for 5 minutes, 86400 for 1 day).
                </span>
              )}
            </div>

            <div className="aws-form-group">
              <label htmlFor="edit-record-value" className="aws-label">
                Value / Route traffic to <span style={{ color: "var(--aws-error)" }}>*</span>
              </label>
              <textarea
                id="edit-record-value"
                className="aws-textarea"
                rows={3}
                style={{
                  fontFamily: "var(--font-mono)",
                  borderColor: fieldErrors.value ? "var(--aws-error)" : undefined,
                  minHeight: "72px",
                }}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (fieldErrors.value) setFieldErrors((prev) => ({ ...prev, value: undefined }));
                  setValidationError(null);
                  setApiError(null);
                }}
                placeholder={getRecordPlaceholder(type)}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.value && (
                <span style={{ color: "var(--aws-error)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                  {fieldErrors.value}
                </span>
              )}
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

function getRecordTypeDescription(type: RecordType): string {
  switch (type) {
    case "A": return "Routes traffic to an IPv4 address";
    case "AAAA": return "Routes traffic to an IPv6 address";
    case "CNAME": return "Routes traffic to another domain name";
    case "TXT": return "Contains text string data";
    case "MX": return "Routes mail traffic to mail server";
    case "NS": return "Delegates a hosted zone to nameservers";
    case "PTR": return "Maps an IP address to a domain name";
    case "SRV": return "Defines priority and port for specific services";
    case "CAA": return "Specifies which CAs can issue certificates";
    default: return "";
  }
}

function getRecordPlaceholder(type: RecordType): string {
  switch (type) {
    case "A": return "192.0.2.1";
    case "AAAA": return "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
    case "CNAME": return "target.example.com";
    case "TXT": return "\"v=spf1 include:_spf.example.com ~all\"";
    case "MX": return "10 mail.example.com";
    case "NS": return "ns-1.awsdns-01.org";
    case "PTR": return "hostname.example.com";
    case "SRV": return "10 50 8080 service.example.com";
    case "CAA": return "0 issue \"letsencrypt.org\"";
    default: return "";
  }
};
