"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types";
import { idleState } from "@/app/admin/action-state";
import { updateGalleryItem } from "@/app/admin/actions";
import { Field, FormStatus, Select, SubmitButton, TextInput } from "./ui";

const CATEGORIES = [
  "Classes",
  "Recitals",
  "Student Performances",
  "Competitions",
  "Facilities",
  "Events",
  "Graduation",
  "Behind the Scenes",
];

export default function GalleryForm({
  image,
  isVisible,
  sortOrder,
}: {
  image: GalleryImage;
  isVisible: boolean;
  sortOrder: number;
}) {
  const [state, formAction, pending] = useActionState(updateGalleryItem, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
      <input type="hidden" name="id" value={image.id} />
      <input type="hidden" name="sortOrder" value={sortOrder} />

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
        <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <Field label="Caption" name={`caption-${image.id}`} errors={errors.caption}>
          <TextInput
            id={`caption-${image.id}`}
            name="caption"
            defaultValue={image.caption}
            required
          />
        </Field>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-5">
            <Field label="Category" name={`category-${image.id}`} errors={errors.category}>
              <Select
                id={`category-${image.id}`}
                name="category"
                defaultValue={image.category}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Field>

            <label className="flex items-center gap-2.5 pb-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked={isVisible}
                className="h-4 w-4 rounded border-ink/20 accent-rose-600"
              />
              Published
            </label>
          </div>

          <SubmitButton pending={pending} variant="quiet">
            Save
          </SubmitButton>
        </div>

        <FormStatus state={state} />
      </div>
    </form>
  );
}
