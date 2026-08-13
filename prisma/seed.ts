import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { programs } from "../src/data/programs";
import { galleryImages } from "../src/data/gallery";
import { testimonials } from "../src/data/testimonials";

process.loadEnvFile(".env");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and set it first.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function seedPrograms() {
  for (const program of programs) {
    const { slots = [], tuition = [], ...fields } = program;

    await prisma.program.upsert({
      where: { id: program.id },
      create: fields,
      update: fields,
    });

    for (const slot of slots) {
      await prisma.classSlot.upsert({
        where: { id: slot.id },
        create: slot,
        update: slot,
      });
    }

    for (const tier of tuition) {
      await prisma.tuitionTier.upsert({
        where: { id: tier.id },
        create: tier,
        update: tier,
      });
    }
  }

  const keptIds = programs.map((program) => program.id);
  const retired = await prisma.program.updateMany({
    where: { id: { notIn: keptIds }, isActive: true },
    data: { isActive: false },
  });

  console.log(
    `Seeded ${programs.length} programs with slots and tuition tiers.` +
      (retired.count ? ` Retired ${retired.count} program(s) no longer in seed.` : "")
  );
}

async function seedTestimonials() {
  for (const [index, testimonial] of testimonials.entries()) {
    const record = { ...testimonial, sortOrder: index + 1, isVisible: true };
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      create: record,
      update: record,
    });
  }

  console.log(`Seeded ${testimonials.length} testimonials.`);
}

async function seedGallery() {
  for (const [index, image] of galleryImages.entries()) {
    const record = { ...image, sortOrder: index + 1, isVisible: true };
    await prisma.galleryItem.upsert({
      where: { id: image.id },
      create: record,
      update: record,
    });
  }

  console.log(`Seeded ${galleryImages.length} gallery items.`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "Skipped admin user: set ADMIN_EMAIL and ADMIN_PASSWORD to create the first login."
    );
    return;
  }

  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name: "School Admin", role: "owner" },
    // The password is only rotated deliberately, so re-seeding refreshes it.
    update: { passwordHash },
  });

  console.log(`Seeded admin user ${email}.`);
}

async function main() {
  await seedPrograms();
  await seedTestimonials();
  await seedGallery();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
