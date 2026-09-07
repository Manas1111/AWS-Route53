"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIMPLE_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Hosted zones", href: "/hosted-zones" },
  { label: "Health checks", href: "/health-checks", placeholder: true },
  { label: "Profiles", href: "/profiles", placeholder: true },
];

type SectionItem = {
  label: string;
  href: string;
  badge?: string;
};

type Section = {
  label: string;
  defaultOpen?: boolean;
  items: SectionItem[];
};

const SECTIONS: Section[] = [
  {
    label: "Global Resolver",
    defaultOpen: true,
    items: [
      { label: "Global resolvers", href: "/resolver", badge: "New" },
      { label: "Shared DNS views", href: "/resolver#shared", badge: "New" },
    ],
  },
  {
    label: "VPC Resolver",
    defaultOpen: true,
    items: [
      { label: "VPCs", href: "/resolver#vpcs" },
      { label: "Inbound endpoints", href: "/resolver#inbound" },
      { label: "Outbound endpoints", href: "/resolver#outbound" },
      { label: "Rules", href: "/resolver#rules" },
      { label: "Query logging", href: "/resolver#logging" },
      { label: "Outposts", href: "/resolver#outposts" },
    ],
  },
  {
    label: "Domains",
    defaultOpen: true,
    items: [
      { label: "Registered domains", href: "/profiles#domains" },
      { label: "Requests", href: "/profiles#requests" },
    ],
  },
  {
    label: "IP-based routing",
    defaultOpen: false,
    items: [
      { label: "CIDR collections", href: "/traffic-policies" },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.label, s.defaultOpen ?? false]))
  );

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]) && !href.includes("#");
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

      <aside className={`aws-sidebar ${isOpen ? "open" : ""}`} aria-label="Route 53 navigation">
        <div className="aws-sidebar-header">
          <span className="aws-sidebar-title">Route 53</span>
          <button
            type="button"
            className="aws-sidebar-collapse"
            onClick={onClose}
            aria-label="Collapse navigation"
            title="Collapse"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            &lt;
          </button>
        </div>

        <nav className="aws-sidebar-nav">
          {/* Top-level flat items */}
          {SIMPLE_ITEMS.map((item) => {
            const active = isActive(item.href);
            if (item.placeholder) {
              return (
                <span
                  key={item.href}
                  className={`aws-nav-flat-item${active ? " active" : ""}`}
                  style={{ cursor: "default", opacity: 0.6 }}
                  title="Not implemented in this clone"
                >
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`aws-nav-flat-item${active ? " active" : ""}`}
                onClick={() => {
                  if (window.innerWidth < 901) onClose();
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Collapsible sections */}
          {SECTIONS.map((section) => {
            const isOpen = openSections[section.label];
            return (
              <div key={section.label}>
                <button
                  type="button"
                  className="aws-nav-section-header"
                  onClick={() => toggleSection(section.label)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`aws-nav-section-arrow ${isOpen ? "open" : "closed"}`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                  <span>{section.label}</span>
                </button>

                {isOpen && (
                  <div className="aws-nav-section-items">
                    {section.items.map((item) => (
                      <span
                        key={item.href}
                        className="aws-nav-sub-item"
                        style={{ cursor: "default", opacity: 0.65 }}
                        title="Not implemented in this clone"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="aws-nav-badge">{item.badge}</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
