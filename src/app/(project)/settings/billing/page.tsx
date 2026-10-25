import { PageHeader } from "@/components/common/page-header";
import { requireUser } from "@/lib/auth/session";

export default async function BillingSettingsPage() {
  await requireUser();
  return <PageHeader title="Billing" />;
}
