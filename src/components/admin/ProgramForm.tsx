"use client";

import { useActionState } from "react";
import type { Program } from "@/types";
import { idleState, updateProgram } from "@/app/admin/actions";
import { Card, Field, FormStatus, SectionTitle, SubmitButton, TextArea, TextInput } from "./ui";

export default function ProgramForm({ program }: { program: Program }) {
  const [state, formAction, pending] = useActionState(updateProgram, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <Card>
      <SectionTitle hint="Changes appear on the public program page within moments of saving.">
        Program details
      </SectionTitle>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={program.id} />

        <Field label="Name" name="name" errors={errors.name}>
          <TextInput id="name" name="name" defaultValue={program.name} required />
        </Field>

        <Field
          label="Short description"
          name="description"
          hint="Shown on cards, search results, and social previews."
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
          label="Full description"
          name="detail"
          hint="The longer explanation on the program page. Optional."
          errors={errors.detail}
        >
          <TextArea id="detail" name="detail" rows={5} defaultValue={program.detail ?? ""} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Age group label" name="ageGroup" errors={errors.ageGroup}>
            <TextInput id="ageGroup" name="ageGroup" defaultValue={program.ageGroup} required />
          </Field>

          <Field
            label="Minimum age"
            name="minAge"
            hint="Used by the program finder to rule this program in or out."
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

          <Field label="Skill level" name="skillLevel" errors={errors.skillLevel}>
            <TextInput
              id="skillLevel"
              name="skillLevel"
              defaultValue={program.skillLevel}
              required
            />
          </Field>

          <Field label="Session length" name="duration" errors={errors.duration}>
            <TextInput id="duration" name="duration" defaultValue={program.duration} required />
          </Field>

          <Field
            label="Display order"
            name="sortOrder"
            hint="Lower numbers appear first."
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

          <div className="flex items-end">
            <label className="flex items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={program.isActive}
                className="h-4 w-4 rounded border-ink/20 accent-rose-600"
              />
              Show on the website
            </label>
          </div>
        </div>

        <p className="rounded-lg bg-mist/70 px-3.5 py-2.5 text-xs leading-relaxed text-ink/70">
          The web address <code className="text-ink/70">/programs/{program.slug}</code> cannot be
          changed here. It is indexed by search engines and shared in Messenger threads, so
          renaming it would break existing links.
        </p>

        <FormStatus state={state} />

        <div className="flex justify-end">
          <SubmitButton pending={pending}>Save program</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
