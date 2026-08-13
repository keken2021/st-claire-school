import type { GalleryImage, Program, Testimonial } from "@/types";
import { programs as seedPrograms } from "@/data/programs";
import { testimonials as seedTestimonials } from "@/data/testimonials";
import { isDatabaseConfigured, prisma } from "./db";
import { loadGalleryFromFiles } from "./gallery-files";

/**
 * Content read layer.
 *
 * When a database is configured the school's own edits are the source of truth.
 * Otherwise the seed content in src/data is served, which keeps local dev, CI,
 * and preview builds working without secrets. Read failures fall back rather
 * than taking the marketing site down.
 */

let warnedOnce = false;

function warnFallback(scope: string, error: unknown) {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn(
    `[content] Falling back to seed content for ${scope}. Reason:`,
    error instanceof Error ? error.message : error
  );
}

export async function getPrograms(): Promise<Program[]> {
  if (!prisma) return activeSeedPrograms();

  try {
    const rows = await prisma.program.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        slots: { where: { isActive: true }, orderBy: [{ dayOfWeek: "asc" }, { startMinutes: "asc" }] },
        tuition: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (rows.length === 0) return activeSeedPrograms();
    return rows as unknown as Program[];
  } catch (error) {
    warnFallback("programs", error);
    return activeSeedPrograms();
  }
}

export async function getProgram(slug: string): Promise<Program | null> {
  if (!prisma) return seedProgram(slug);

  try {
    const row = await prisma.program.findUnique({
      where: { slug },
      include: {
        slots: { where: { isActive: true }, orderBy: [{ dayOfWeek: "asc" }, { startMinutes: "asc" }] },
        tuition: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (row?.isActive) return row as unknown as Program;
    // Prefer a live DB row; otherwise fall back to seed so local/preview builds
    // still resolve pages when the database is empty or temporarily unreachable.
    return seedProgram(slug);
  } catch (error) {
    warnFallback("program detail", error);
    return seedProgram(slug);
  }
}

/**
 * Admin reads deliberately do not fall back on error: staff must never be shown
 * seed content that looks editable but is not. When there is no database at all
 * the seed content is returned read-only so the interface can still be explored,
 * and every save reports that no database is configured.
 */
export type Editable<T> = T & { isVisible: boolean; sortOrder: number };

export async function getAdminPrograms(): Promise<Program[]> {
  if (!prisma) return seedPrograms;

  const rows = await prisma.program.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      slots: { orderBy: [{ dayOfWeek: "asc" }, { startMinutes: "asc" }] },
      tuition: { orderBy: { sortOrder: "asc" } },
    },
  });
  return rows as unknown as Program[];
}

export async function getAdminProgram(id: string): Promise<Program | null> {
  if (!prisma) return seedPrograms.find((program) => program.id === id) ?? null;

  const row = await prisma.program.findUnique({
    where: { id },
    include: {
      slots: { orderBy: [{ dayOfWeek: "asc" }, { startMinutes: "asc" }] },
      tuition: { orderBy: { sortOrder: "asc" } },
    },
  });
  return row as unknown as Program | null;
}

export async function getAdminTestimonials(): Promise<Editable<Testimonial>[]> {
  if (!prisma) {
    return seedTestimonials.map((testimonial, index) => ({
      ...testimonial,
      isVisible: true,
      sortOrder: index + 1,
    }));
  }

  const rows = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return rows as unknown as Editable<Testimonial>[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!prisma) return seedTestimonials;

  try {
    const rows = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return seedTestimonials;
    return rows as unknown as Testimonial[];
  } catch (error) {
    warnFallback("testimonials", error);
    return seedTestimonials;
  }
}

/**
 * Gallery never uses the database. Drop files in public/images/gallery (or keep
 * curated entries in src/data/gallery.ts when that folder is empty).
 */
export async function getGallery(): Promise<GalleryImage[]> {
  return loadGalleryFromFiles();
}

function activeSeedPrograms(): Program[] {
  return seedPrograms.filter((program) => program.isActive);
}

function seedProgram(slug: string): Program | null {
  const program = seedPrograms.find((entry) => entry.slug === slug);
  return program?.isActive ? program : null;
}

export { isDatabaseConfigured };
