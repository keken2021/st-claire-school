import { GALLERY_DIR } from "@/lib/gallery-files";
import { Card, HelpBox, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  return (
    <div>
      <PageHeader
        title="Photo Gallery"
        description="Photos on the gallery page are loaded from files on the computer — not uploaded through this screen. Follow the steps below or ask your developer to add pictures for you."
      />

      <HelpBox title="How to add photos (for your developer)">
        This website manager does not upload photos directly. Someone with access to the project
        files adds images to the gallery folder, then refreshes the site.
      </HelpBox>

      <Card className="mt-8 space-y-5">
        <p className="text-lg font-semibold text-ink">Step-by-step</p>
        <ol className="list-decimal space-y-4 pl-6 text-base leading-relaxed text-ink/80">
          <li>
            Save photo files (JPG or PNG) into the gallery folder on the computer that hosts the
            website.
          </li>
          <li>
            Optional: put photos in subfolders named{" "}
            <strong>Classes</strong>, <strong>Events</strong>, or{" "}
            <strong>Student Performances</strong> so they group nicely on the page.
          </li>
          <li>
            Refresh or redeploy the website — new photos appear automatically. No button to press
            here.
          </li>
        </ol>
        <div className="rounded-xl bg-mist/60 px-4 py-3.5 text-sm text-ink/65">
          <p className="font-medium text-ink/80">Folder location on this computer:</p>
          <p className="mt-1 break-all font-mono text-xs sm:text-sm">{GALLERY_DIR}</p>
        </div>
      </Card>
    </div>
  );
}
