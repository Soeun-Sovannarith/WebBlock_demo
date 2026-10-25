import { PageHeader } from "@/components/common/page-header";
import { requireUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  await requireUser();
  return <PageHeader title="Profile" />;
}
