import { PageHeader } from "@/components/common/page-header";
import { requireWebsiteOwner } from "@/lib/auth/session";

export default async function DeployPage({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const { websiteId } = await params;
  await requireWebsiteOwner(websiteId);
  return <PageHeader title="Deploy" />;
}
