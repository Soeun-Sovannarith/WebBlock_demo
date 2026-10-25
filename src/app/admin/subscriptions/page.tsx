import { PageHeader } from "@/components/common/page-header";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminSubscriptionsPage() {
  await requireAdmin();
  return <PageHeader title="Subscriptions" />;
}
