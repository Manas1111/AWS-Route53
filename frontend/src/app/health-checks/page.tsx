import Link from "next/link";

export default function HealthChecksPage() {
  return (
    <div className="aws-page">
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "16px", color: "var(--aws-text-primary)" }}>
        Health checks
      </h1>
      <div className="aws-panel">
        <div className="aws-panel-header"><h2>Endpoint &amp; Calculated Health Checks</h2></div>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Not implemented in this clone</div>
            <h3 className="aws-placeholder-heading">Health check monitoring is not enabled</h3>
            <p className="aws-placeholder-text">
              Amazon Route 53 health checks monitor endpoints via HTTP, HTTPS, or TCP probes.
              This clone focuses on Hosted Zones and DNS record lifecycle management.
            </p>
            <div className="aws-placeholder-actions">
              <Link href="/hosted-zones" className="aws-btn aws-btn-primary">View hosted zones</Link>
              <Link href="/" className="aws-btn aws-btn-secondary">Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
