import { PageHeader } from "@/components/state/page-header";
import { getVouchers } from "@/actions/vouchers";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VouchersTable } from "@/components/admin/vouchers-table";

export const dynamic = "force-dynamic";

export default async function AdminVouchersPage() {
  const vouchers = await getVouchers();

  return (
    <div>
      <PageHeader
        title="Vouchers"
        description="Manage discount vouchers and promotional codes"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Voucher
          </Button>
        }
      />

      <VouchersTable vouchers={vouchers} />
    </div>
  );
}
