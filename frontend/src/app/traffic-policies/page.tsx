import Link from "next/link";

export default function TrafficPoliciesPage() {
  return (
    <div className="aws-page">
      <div className="aws-page-title-row">
        <h1 className="aws-page-h1">
          Traffic policies
          <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--aws-link)", cursor: "pointer", marginLeft: "8px" }}>Info</span>
        </h1>
      </div>
      <div className="aws-panel" style={{ marginTop: "16px" }}>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Coming Soon</div>
            <h2 className="aws-placeholder-heading">Traffic policies is coming soon</h2>
            <p className="aws-placeholder-text">
              Traffic policies are not implemented in this version of the Route 53 console. Authoritative DNS records can be managed directly in Hosted zones.
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
