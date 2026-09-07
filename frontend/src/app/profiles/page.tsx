import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProfilesPage() {
  return (
    <PageContainer
      title="Route 53 Profiles"
      description="Manage and share unified DNS configurations across multiple VPCs and AWS accounts."
      actions={
        <Link href="/hosted-zones" className="aws-btn aws-btn-primary">
          Go to Hosted zones
        </Link>
      }
    >
      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Route 53 Profiles Configuration</h2>
        </div>
        <div className="aws-panel-body">
          <div className="aws-placeholder-box">
            <div className="aws-placeholder-badge">Feature Status: Coming Soon</div>
            <h3 className="aws-placeholder-heading">
              Route 53 Profiles are not enabled in this clone environment
            </h3>
            <p className="aws-placeholder-text">
              Amazon Route 53 Profiles allows you to create collections of DNS rules, private hosted zones, and resolver configurations to associate them with multiple VPCs. Use Hosted zones for individual domain and record lifecycle management.
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
