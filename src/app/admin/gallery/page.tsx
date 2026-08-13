import { GALLERY_DIR } from "@/lib/gallery-files";
import { Card } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-display text-ink">Gallery</h1>
      <p className="mt-1.5 text-sm text-ink/70">
        Photos are not stored in the database. Add files on disk and they appear on the public
        gallery page.
      </p>

      <Card className="mt-6 space-y-3 text-sm text-ink/80 leading-relaxed">
        <p className="font-medium text-ink">How to add photos</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Put image files in{" "}
            <code className="rounded bg-mist px-1.5 py-0.5 text-xs">public/images/gallery/</code>
          </li>
          <li>
            Optional: use a category subfolder such as{" "}
            <code className="rounded bg-mist px-1.5 py-0.5 text-xs">Classes</code>,{" "}
            <code className="rounded bg-mist px-1.5 py-0.5 text-xs">Events</code>, or{" "}
            <code className="rounded bg-mist px-1.5 py-0.5 text-xs">Student Performances</code>
          </li>
          <li>Redeploy or refresh the site — no admin upload or database row needed</li>
        </ol>
        <p className="text-xs text-ink/65">
          Expected path on this machine: <code className="break-all">{GALLERY_DIR}</code>
        </p>
      </Card>
    </div>
  );
}
