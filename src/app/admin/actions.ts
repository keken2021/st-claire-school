"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/db";
import { findOverlaps, formatSlot, parseTimeToMinutes } from "@/lib/schedule";
import type { ActionState } from "./action-state";

/**
 * Every mutation lives here as a server action. Each one re-checks the session
 * itself: server actions are independently addressable endpoints, so the /admin
 * route gate in middleware is a convenience rather than the security boundary.
 *
 * After a successful write the affected public paths are revalidated, which is
 * what connects a statically generated marketing page to a live edit — no
 * redeploy needed.
 */

const NO_DATABASE: ActionState = {
  status: "error",
  message: "No database is configured, so changes cannot be saved.",
};

function invalid(error: z.ZodError): ActionState {
  return {
    status: "error",
    message: "Please correct the highlighted fields.",
    fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]>,
  };
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/programs/find");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/programs/${slug}`);
}

/* -------------------------------------------------------------------------- */
/* Programs                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * `slug` is intentionally absent: those URLs are indexed by search engines and
 * shared in Messenger threads, so renaming one is a migration, not an edit.
 */
const programSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2, "Give the program a name.").max(60),
  description: z.string().trim().min(20, "Write at least a sentence.").max(400),
  detail: z.string().trim().max(2000).optional(),
  ageGroup: z.string().trim().min(3).max(40),
  minAge: z.coerce.number().int().min(0).max(99),
  skillLevel: z.string().trim().min(3).max(40),
  duration: z.string().trim().min(3).max(40),
  sortOrder: z.coerce.number().int().min(0).max(999),
  isActive: z.coerce.boolean(),
});

export async function updateProgram(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const parsed = programSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    detail: formData.get("detail") || undefined,
    ageGroup: formData.get("ageGroup"),
    minAge: formData.get("minAge"),
    skillLevel: formData.get("skillLevel"),
    duration: formData.get("duration"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) return invalid(parsed.error);

  const { id, detail, ...fields } = parsed.data;

  const program = await prisma.program.update({
    where: { id },
    data: { ...fields, detail: detail ?? null },
    select: { slug: true },
  });

  revalidatePath(`/admin/programs/${id}`);
  revalidatePublic(program.slug);

  return { status: "success", message: "Program saved." };
}

/* -------------------------------------------------------------------------- */
/* Class slots                                                                */
/* -------------------------------------------------------------------------- */

/**
 * `enrolledCount > capacity` is rejected rather than clamped: an overbooked slot
 * means the seat numbers shown to parents are wrong, and silently fixing it
 * would hide the mistake from whoever made it.
 */
const slotSchema = z
  .object({
    programId: z.string().min(1),
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().min(4),
    durationMin: z.coerce.number().int().min(15).max(240),
    capacity: z.coerce.number().int().min(1).max(60),
    enrolledCount: z.coerce.number().int().min(0).max(60),
  })
  .refine((value) => value.enrolledCount <= value.capacity, {
    path: ["enrolledCount"],
    message: "Enrolled cannot exceed capacity.",
  })
  .refine((value) => parseTimeToMinutes(value.startTime) !== null, {
    path: ["startTime"],
    message: "Use a valid time.",
  });

/**
 * Colliding class times are surfaced as a warning rather than blocked. Two
 * classes can legitimately share a time in different rooms, so only the staff
 * member knows whether it is a mistake.
 */
async function overlapWarnings(programId: string) {
  if (!prisma) return [];

  const slots = await prisma.classSlot.findMany({
    where: { programId, isActive: true },
    select: { id: true, dayOfWeek: true, startMinutes: true, durationMin: true },
  });

  return findOverlaps(slots).map(
    ([a, b]) => `${formatSlot(a)} overlaps ${formatSlot(b)}. Check this is intended.`
  );
}

export async function createSlot(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const parsed = slotSchema.safeParse({
    programId: formData.get("programId"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    durationMin: formData.get("durationMin"),
    capacity: formData.get("capacity"),
    enrolledCount: formData.get("enrolledCount"),
  });

  if (!parsed.success) return invalid(parsed.error);

  const { programId, startTime, ...fields } = parsed.data;
  const startMinutes = parseTimeToMinutes(startTime)!;

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { slug: true },
  });
  if (!program) return { status: "error", message: "That program no longer exists." };

  await prisma.classSlot.create({
    data: { ...fields, programId, startMinutes, isActive: true },
  });

  revalidatePath(`/admin/programs/${programId}`);
  revalidatePublic(program.slug);

  return {
    status: "success",
    message: "Class time added.",
    warnings: await overlapWarnings(programId),
  };
}

