import { notFound } from "next/navigation";
import { getVoucherById } from "@/actions/vouchers";
import { VoucherForm } from "@/app/(admin)/admin/vouchers/voucher-form";

interface EditVoucherPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function EditVoucherPage({ params }: EditVoucherPageProps) {
  const voucher = await getVoucherById(params.id);
  if (!voucher) {
    notFound();
  }

  return <VoucherForm mode="edit" voucher={voucher} />;
}
