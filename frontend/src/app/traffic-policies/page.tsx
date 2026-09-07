import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function TrafficPoliciesPage() {
  return (
    <PageContainer
      title="Traffic policies"
      description="Visual traffic policies simplify complex routing configurations across multiple endpoints."
      actions={
        <Link href="/hosted-zones" className="aws-btn aws-btn-primary">
          Go to Hosted zones
        </Link>
      }
    >
      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Traffic Flow Policy Management</h2>
        </div>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Feature Status: Coming Soon</div>
            <h3 className="aws-placeholder-heading">
              Traffic policies are not enabled in this clone environment
            </h3>
            <p className="aws-placeholder-text">
              Amazon Route 53 traffic flow simplifies DNS routing by enabling visual creation of routing policies across geoproximity, latency, failover, and multivalue configurations. In this local Route 53 clone, authoritative DNS records are managed directly within Hosted zones.
            </p>
            <div className="aws-placeholder-actions">
              <Link href="/hosted-zones" className="aws-btn aws-btn-primary">
                View hosted zones
              </Link>
              <Link href="/" className="aws-btn aws-btn-secondary">
                Console overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
