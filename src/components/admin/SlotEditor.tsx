"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import type { ClassSlot } from "@/types";
import { createSlot, retireSlot, updateSlot } from "@/app/admin/actions";
import { idleState } from "@/app/admin/action-state";
import { DAY_NAMES, minutesToTimeValue } from "@/lib/schedule";
import SeatStepper from "./SeatStepper";
import { Card, Field, FormStatus, SectionTitle, Select, SubmitButton, TextInput } from "./ui";

/** Only the days the school is open, so a class cannot be scheduled on a Monday. */
const OPEN_DAYS = [3, 5, 6];

export default function SlotEditor({
  programId,
  slots,
}: {
  programId: string;
  slots: ClassSlot[];
}) {
  const active = slots.filter((slot) => slot.isActive);
  const retired = slots.filter((slot) => !slot.isActive);

  return (
    <Card>
      <SectionTitle hint="Class times parents see on the program page, with live seat counts.">
        Schedule
      </SectionTitle>

      {active.length === 0 ? (
        <p className="rounded-lg bg-mist/70 px-4 py-3 text-sm text-ink/70">
          No class times yet. The program page will invite parents to arrange one by message.
        </p>
      ) : (
        <ul className="space-y-3">
          {active.map((slot) => (
            <li key={slot.id}>
              <SlotRow slot={slot} programId={programId} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-ink/[0.08] pt-6">
        <NewSlotForm programId={programId} />
      </div>

      {retired.length > 0 && (
        <details className="mt-6 border-t border-ink/[0.08] pt-4">
          <summary className="cursor-pointer text-sm font-medium text-ink/70">
            {retired.length} retired class {retired.length === 1 ? "time" : "times"}
          </summary>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/65">
            {retired.map((slot) => (
              <li key={slot.id}>
                {DAY_NAMES[slot.dayOfWeek]} {minutesToTimeValue(slot.startMinutes)} — hidden from
                the site, kept for reporting
              </li>
            ))}
          </ul>
        </details>
      )}
    </Card>
  );
}

function SlotRow({ slot, programId }: { slot: ClassSlot; programId: string }) {
  const [state, formAction, pending] = useActionState(updateSlot, idleState);
  const [retireState, retireAction, retirePending] = useActionState(retireSlot, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="rounded-xl border border-ink/[0.08] p-4">
      <form action={formAction} className="grid gap-3 sm:grid-cols-4">
        <input type="hidden" name="id" value={slot.id} />
        <input type="hidden" name="programId" value={programId} />

        <Field label="Day" name={`day-${slot.id}`} errors={errors.dayOfWeek}>
          <Select id={`day-${slot.id}`} name="dayOfWeek" defaultValue={slot.dayOfWeek}>
            {OPEN_DAYS.map((day) => (
              <option key={day} value={day}>
                {DAY_NAMES[day]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Start" name={`start-${slot.id}`} errors={errors.startTime}>
          <TextInput
            id={`start-${slot.id}`}
            name="startTime"
            type="time"
            defaultValue={minutesToTimeValue(slot.startMinutes)}
          />
        </Field>

        <Field label="Minutes" name={`length-${slot.id}`} errors={errors.durationMin}>
          <TextInput
            id={`length-${slot.id}`}
            name="durationMin"
            type="number"
            min={15}
            max={240}
            step={5}
            defaultValue={slot.durationMin}
          />
        </Field>

        <Field label="Capacity" name={`capacity-${slot.id}`} errors={errors.capacity}>
          <TextInput
            id={`capacity-${slot.id}`}
            name="capacity"
            type="number"
            min={1}
            max={60}
            defaultValue={slot.capacity}
          />
        </Field>

        {/* Kept in the form so capacity edits validate against the current count. */}
        <input type="hidden" name="enrolledCount" value={slot.enrolledCount} />

        <div className="sm:col-span-4 flex flex-wrap items-center justify-between gap-3">
          <SeatStepper
            slotId={slot.id}
            enrolledCount={slot.enrolledCount}
            capacity={slot.capacity}
          />
          <SubmitButton pending={pending} variant="quiet">
            Save time
          </SubmitButton>
        </div>

        {errors.enrolledCount?.length ? (
          <p role="alert" className="sm:col-span-4 text-xs text-rose-700">
            {errors.enrolledCount[0]}
          </p>
        ) : null}
      </form>

      <div className="mt-2 flex items-center justify-between gap-3">
        <FormStatus state={state} />
        <form action={retireAction}>
          <input type="hidden" name="id" value={slot.id} />
          <button
            type="submit"
            disabled={retirePending}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/65 hover:text-rose-700 disabled:opacity-50"
          >
            <Trash2 size={13} /> {retirePending ? "Retiring…" : "Retire"}
          </button>
        </form>
      </div>
      <FormStatus state={retireState} />
    </div>
  );
}

function NewSlotForm({ programId }: { programId: string }) {
  const [state, formAction, pending] = useActionState(createSlot, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-5">
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="enrolledCount" value={0} />

      <Field label="Day" name="new-day" errors={errors.dayOfWeek}>
        <Select id="new-day" name="dayOfWeek" defaultValue={6}>
          {OPEN_DAYS.map((day) => (
            <option key={day} value={day}>
              {DAY_NAMES[day]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Start" name="new-start" errors={errors.startTime}>
        <TextInput id="new-start" name="startTime" type="time" defaultValue="09:00" required />
      </Field>

      <Field label="Minutes" name="new-length" errors={errors.durationMin}>
        <TextInput
          id="new-length"
          name="durationMin"
          type="number"
          min={15}
          max={240}
          step={5}
          defaultValue={60}
          required
        />
      </Field>

      <Field label="Capacity" name="new-capacity" errors={errors.capacity}>
        <TextInput
          id="new-capacity"
          name="capacity"
          type="number"
          min={1}
          max={60}
          defaultValue={6}
          required
        />
      </Field>

      <div className="flex items-end">
        <SubmitButton pending={pending}>Add time</SubmitButton>
      </div>

      <div className="sm:col-span-5">
        <FormStatus state={state} />
      </div>
    </form>
  );
}
