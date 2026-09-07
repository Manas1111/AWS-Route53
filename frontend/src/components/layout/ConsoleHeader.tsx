"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface ConsoleHeaderProps {
  /** called when hamburger in the ServiceNavBar is clicked — not needed here */
  onToggleSidebar?: () => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = () => {
  const { user, logout } = useAuth();

  const accountDisplay = "demo";
  const mockAccountId = "000000000000";
  const mockEmail = "demo@route53.local";

  return (
    <div className="aws-topbar" role="banner">
      {/* AWS wordmark with signature orange smile arrow (inline SVG, no external URL) */}
      <div className="aws-topbar-logo" aria-label="AWS Console Home" style={{ padding: "0 10px", display: "flex", alignItems: "center" }}>
        <svg
          width="36"
          height="22"
          viewBox="0 0 46 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="AWS"
        >
          {/* 'a' */}
          <path
            d="M10.1 11.2c-.6-.5-1.5-.8-2.5-.8-2 0-3.3 1.1-3.3 2.9 0 1.7 1.2 2.8 3.2 2.8 1.1 0 1.9-.4 2.6-1v-3.9zm3.3 6.6h-3v-1.2c-.8.9-2.1 1.4-3.6 1.4-3.1 0-5.3-2-5.3-4.9 0-3.1 2.3-5 5.9-5 1.1 0 2.1.2 3 .5v-.4c0-1.4-.9-2.2-2.6-2.2-1.2 0-2.3.4-3.3 1.1l-1-2c1.3-.9 2.9-1.4 4.7-1.4 3.5 0 5.4 1.8 5.4 5v9.2h-.2z"
            fill="#ffffff"
          />
          {/* 'w' */}
          <path
            d="M22.7 17.8h-2.8l-2.6-9.8h2.9l1.3 6.3 1.5-6.3h2.5l1.5 6.3 1.3-6.3h2.8l-2.5 9.8h-2.8l-1.6-6.6-1.5 6.6z"
            fill="#ffffff"
          />
          {/* 's' */}
          <path
            d="M37.3 13.4c-2-.5-2.8-1-2.8-1.8 0-.9.8-1.5 2.1-1.5 1.2 0 2.4.4 3.3 1l1.1-2.1c-1.2-.8-2.8-1.3-4.5-1.3-3.1 0-5.1 1.8-5.1 4.1 0 2.1 1.4 3.2 4 3.9 2.2.6 2.9 1.1 2.9 2 0 1-.9 1.7-2.4 1.7-1.5 0-3-.5-4.1-1.4l-1.1 2.1c1.3 1.1 3.2 1.7 5.3 1.7 3.4 0 5.5-1.8 5.5-4.3-.2-2.2-1.6-3.4-4.2-4z"
            fill="#ffffff"
          />
          {/* Curved orange smile */}
          <path
            d="M36.8 20.8c-4 2.5-10.5 3.9-18.3 3.9-9.4 0-17.1-2.9-20.8-6.9-.3-.3 0-.7.4-.5 7.8 4 15.6 5.6 20.4 5.6 7 0 13.5-1.5 18-4.5.5-.4 1 .2.3 2.4z"
            fill="#FF9900"
          />
          {/* Smile arrowhead */}
          <path
            d="M38.5 19c-.3-.4-2.1.2-3.2.5-.3.1-.3.5 0 .5 1.5.7 4.3 1.6 4.9 1 .5-.6-.8-3.2-1.7-4.5-.2-.3-.5-.1-.4.2.2 1.1.7 2.7.4 2.3z"
            fill="#FF9900"
          />
        </svg>
      </div>

      <div className="aws-topbar-sep" aria-hidden="true" />

      {/* Route 53 compact service squircle icon */}
      <div
        className="aws-topbar-service-icon"
        title="Route 53"
        style={{ padding: "0 6px", display: "flex", alignItems: "center" }}
      >
        <div
          className="aws-service-badge"
          aria-hidden="true"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            background: "#5932ea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Route 53 cube network glyph */}
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2.5L17 6.5V13.5L10 17.5L3 13.5V6.5L10 2.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 10L10 2.5M10 10L17 13.5M10 10L3 13.5" stroke="#ffffff" strokeWidth="1.3" strokeLinejoin="round"/>
            <circle cx="10" cy="10" r="1.5" fill="#ffffff"/>
          </svg>
        </div>
      </div>

      {/* Grid / waffle icon */}
      <button
        type="button"
        className="aws-topbar-icon-btn"
        title="Services"
        aria-label="Services menu"
        style={{ width: "32px" }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="2.5" cy="2.5" r="1.5"/>
          <circle cx="8" cy="2.5" r="1.5"/>
          <circle cx="13.5" cy="2.5" r="1.5"/>
          <circle cx="2.5" cy="8" r="1.5"/>
          <circle cx="8" cy="8" r="1.5"/>
          <circle cx="13.5" cy="8" r="1.5"/>
          <circle cx="2.5" cy="13.5" r="1.5"/>
          <circle cx="8" cy="13.5" r="1.5"/>
          <circle cx="13.5" cy="13.5" r="1.5"/>
        </svg>
      </button>

      <div className="aws-topbar-sep" aria-hidden="true" style={{ margin: "0 4px" }} />

      {/* Large dark search bar */}
      <div
        className="aws-topbar-search"
        role="search"
        aria-label="AWS global search"
        style={{
          width: "360px",
          height: "30px",
          background: "#232f3e",
          border: "1px solid #545b64",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: "8px",
        }}
      >
        <span className="aws-topbar-search-icon" aria-hidden="true" style={{ color: "#879596", display: "flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <span className="aws-topbar-search-text" style={{ color: "#879596", fontSize: "13px", flex: 1 }}>Search</span>
        <span
          className="aws-topbar-search-shortcut"
          style={{
            fontSize: "11px",
            color: "#d5dbdb",
            background: "#161e2d",
            border: "1px solid #545b64",
            borderRadius: "3px",
            padding: "1px 5px",
          }}
        >
          [Alt+S]
        </span>
      </div>

      <div className="aws-topbar-spacer" aria-hidden="true" />

      {/* Right side utility icons & account */}
      <div className="aws-topbar-right">
        {/* CloudShell icon */}
        <button type="button" className="aws-topbar-icon-btn" title="CloudShell" aria-label="CloudShell" style={{ width: "34px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <polyline points="7 9 10 12 7 15"/>
            <line x1="13" y1="15" x2="17" y2="15"/>
          </svg>
        </button>

        {/* Bell / notifications */}
        <button type="button" className="aws-topbar-icon-btn" title="Notifications" aria-label="Notifications" style={{ width: "34px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Help */}
        <button type="button" className="aws-topbar-icon-btn" title="Help" aria-label="Help" style={{ width: "34px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        {/* Settings */}
        <button type="button" className="aws-topbar-icon-btn" title="Settings" aria-label="Settings" style={{ width: "34px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <div className="aws-topbar-sep" aria-hidden="true" style={{ margin: "0 6px" }} />

        {/* Region */}
        <div className="aws-topbar-region" title="Region: Global" style={{ borderLeft: "none", padding: "0 8px" }}>
          <span>Global</span>
          <span style={{ fontSize: "9px", marginLeft: "4px" }}>▼</span>
        </div>

        <div className="aws-topbar-sep" aria-hidden="true" style={{ margin: "0 6px" }} />

        {/* Account info matching reference with safe mock/demo data only */}
        <div
          className="aws-topbar-account"
          title={`Signed in as ${mockEmail}`}
          style={{
            borderLeft: "none",
            padding: "0 10px",
            background: "rgba(0,0,0,0.15)",
            borderRadius: "4px",
            margin: "0 4px",
            height: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "#d5dbdb", fontWeight: 600 }}>
              {accountDisplay} ({mockAccountId})
            </span>
            <span style={{ fontSize: "8px", color: "#879596" }}>▼</span>
          </div>
          <span style={{ fontSize: "10px", color: "#879596", lineHeight: 1 }}>{accountDisplay}</span>
        </div>

        {/* Sign out */}
        {user && (
          <button
            type="button"
            className="aws-topbar-signout"
            onClick={() => logout()}
            title="Sign out"
            style={{ fontSize: "11px", padding: "0 8px" }}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};
