"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface ServiceNavBarProps {
  onToggleSidebar: () => void;
  breadcrumbs?: BreadcrumbSegment[];
}

export const ServiceNavBar: React.FC<ServiceNavBarProps> = ({
  onToggleSidebar,
  breadcrumbs = [],
}) => {
  return (
    <div className="aws-navbar" role="navigation" aria-label="Service navigation">
      {/* Solid blue circular hamburger toggle */}
      <button
        type="button"
        className="aws-navbar-hamburger-circle"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation panel"
        title="Toggle navigation panel"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#ffffff" aria-hidden="true">
          <rect x="2" y="3" width="12" height="1.8" rx="0.5"/>
          <rect x="2" y="7.1" width="12" height="1.8" rx="0.5"/>
          <rect x="2" y="11.2" width="12" height="1.8" rx="0.5"/>
        </svg>
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="aws-navbar-breadcrumbs">
        {breadcrumbs.map((segment, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <React.Fragment key={i}>
              {segment.href && !isLast ? (
                <Link href={segment.href} className="aws-navbar-breadcrumb-link" style={{ color: "var(--aws-link)", fontWeight: 500 }}>
                  {segment.label}
                </Link>
              ) : (
                <span className={isLast ? "aws-navbar-breadcrumb-current" : "aws-navbar-breadcrumb-link"} style={{ fontWeight: isLast ? 700 : 500, color: isLast ? "var(--aws-text-primary)" : "var(--aws-link)" }}>
                  {segment.label}
                </span>
              )}
              {!isLast && (
                <span className="aws-navbar-breadcrumb-sep" aria-hidden="true" style={{ color: "var(--aws-text-secondary)", margin: "0 4px" }}>&gt;</span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right info icon */}
      <div className="aws-navbar-right" style={{ paddingRight: "12px" }}>
        <button
          type="button"
          className="aws-navbar-icon-btn"
          title="Information"
          aria-label="Page information"
          style={{ border: "none", color: "var(--aws-text-secondary)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="8"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
