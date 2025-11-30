import { notFound } from "next/navigation";
import { getVoucherById } from "@/actions/vouchers";
import { VoucherForm } from "@/app/(admin)/admin/vouchers/voucher-form";

interface EditVoucherPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditVoucherPage({ params }: EditVoucherPageProps) {
  const { id } = await params;
  const voucher = await getVoucherById(id);
  if (!voucher) {
    notFound();
  }

  return <VoucherForm mode="edit" voucher={voucher} />;
}
