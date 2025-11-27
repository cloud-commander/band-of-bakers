"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/state/page-header";
import { getBakeSales, deleteBakeSale } from "@/actions/bake-sales";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BakeSaleDialog } from "@/components/admin/bake-sale-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_BAKE_SALES_ITEMS_PER_PAGE;

// Define type locally since we don't have it exported from schema yet in a way client can use easily without imports
type BakeSale = {
  id: string;
  date: string;
  location_id: string;
  cutoff_datetime: string;
  is_active: boolean;
  location: {
    name: string;
  };
};

export default function AdminBakeSalesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);
  const [upcomingBakeSales, setUpcomingBakeSales] = useState<BakeSale[]>([]);
  const [archivedBakeSales, setArchivedBakeSales] = useState<BakeSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBakeSale, setEditingBakeSale] = useState<BakeSale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch bake sales
  const fetchBakeSales = async () => {
    setLoading(true);
    try {
      const { upcoming, archived } = await getBakeSales();
      setUpcomingBakeSales(upcoming as BakeSale[]); // Type assertion needed due to serialization
      setArchivedBakeSales(archived as BakeSale[]);
    } catch (error) {
      console.error("Failed to fetch bake sales:", error);
      toast.error("Failed to load bake sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBakeSales();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteBakeSale(id);
      if (result.success) {
        toast.success("Bake sale deleted successfully");
        fetchBakeSales(); // Refresh list
      } else {
        toast.error(result.error || "Failed to delete bake sale");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate pagination for upcoming
  const totalUpcomingPages = Math.ceil(upcomingBakeSales.length / ITEMS_PER_PAGE);
  const startUpcomingIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endUpcomingIndex = startUpcomingIndex + ITEMS_PER_PAGE;
  const paginatedUpcoming = upcomingBakeSales.slice(startUpcomingIndex, endUpcomingIndex);

  // Calculate pagination for archived
  const totalArchivedPages = Math.ceil(archivedBakeSales.length / ITEMS_PER_PAGE);
  const startArchivedIndex = (archivedPage - 1) * ITEMS_PER_PAGE;
  const endArchivedIndex = startArchivedIndex + ITEMS_PER_PAGE;
  const paginatedArchived = archivedBakeSales.slice(startArchivedIndex, endArchivedIndex);

  const handleUpcomingPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArchivedPageChange = (page: number) => {
    setArchivedPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBakeSalesTable = (bakeSales: typeof paginatedUpcoming, isArchived = false) => (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Location</th>
              <th className="text-left p-4 font-medium">Cutoff</th>
              {!isArchived && <th className="text-left p-4 font-medium">Status</th>}
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
                  {new Date(bakeSale.cutoff_datetime).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                {!isArchived && (
                  <td className="p-4">
                    <Badge variant={bakeSale.is_active ? "default" : "secondary"}>
                      {bakeSale.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                )}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingBakeSale(bakeSale);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Bake Sale?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the bake sale
                            scheduled for {new Date(bakeSale.date).toLocaleDateString()}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(bakeSale.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === bakeSale.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {bakeSales.map((bakeSale) => (
          <div
            key={bakeSale.id}
            className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-sm">
                  {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{bakeSale.location.name}</p>
              </div>
              {!isArchived && (
                <Badge variant={bakeSale.is_active ? "default" : "secondary"}>
                  {bakeSale.is_active ? "Active" : "Inactive"}
                </Badge>
              )}
            </div>

            <div className="text-sm mb-4">
              <p className="text-xs text-muted-foreground">Cutoff</p>
              <p className="font-medium">
                {new Date(bakeSale.cutoff_datetime).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingBakeSale(bakeSale);
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Bake Sale?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the bake sale
                      scheduled for {new Date(bakeSale.date).toLocaleDateString()}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(bakeSale.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deletingId === bakeSale.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Bake Sales"
        description="Manage upcoming and archived bake sale dates"
        actions={
          <BakeSaleDialog
            mode="create"
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Bake Sale
              </Button>
            }
            onOpenChange={(open) => !open && fetchBakeSales()}
          />
        }
      />

      <BakeSaleDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingBakeSale(null);
            fetchBakeSales();
          }
        }}
        bakeSale={editingBakeSale || undefined}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBakeSales.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedBakeSales.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={upcomingBakeSales.length}
            />
          </div>

          {upcomingBakeSales.length > 0 ? (
            <>
              {renderBakeSalesTable(paginatedUpcoming, false)}

              {/* Pagination Controls */}
              {totalUpcomingPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalUpcomingPages}
                    onPageChange={handleUpcomingPageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <p>No upcoming bake sales scheduled.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={archivedPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={archivedBakeSales.length}
            />
          </div>

          {archivedBakeSales.length > 0 ? (
            <>
              {renderBakeSalesTable(paginatedArchived, true)}

              {/* Pagination Controls */}
              {totalArchivedPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-6">
                  <Pagination
                    currentPage={archivedPage}
                    totalPages={totalArchivedPages}
                    onPageChange={handleArchivedPageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <p>No archived bake sales yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
