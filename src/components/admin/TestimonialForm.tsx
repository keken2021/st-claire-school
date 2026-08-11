"use client";

import { useActionState } from "react";
import type { Testimonial } from "@/types";
import { idleState, updateTestimonial } from "@/app/admin/actions";
import { Field, FormStatus, Select, SubmitButton, TextArea, TextInput } from "./ui";

export default function TestimonialForm({
  testimonial,
  isVisible,
  sortOrder,
}: {
  testimonial: Testimonial;
  isVisible: boolean;
  sortOrder: number;
}) {
  const [state, formAction, pending] = useActionState(updateTestimonial, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={testimonial.id} />
      <input type="hidden" name="sortOrder" value={sortOrder} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Name" name={`name-${testimonial.id}`} errors={errors.name}>
          <TextInput
            id={`name-${testimonial.id}`}
            name="name"
            defaultValue={testimonial.name}
            required
          />
        </Field>

        <Field label="Role" name={`role-${testimonial.id}`} errors={errors.role}>
          <Select id={`role-${testimonial.id}`} name="role" defaultValue={testimonial.role}>
            <option value="Parent">Parent</option>
            <option value="Student">Student</option>
          </Select>
        </Field>

        <Field
          label="Program and age"
          name={`program-${testimonial.id}`}
          errors={errors.program}
        >
          <TextInput
            id={`program-${testimonial.id}`}
            name="program"
            defaultValue={testimonial.program}
            required
          />
        </Field>
      </div>

      <Field label="Quote" name={`quote-${testimonial.id}`} errors={errors.quote}>
        <TextArea
          id={`quote-${testimonial.id}`}
          name="quote"
          rows={3}
          defaultValue={testimonial.quote}
          required
        />
      </Field>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-5">
          <Field label="Rating" name={`rating-${testimonial.id}`} errors={errors.rating}>
            <Select
              id={`rating-${testimonial.id}`}
              name="rating"
              defaultValue={testimonial.rating}
              className="!w-24"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
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
            Show on the website
          </label>
        </div>

        <SubmitButton pending={pending} variant="quiet">
          Save
        </SubmitButton>
      </div>

      <FormStatus state={state} />
    </form>
  );
}
