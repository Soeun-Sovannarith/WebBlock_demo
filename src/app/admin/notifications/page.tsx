import { PageHeader } from "@/components/common/page-header";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminNotificationsPage() {
  await requireAdmin();
  return <PageHeader title="Notifications" />;
}
