"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ConsoleHeader } from "./ConsoleHeader";
import { ServiceNavBar } from "./ServiceNavBar";
import { Sidebar } from "./Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface ConsoleLayoutProps {
  children: React.ReactNode;
}

/**
 * Derive breadcrumbs from the current pathname.
 * We pass them to the ServiceNavBar so the secondary bar always shows
 * "Route 53 > Current page" like the real AWS console.
 */
function getBreadcrumbs(pathname: string) {
  const base = [{ label: "Route 53", href: "/" }];

  if (pathname === "/" || pathname === "") {
    return [...base, { label: "Dashboard" }];
  }
  if (pathname.startsWith("/hosted-zones/create")) {
    return [
      ...base,
      { label: "Hosted zones", href: "/hosted-zones" },
      { label: "Create hosted zone" },
    ];
  }
  if (pathname.startsWith("/hosted-zones/") && pathname.length > "/hosted-zones/".length) {
    return [
      ...base,
      { label: "Hosted zones", href: "/hosted-zones" },
      { label: "Zone details" },
    ];
  }
  if (pathname === "/hosted-zones") {
    return [...base, { label: "Hosted zones" }];
  }
  if (pathname === "/health-checks") {
    return [...base, { label: "Health checks" }];
  }
  if (pathname === "/traffic-policies") {
    return [...base, { label: "Traffic policies" }];
  }
  if (pathname === "/profiles") {
    return [...base, { label: "Profiles" }];
  }
  if (pathname === "/resolver") {
    return [...base, { label: "Resolver" }];
  }
  return base;
}

export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <div className="aws-auth-wrapper">{children}</div>;
  }

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <ProtectedRoute>
      <div className="aws-console-root">
        {/* Dark global header */}
        <ConsoleHeader />

        {/* White service nav bar with breadcrumbs */}
        <ServiceNavBar
          onToggleSidebar={() => setIsSidebarOpen((p) => !p)}
          breadcrumbs={breadcrumbs}
        />

        {/* Body: sidebar + workspace */}
        <div className="aws-console-body">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="aws-workspace" id="main-content" role="main">
            {children}
          </main>
        </div>

        {/* AWS Console Footer matching reference screenshot */}
        <footer className="aws-console-footer" role="contentinfo">
          <div className="aws-footer-left">
            <span className="aws-footer-item">
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>&gt;_</span> CloudShell
            </span>
            <span className="aws-footer-item">Agent Toolkit for AWS</span>
            <span className="aws-footer-item">Feedback</span>
            <span className="aws-footer-item">Console Mobile App</span>
          </div>
          <div className="aws-footer-right">
            <span>&copy; 2026, Amazon Web Services, Inc. or its affiliates.</span>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cookie preferences</a>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};
