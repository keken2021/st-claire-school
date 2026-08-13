import fs from "node:fs";
import path from "node:path";
import type { GalleryCategory, GalleryImage } from "@/types";
import { galleryImages as curatedGallery } from "@/data/gallery";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/** Drop photos here; they appear on /gallery without the database. */
export const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");

const CATEGORY_FOLDERS: Record<string, GalleryCategory> = {
  classes: "Classes",
  recitals: "Recitals",
  "student performances": "Student Performances",
  "student-performances": "Student Performances",
  competitions: "Competitions",
  facilities: "Facilities",
  events: "Events",
  graduation: "Graduation",
  "behind the scenes": "Behind the Scenes",
  "behind-the-scenes": "Behind the Scenes",
};

function prettifyFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function readImageSize(filePath: string): { width: number; height: number } {
  try {
    const buffer = fs.readFileSync(filePath);
    // JPEG SOF
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + length;
      }
    }
    // PNG IHDR
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }
  } catch {
    // Fall through to defaults.
  }
  return { width: 1600, height: 1200 };
}

function collectFromDir(
  dir: string,
  webPrefix: string,
  category: GalleryCategory,
  out: GalleryImage[]
) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const mapped = CATEGORY_FOLDERS[entry.name.toLowerCase()];
      if (mapped) {
        collectFromDir(fullPath, `${webPrefix}/${entry.name}`, mapped, out);
      }
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const { width, height } = readImageSize(fullPath);
    const id = `file-${webPrefix}/${entry.name}`.replace(/[^a-zA-Z0-9]+/g, "-");

    out.push({
      id,
      src: `${webPrefix}/${entry.name}`.replace(/\\/g, "/"),
      category,
      caption: prettifyFilename(entry.name),
      width,
      height,
    });
  }
}

/**
 * Gallery is file-based: drop images into public/images/gallery (optionally in
 * category subfolders). When that folder is empty, the curated list in
 * src/data/gallery.ts is used so the site still has photos out of the box.
 */
export function loadGalleryFromFiles(): GalleryImage[] {
  const fromDisk: GalleryImage[] = [];
  collectFromDir(GALLERY_DIR, "/images/gallery", "Events", fromDisk);

  if (fromDisk.length > 0) {
    return fromDisk.sort((a, b) => a.src.localeCompare(b.src));
  }

  return curatedGallery;
}
