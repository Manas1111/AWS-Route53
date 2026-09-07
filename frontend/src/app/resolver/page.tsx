import Link from "next/link";

export default function ResolverPage() {
  return (
    <div className="aws-page">
      <div className="aws-page-title-row">
        <h1 className="aws-page-h1">Resolver</h1>
      </div>
      <div className="aws-panel" style={{ marginTop: "16px" }}>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Coming Soon</div>
            <h2 className="aws-placeholder-heading">Coming Soon</h2>
            <p className="aws-placeholder-text">
              Route 53 Resolver is not implemented in this version of the Route 53 console. Private and public DNS resolution can be configured through Hosted zones.
            </p>
            <div className="aws-placeholder-actions">
              <Link href="/hosted-zones" className="aws-btn aws-btn-primary">
                View hosted zones
              </Link>
              <Link href="/" className="aws-btn aws-btn-secondary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
