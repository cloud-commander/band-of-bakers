import { PageHeader } from "@/components/state/page-header";
import { ImageGallery } from "@/components/admin/image-gallery";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Image Gallery"
        description="Manage your product images and assets."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <div className="bg-card border rounded-lg p-6">
        <ImageGallery mode="manager" />
      </div>
    </div>
  );
}
