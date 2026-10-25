import { PageHeader } from "@/components/common/page-header";
import { requireUser } from "@/lib/auth/session";

export default async function PlansPage() {
  await requireUser();
  return <PageHeader title="Choose a plan" />;
}
