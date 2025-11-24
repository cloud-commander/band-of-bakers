import { PageHeader } from "@/components/state/page-header";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminBakeSalesPage() {
  const bakeSales = mockBakeSalesWithLocation;

  return (
    <div>
      <PageHeader
        title="Bake Sales"
        description="Manage upcoming bake sale dates"
        actions={<Button>Add Bake Sale</Button>}
      />

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Location</th>
              <th className="text-left p-4 font-medium">Cutoff</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bakeSales.map((bakeSale) => (
              <tr key={bakeSale.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">
                  {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 text-sm">{bakeSale.location.name}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(bakeSale.cutoff_datetime).toLocaleDateString("en-GB")}
                </td>
                <td className="p-4">
                  <Badge variant={bakeSale.is_active ? "default" : "secondary"}>
                    {bakeSale.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
