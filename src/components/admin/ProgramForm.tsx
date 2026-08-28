"use client";

import { useActionState } from "react";
import type { Program } from "@/types";
import { idleState } from "@/app/admin/action-state";
import { updateProgram } from "@/app/admin/actions";
import {
  Card,
  Field,
  FormStatus,
  StepBadge,
  SubmitButton,
  TextArea,
  TextInput,
  ToggleField,
} from "./ui";

export default function ProgramForm({ program }: { program: Program }) {
  const [state, formAction, pending] = useActionState(updateProgram, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <Card>
      <StepBadge step={1} label="Program information" />
      <p className="-mt-2 mb-6 text-base text-ink/70">
        This is the text parents see when they browse programs on the website.
      </p>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={program.id} />

        <Field label="Program name" name="name" required errors={errors.name}>
          <TextInput id="name" name="name" defaultValue={program.name} required />
        </Field>

        <Field
          label="Short description"
          name="description"
          hint="A brief summary — shown on cards and when the page is shared on Facebook."
          required
          errors={errors.description}
        >
          <TextArea
            id="description"
            name="description"
            rows={3}
            defaultValue={program.description}
            required
          />
        </Field>

        <Field
          label="Full description (optional)"
          name="detail"
          hint="Longer text on the program page. You can leave this blank."
          errors={errors.detail}
        >
          <TextArea id="detail" name="detail" rows={5} defaultValue={program.detail ?? ""} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Age group (what parents read)"
            name="ageGroup"
            hint='Example: "Ages 5+"'
            required
            errors={errors.ageGroup}
          >
            <TextInput id="ageGroup" name="ageGroup" defaultValue={program.ageGroup} required />
          </Field>

          <Field
            label="Minimum age (number only)"
            name="minAge"
            hint="Used by “Find the Right Program” on the website."
            required
            errors={errors.minAge}
          >
            <TextInput
              id="minAge"
              name="minAge"
              type="number"
              min={0}
              max={99}
              defaultValue={program.minAge}
              required
            />
          </Field>

          <Field
            label="Skill level"
            name="skillLevel"
            hint='Example: "Beginner to Advanced"'
            required
            errors={errors.skillLevel}
          >
            <TextInput
              id="skillLevel"
              name="skillLevel"
              defaultValue={program.skillLevel}
              required
            />
          </Field>

          <Field
            label="How long is each class?"
            name="duration"
            hint='Example: "60 min / session"'
            required
            errors={errors.duration}
          >
            <TextInput id="duration" name="duration" defaultValue={program.duration} required />
          </Field>

          <Field
            label="Order on the website"
            name="sortOrder"
            hint="Lower numbers appear first in lists. Usually leave as-is."
            errors={errors.sortOrder}
          >
            <TextInput
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={program.sortOrder}
              required
            />
          </Field>
        </div>

        <ToggleField
          name="isActive"
          label="Show this program on the website"
          hint="Turn off to hide it from parents without deleting anything."
          defaultChecked={program.isActive}
        />

        <p className="rounded-xl bg-mist/60 px-4 py-3.5 text-sm leading-relaxed text-ink/70">
          The web link for this program cannot be changed here because it is already on Google and
          in Messenger messages.
        </p>

        <FormStatus state={state} />

        <div className="flex justify-end border-t border-ink/[0.06] pt-6">
          <SubmitButton pending={pending}>Save program information</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
