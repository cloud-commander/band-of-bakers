import { VoucherForm } from "@/app/(admin)/admin/vouchers/voucher-form";

export const dynamic = "force-dynamic";

export default function NewVoucherPage() {
  return <VoucherForm mode="create" />;
}