export async function updateSlot(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing class time." };

  const parsed = slotSchema.safeParse({
    programId: formData.get("programId"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    durationMin: formData.get("durationMin"),
    capacity: formData.get("capacity"),
    enrolledCount: formData.get("enrolledCount"),
  });

  if (!parsed.success) return invalid(parsed.error);

  const { programId, startTime, ...fields } = parsed.data;

  const slot = await prisma.classSlot.update({
    where: { id },
    data: {
      ...fields,
      startMinutes: parseTimeToMinutes(startTime)!,
      updatedBy: admin.email ?? null,
    },
    select: { program: { select: { slug: true } } },
  });

  revalidatePath(`/admin/programs/${programId}`);
  revalidatePublic(slot.program.slug);

  return {
    status: "success",
    message: "Class time updated.",
    warnings: await overlapWarnings(programId),
  };
}

/**
 * Retires a class time instead of deleting the row, so InquiryEvent records that
 * reference this program's history still point at something real.
 */
export async function retireSlot(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing class time." };

  const slot = await prisma.classSlot.update({
    where: { id },
    data: { isActive: false, updatedBy: admin.email ?? null },
    select: { programId: true, program: { select: { slug: true } } },
  });

  revalidatePath(`/admin/programs/${slot.programId}`);
  revalidatePublic(slot.program.slug);

  return { status: "success", message: "Class time retired and hidden from the site." };
}

const seatSchema = z.object({
  id: z.string().min(1),
  enrolledCount: z.coerce.number().int().min(0).max(60),
});

/** Fine-grained action behind the optimistic seat stepper. */
export async function setEnrolledCount(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const parsed = seatSchema.safeParse({
    id: formData.get("id"),
    enrolledCount: formData.get("enrolledCount"),
  });

  if (!parsed.success) return invalid(parsed.error);

  const existing = await prisma.classSlot.findUnique({
    where: { id: parsed.data.id },
    select: { capacity: true, programId: true, program: { select: { slug: true } } },
  });

  if (!existing) return { status: "error", message: "That class time no longer exists." };

  if (parsed.data.enrolledCount > existing.capacity) {
    return {
      status: "error",
      message: `Only ${existing.capacity} seats exist in this class.`,
    };
  }

  await prisma.classSlot.update({
    where: { id: parsed.data.id },
    data: { enrolledCount: parsed.data.enrolledCount, updatedBy: admin.email ?? null },
  });

  revalidatePath(`/admin/programs/${existing.programId}`);
  revalidatePublic(existing.program.slug);

  return { status: "success" };
}

/* -------------------------------------------------------------------------- */
/* Tuition                                                                    */
/* -------------------------------------------------------------------------- */

const tuitionSchema = z.object({
  programId: z.string().min(1),
  name: z.string().trim().min(2).max(40),
  amount: z.coerce.number().int().min(0).max(1_000_000),
  cadence: z.string().trim().min(3).max(30),
  note: z.string().trim().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).max(99),
});

export async function upsertTuitionTier(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const id = String(formData.get("id") ?? "");
  const parsed = tuitionSchema.safeParse({
    programId: formData.get("programId"),
    name: formData.get("name"),
    amount: formData.get("amount"),
    cadence: formData.get("cadence"),
    note: formData.get("note") || undefined,
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return invalid(parsed.error);

  const { programId, note, ...fields } = parsed.data;
  const data = { ...fields, programId, note: note ?? null };

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { slug: true },
  });
  if (!program) return { status: "error", message: "That program no longer exists." };

  if (id) {
    await prisma.tuitionTier.update({ where: { id }, data });
  } else {
    await prisma.tuitionTier.create({ data });
  }

  revalidatePath(`/admin/programs/${programId}`);
  revalidatePublic(program.slug);

  return { status: "success", message: id ? "Rate updated." : "Rate added." };
}

export async function deleteTuitionTier(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Missing rate." };

  const tier = await prisma.tuitionTier.delete({
    where: { id },
    select: { programId: true, program: { select: { slug: true } } },
  });

  revalidatePath(`/admin/programs/${tier.programId}`);
  revalidatePublic(tier.program.slug);

  return { status: "success", message: "Rate removed." };
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(60),
  role: z.enum(["Parent", "Student"]),
  program: z.string().trim().min(2).max(60),
  quote: z.string().trim().min(20, "Quotes should be a sentence or more.").max(600),
  rating: z.coerce.number().int().min(1).max(5),
  isVisible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export async function updateTestimonial(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!prisma) return NO_DATABASE;

  const parsed = testimonialSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    role: formData.get("role"),
    program: formData.get("program"),
    quote: formData.get("quote"),
    rating: formData.get("rating"),
    isVisible: formData.get("isVisible") === "on",
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return invalid(parsed.error);

  const { id, ...fields } = parsed.data;
  await prisma.testimonial.update({ where: { id }, data: fields });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");

  return { status: "success", message: "Testimonial saved." };
}
