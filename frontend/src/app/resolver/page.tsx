import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ResolverPage() {
  return (
    <PageContainer
      title="Route 53 Resolver"
      description="Route DNS queries between Amazon VPCs and your on-premises data centers."
      actions={
        <Link href="/hosted-zones" className="aws-btn aws-btn-primary">
          Go to Hosted zones
        </Link>
      }
    >
      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Inbound & Outbound Resolver Endpoints</h2>
        </div>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Feature Status: Coming Soon</div>
            <h3 className="aws-placeholder-heading">
              Route 53 Resolver endpoints are not enabled in this clone environment
            </h3>
            <p className="aws-placeholder-text">
              Amazon Route 53 Resolver provides recursive DNS services for VPCs and on-premises networks using forwarding rules and dedicated network interfaces. In this local clone, private and public zone name resolution is managed via Hosted zones.
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
