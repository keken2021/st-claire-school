"use client";

import { useActionState } from "react";
import type { Testimonial } from "@/types";
import { idleState } from "@/app/admin/action-state";
import { updateTestimonial } from "@/app/admin/actions";
import {
  Field,
  FormStatus,
  Select,
  SubmitButton,
  TextArea,
  TextInput,
  ToggleField,
} from "./ui";

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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={testimonial.id} />
      <input type="hidden" name="sortOrder" value={sortOrder} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Person's name" name={`name-${testimonial.id}`} required errors={errors.name}>
          <TextInput
            id={`name-${testimonial.id}`}
            name="name"
            defaultValue={testimonial.name}
            required
          />
        </Field>

        <Field label="Parent or student?" name={`role-${testimonial.id}`} errors={errors.role}>
          <Select id={`role-${testimonial.id}`} name="role" defaultValue={testimonial.role}>
            <option value="Parent">Parent</option>
            <option value="Student">Student</option>
          </Select>
        </Field>

        <Field
          label="Program & age"
          name={`program-${testimonial.id}`}
          hint='Example: "Piano, Age 8"'
          required
          errors={errors.program}
        >
          <TextInput
            id={`program-${testimonial.id}`}
            name="program"
            defaultValue={testimonial.program}
            required
          />
        </Field>

        <Field label="Star rating" name={`rating-${testimonial.id}`} errors={errors.rating}>
          <Select
            id={`rating-${testimonial.id}`}
            name="rating"
            defaultValue={testimonial.rating}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "star" : "stars"}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="What they said" name={`quote-${testimonial.id}`} required errors={errors.quote}>
        <TextArea
          id={`quote-${testimonial.id}`}
          name="quote"
          rows={4}
          defaultValue={testimonial.quote}
          required
        />
      </Field>

      <ToggleField
        name="isVisible"
        label="Show this review on the website"
        hint="Turn off to hide it from the home page and reviews page."
        defaultChecked={isVisible}
      />

      <FormStatus state={state} />

      <div className="flex justify-end border-t border-ink/[0.06] pt-5">
        <SubmitButton pending={pending}>Save review</SubmitButton>
      </div>
    </form>
  );
}
