import Link from "next/link";

export default function HealthChecksPage() {
  return (
    <div className="aws-page">
      <div className="aws-page-title-row">
        <h1 className="aws-page-h1">
          Health checks
          <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--aws-link)", cursor: "pointer", marginLeft: "8px" }}>Info</span>
        </h1>
      </div>
      <div className="aws-panel" style={{ marginTop: "16px" }}>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Coming Soon</div>
            <h2 className="aws-placeholder-heading">Health checks is coming soon</h2>
            <p className="aws-placeholder-text">
              Health checks are not implemented in this version of the Route 53 console. Hosted zones and DNS record management are available.
            </p>
            <div className="aws-placeholder-actions">
              <Link href="/hosted-zones" className="aws-btn aws-btn-primary">
                View hosted zones
              </Link>
              <Link href="/dashboard" className="aws-btn aws-btn-secondary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
