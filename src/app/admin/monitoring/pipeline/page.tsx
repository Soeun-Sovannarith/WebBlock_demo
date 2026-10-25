import { PageHeader } from "@/components/common/page-header";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminPipelinePage() {
  await requireAdmin();
  return <PageHeader title="Pipeline monitoring" />;
}
