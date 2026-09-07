"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Hosted zones", href: "/hosted-zones" },
  { label: "Health checks", href: "/health-checks" },
  { label: "Traffic policies", href: "/traffic-policies" },
  { label: "Resolver", href: "/resolver" },
  { label: "Profiles", href: "/profiles" },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

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
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
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
        </nav>
      </aside>
    </>
  );
};
