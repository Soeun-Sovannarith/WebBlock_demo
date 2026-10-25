import { PageHeader } from "@/components/common/page-header";
import { requireUser } from "@/lib/auth/session";

export default async function TemplatesPage() {
  await requireUser();
  return <PageHeader title="Templates" />;
}
