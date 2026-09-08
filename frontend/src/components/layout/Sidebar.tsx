"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

const DashboardIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const HostedZonesIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const TrafficPoliciesIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const HealthChecksIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ResolverIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="3" />
    <circle cx="6" cy="19" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.5" y1="16.5" x2="10.5" y2="7.5" />
    <line x1="15.5" y1="16.5" x2="13.5" y2="7.5" />
  </svg>
);

const ProfilesIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Hosted zones", href: "/hosted-zones", icon: HostedZonesIcon },
  { label: "Traffic policies", href: "/traffic-policies", icon: TrafficPoliciesIcon },
  { label: "Health checks", href: "/health-checks", icon: HealthChecksIcon },
  { label: "Resolver", href: "/resolver", icon: ResolverIcon },
  { label: "Profiles", href: "/profiles", icon: ProfilesIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="aws-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`aws-sidebar ${isOpen ? "open" : ""}`}
        aria-label="Route 53 navigation"
      >
        <div className="aws-sidebar-header">
          {isOpen && <span className="aws-sidebar-title">Route 53</span>}
          <button
            type="button"
            className="aws-sidebar-collapse"
            onClick={isOpen ? onClose : handleToggle}
            aria-label={isOpen ? "Collapse navigation" : "Expand navigation"}
            title={isOpen ? "Collapse navigation" : "Expand navigation"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isOpen ? (
                <polyline points="10 13 5 8 10 3" />
              ) : (
                <polyline points="6 13 11 8 6 3" />
              )}
            </svg>
          </button>
        </div>

        <nav className="aws-sidebar-nav" aria-label="Route 53 menu">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`aws-nav-flat-item${active ? " active" : ""}`}
                title={item.label}
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 901) {
                    onClose();
                  }
                }}
              >
                <span className="aws-nav-item-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="aws-nav-item-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
