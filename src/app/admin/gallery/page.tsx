import { getAdminGallery } from "@/lib/content";
import GalleryForm from "@/components/admin/GalleryForm";
import { Card } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getAdminGallery();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink">Gallery</h1>
      <p className="mt-1.5 text-sm text-ink/70">
        Captions and categories for published photos. Unpublish anything that should not be public,
        for example a photo a family has asked us to remove.
      </p>

      <ul className="mt-6 space-y-4">
        {images.map((image) => (
          <li key={image.id}>
            <Card>
              <GalleryForm
                image={image}
                isVisible={image.isVisible}
                sortOrder={image.sortOrder}
              />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
