import { PageHeader } from "@/components/common/page-header";
import { requireUser } from "@/lib/auth/session";

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  await requireUser();
  return <PageHeader title="Payment" description={`Order ${orderId}`} />;
}
