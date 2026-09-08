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
      {/* AWS logo image — /aws-logo.png with white letters and orange smile */}
      <div
        className="aws-topbar-logo"
        aria-label="AWS Console Home"
        style={{ padding: "0 8px", display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            position: "relative",
            width: "48px",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Bottom layer: preserves original orange AWS smile */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aws-logo.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              clipPath: "inset(55% 0 0 0)",
              pointerEvents: "none",
            }}
          />
          {/* Top layer: aws letters turned white via CSS filter */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aws-logo.png"
            alt="AWS"
            style={{
              width: "48px",
              height: "auto",
              display: "block",
              objectFit: "contain",
              clipPath: "inset(0 0 42% 0)",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>
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
