"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/state/page-header";
import { getBakeSales, deleteBakeSale } from "@/actions/bake-sales";
import { getAllLocations, deleteLocation } from "@/actions/locations";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BakeSaleDialog } from "@/components/admin/bake-sale-dialog";
import { LocationDialog } from "@/components/admin/location-dialog";
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

type Location = {
  id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  collection_hours: string | null;
  is_active: boolean;
};

export default function AdminBakeSalesPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);
  const [locationsPage, setLocationsPage] = useState(1);

  const [upcomingBakeSales, setUpcomingBakeSales] = useState<BakeSale[]>([]);
  const [archivedBakeSales, setArchivedBakeSales] = useState<BakeSale[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingBakeSale, setEditingBakeSale] = useState<BakeSale | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isLocationCreateDialogOpen, setIsLocationCreateDialogOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const { upcoming, archived } = await getBakeSales();
      setUpcomingBakeSales(upcoming as BakeSale[]);
      setArchivedBakeSales(archived as BakeSale[]);

      const locs = await getAllLocations();
      setLocations(locs as Location[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteBakeSale(id);
      if (result.success) {
        toast.success("Bake sale deleted successfully");
        fetchData(); // Refresh list
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

  const handleDeleteLocation = async (id: string) => {
    setDeletingLocationId(id);
    try {
      const result = await deleteLocation(id);
      if (result.success) {
        toast.success("Location deleted successfully");
        fetchData(); // Refresh list
      } else {
        toast.error(result.error || "Failed to delete location");
      }
    } catch (error) {
      console.error("Delete location error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeletingLocationId(null);
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

  // Calculate pagination for locations
  const totalLocationsPages = Math.ceil(locations.length / ITEMS_PER_PAGE);
  const startLocationsIndex = (locationsPage - 1) * ITEMS_PER_PAGE;
  const endLocationsIndex = startLocationsIndex + ITEMS_PER_PAGE;
  const paginatedLocations = locations.slice(startLocationsIndex, endLocationsIndex);

  const handleUpcomingPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArchivedPageChange = (page: number) => {
    setArchivedPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLocationsPageChange = (page: number) => {
    setLocationsPage(page);
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

  const renderLocationsTable = (locs: typeof paginatedLocations) => (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Address</th>
              <th className="text-left p-4 font-medium">City</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locs.map((loc) => (
              <tr key={loc.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">{loc.name}</td>
                <td className="p-4 text-sm">
                  {loc.address_line1}
                  {loc.address_line2 && `, ${loc.address_line2}`}
                </td>
                <td className="p-4 text-sm">
                  {loc.city}, {loc.postcode}
                </td>
                <td className="p-4">
                  <Badge variant={loc.is_active ? "default" : "secondary"}>
                    {loc.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingLocation(loc);
                        setIsLocationDialogOpen(true);
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
                          <AlertDialogTitle>Delete Location?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the location
                            &quot;{loc.name}&quot;. Note: You cannot delete a location if it has
                            associated bake sales.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingLocationId === loc.id ? (
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
        {locs.map((loc) => (
          <div key={loc.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-sm">{loc.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {loc.address_line1}, {loc.city}
                </p>
              </div>
              <Badge variant={loc.is_active ? "default" : "secondary"}>
                {loc.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingLocation(loc);
                  setIsLocationDialogOpen(true);
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
                    <AlertDialogTitle>Delete Location?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the location &quot;
                      {loc.name}&quot;.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deletingLocationId === loc.id ? (
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
          activeTab === "locations" ? (
            <LocationDialog
              mode="create"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Location
                </Button>
              }
              open={isLocationCreateDialogOpen}
              onOpenChange={(open) => {
                setIsLocationCreateDialogOpen(open);
                if (!open) fetchData();
              }}
            />
          ) : (
            <BakeSaleDialog
              mode="create"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Bake Sale
                </Button>
              }
              onOpenChange={(open) => !open && fetchData()}
            />
          )
        }
      />

      <BakeSaleDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingBakeSale(null);
            fetchData();
          }
        }}
        bakeSale={editingBakeSale || undefined}
      />

      <LocationDialog
        mode="edit"
        open={isLocationDialogOpen}
        onOpenChange={(open) => {
          setIsLocationDialogOpen(open);
          if (!open) {
            setEditingLocation(null);
            fetchData();
          }
        }}
        location={editingLocation || undefined}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBakeSales.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedBakeSales.length})</TabsTrigger>
          <TabsTrigger value="locations">Locations ({locations.length})</TabsTrigger>
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

        <TabsContent value="locations">
          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={locationsPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={locations.length}
            />
          </div>

          {locations.length > 0 ? (
            <>
              {renderLocationsTable(paginatedLocations)}

              {/* Pagination Controls */}
              {totalLocationsPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-6">
                  <Pagination
                    currentPage={locationsPage}
                    totalPages={totalLocationsPages}
                    onPageChange={handleLocationsPageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <p>No locations found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
