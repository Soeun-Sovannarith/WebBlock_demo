import { PageHeader } from "@/components/common/page-header";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminOverviewPage() {
  await requireAdmin();
  return <PageHeader title="Overview" />;
}
