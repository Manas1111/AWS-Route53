import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
  children,
}) => {
  return (
    <div className="aws-page-container">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="aws-breadcrumbs">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="aws-breadcrumb-item">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "aws-breadcrumb-current" : "aws-breadcrumb-item"}>
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span className="aws-breadcrumb-separator" aria-hidden="true">
                    {/* chevron right */}
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M1.5 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}
      <header className="aws-page-header">
        <div className="aws-page-header-text">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="aws-page-header-actions">{actions}</div>}
      </header>
      <main>{children}</main>
    </div>
  );
};
