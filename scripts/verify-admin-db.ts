import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

try {
  // Remove slots left behind by interrupted e2e runs.
  const cleaned = await prisma.classSlot.deleteMany({
    where: { startMinutes: { in: [21 * 60 + 30, 22 * 60 + 45] } },
  });

  const counts = {
    Program: await prisma.program.count(),
    ClassSlot: await prisma.classSlot.count(),
    TuitionTier: await prisma.tuitionTier.count(),
    Testimonial: await prisma.testimonial.count(),
    GalleryItem: await prisma.galleryItem.count(),
    InquiryEvent: await prisma.inquiryEvent.count(),
    User: await prisma.user.count(),
  };

  const admin = process.env.ADMIN_EMAIL
    ? await prisma.user.findUnique({
        where: { email: process.env.ADMIN_EMAIL },
        select: { email: true, role: true },
      })
    : null;

  console.log(JSON.stringify({ cleaned: cleaned.count, counts, admin }, null, 2));
} finally {
  await prisma.$disconnect();
}
