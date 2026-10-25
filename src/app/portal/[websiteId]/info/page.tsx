import { PageHeader } from "@/components/common/page-header";
import { requireWebsiteOwner } from "@/lib/auth/session";

export default async function BusinessInfoPage({
  params,
}: {
  params: Promise<{ websiteId: string }>;
}) {
  const { websiteId } = await params;
  await requireWebsiteOwner(websiteId);
  return <PageHeader title="Business info" />;
}
