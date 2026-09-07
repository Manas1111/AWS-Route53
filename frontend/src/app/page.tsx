"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [domainQuery, setDomainQuery] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [domainSuccess, setDomainSuccess] = useState<string | null>(null);

  const handleCheckDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = domainQuery.trim();
    if (!trimmed) {
      setDomainError("Enter a domain name.");
      setDomainSuccess(null);
      return;
    }
    if (trimmed.length > 255) {
      setDomainError("Domain name cannot exceed 255 characters.");
      setDomainSuccess(null);
      return;
    }
    // AWS domain format: labels up to 63 chars, valid chars a-z, 0-9, and hyphen
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(trimmed)) {
      setDomainError("Enter a valid domain name (e.g., example.com).");
      setDomainSuccess(null);
      return;
    }
    setDomainError(null);
    setDomainSuccess(`"${trimmed}" is available.`);
  };
  return (
    <div className="aws-page">
      <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--aws-text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        Route 53 Dashboard
        <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--aws-link)", cursor: "pointer" }}>Info</span>
      </h1>

      {/* 4-column service card panel matching reference screenshot */}
      <div className="aws-dashboard-services-card">
        {/* DNS management */}
        <div className="aws-dashboard-service-col">
          <h3>DNS management</h3>
          <p>
            A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com.
          </p>
          <Link href="/hosted-zones" className="aws-btn-pill">
            Create hosted zone
          </Link>
        </div>

        {/* Availability monitoring */}
        <div className="aws-dashboard-service-col">
          <h3>Availability monitoring</h3>
          <p>
            Health checks monitor your applications and web resources, and direct DNS queries to healthy resources.
          </p>
          <span
            className="aws-btn-pill disabled"
            title="Not implemented in this clone"
          >
            Create health check
          </span>
        </div>

        {/* Traffic management */}
        <div className="aws-dashboard-service-col">
          <h3>Traffic management</h3>
          <p>
            A visual tool that lets you easily create policies for multiple endpoints in complex configurations.
          </p>
          <span
            className="aws-btn-pill disabled"
            title="Not implemented in this clone"
          >
            Create policy
          </span>
        </div>

        {/* Domain registration */}
        <div className="aws-dashboard-service-col">
          <h3>Domain registration</h3>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#d13212", marginTop: "14px", marginBottom: "4px" }}>
            Error
          </div>
          <p style={{ fontSize: "13px", color: "var(--aws-text-secondary)", minHeight: "auto", marginBottom: 0 }}>
            Domains
          </p>
        </div>
      </div>

      {/* Register domain panel */}
      <div className="aws-dashboard-panel">
        <h2 className="aws-dashboard-panel-title" style={{ marginBottom: "8px" }}>Register domain</h2>
        <p style={{ fontSize: "13px", color: "var(--aws-text-secondary)", marginBottom: "16px" }}>
          Find and register an available domain, or{" "}
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--aws-link)" }}>
            transfer your existing domains
          </a>{" "}
          to Route 53.
        </p>

        <form onSubmit={handleCheckDomain} noValidate style={{ maxWidth: "760px" }}>
          <input
            type="text"
            name="domain-search"
            className={`aws-input${domainError ? " error" : ""}`}
            placeholder="Enter a domain name"
            style={{
              width: "100%",
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #d5dbdb",
              padding: "0 12px",
              fontSize: "13px",
              marginBottom: "8px",
            }}
            value={domainQuery}
            onChange={(e) => {
              setDomainQuery(e.target.value);
              if (domainError) setDomainError(null);
              if (domainSuccess) setDomainSuccess(null);
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />

          <p style={{ fontSize: "12px", color: "var(--aws-text-secondary)", marginBottom: "16px", lineHeight: 1.4 }}>
            Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9.
            Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
          </p>

          <button
            type="submit"
            className="aws-btn-pill"
            style={{ height: "30px", padding: "0 22px" }}
          >
            Check
          </button>

          {domainError && (
            <span className="aws-form-error" style={{ marginTop: "8px" }}>{domainError}</span>
          )}
          {domainSuccess && (
            <span style={{ fontSize: "12px", color: "var(--aws-success)", marginTop: "8px", display: "block" }}>
              {domainSuccess}
            </span>
          )}
        </form>
      </div>

      {/* Notifications panel matching reference screenshot */}
      <div className="aws-dashboard-panel">
        <div className="aws-dashboard-panel-header">
          <h2 className="aws-dashboard-panel-title">Notifications</h2>
          <button
            type="button"
            className="aws-refresh-circle-btn"
            title="Refresh notifications"
            aria-label="Refresh notifications"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>

        {/* Filter bar and pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ position: "relative", width: "420px", maxWidth: "100%" }}>
            <span style={{ position: "absolute", left: "10px", top: "8px", color: "#879596", display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Find notifications"
              style={{
                width: "100%",
                height: "32px",
                paddingLeft: "32px",
                paddingRight: "10px",
                borderRadius: "8px",
                border: "1px solid #d5dbdb",
                fontSize: "13px",
                outline: "none",
                background: "#fff",
              }}
              readOnly
            />
          </div>

          {/* Pagination controls < 1 > */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "#545b64" }}>
            <span style={{ cursor: "default", opacity: 0.5 }}>&lt;</span>
            <span style={{ fontWeight: 600, color: "var(--aws-text-primary)" }}>1</span>
            <span style={{ cursor: "default", opacity: 0.5 }}>&gt;</span>
          </div>
        </div>

        {/* Notifications table columns */}
        <div style={{ borderTop: "1px solid #eaeded", paddingTop: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: "12px", fontWeight: 700, color: "#16191f", paddingBottom: "12px", borderBottom: "1px solid #eaeded" }}>
            <span>Resource</span>
            <span>Status</span>
            <span>Last update</span>
          </div>
          <div style={{ padding: "32px 0", textAlign: "center", color: "#545b64", fontSize: "13px" }}>
            No notifications at this time.
          </div>
        </div>
      </div>
    </div>
  );
}
