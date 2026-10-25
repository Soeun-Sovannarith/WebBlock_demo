import { PageHeader } from "@/components/common/page-header";
import { requireUser } from "@/lib/auth/session";

export default async function WebsitesPage() {
  await requireUser();
  return <PageHeader title="My websites" />;
}
