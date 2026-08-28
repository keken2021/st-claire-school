"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import type { ClassSlot } from "@/types";
import { createSlot, retireSlot, updateSlot } from "@/app/admin/actions";
import { idleState } from "@/app/admin/action-state";
import { DAY_NAMES, formatSlot, minutesToTimeValue } from "@/lib/schedule";
import SeatStepper from "./SeatStepper";
import {
  AddNewSection,
  Card,
  Field,
  FormStatus,
  Select,
  StepBadge,
  SubmitButton,
  TextInput,
} from "./ui";

const OPEN_DAYS = [3, 5, 6];

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour (60 min)" },
  { value: 90, label: "1 hour 30 min" },
  { value: 120, label: "2 hours" },
];

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
      <StepBadge step={2} label="Class schedule" />
      <p className="-mt-2 mb-6 text-base text-ink/70">
        Set when classes happen and how many students are enrolled. Parents see open seats on the
        website.
      </p>

      {active.length === 0 ? (
        <p className="rounded-xl bg-mist/60 px-5 py-4 text-base text-ink/75">
          No class times yet. Add one below — or parents can message you to arrange a time.
        </p>
      ) : (
        <ul className="space-y-5">
          {active.map((slot, index) => (
            <li key={slot.id}>
              <SlotRow slot={slot} programId={programId} index={index + 1} />
            </li>
          ))}
        </ul>
      )}

      <AddNewSection
        title="Add a new class time"
        description="Pick the day, start time, length, and maximum students. Press “Add class time” when ready."
      >
        <NewSlotForm programId={programId} />
      </AddNewSection>

      {retired.length > 0 && (
        <details className="mt-8 rounded-xl border-2 border-ink/10 bg-mist/30 px-5 py-4">
          <summary className="cursor-pointer text-base font-medium text-ink/70">
            {retired.length} old class {retired.length === 1 ? "time" : "times"} (hidden from site)
          </summary>
          <ul className="mt-4 space-y-2 text-sm text-ink/65">
            {retired.map((slot) => (
              <li key={slot.id}>
                {formatSlot(slot)} — kept for records only
              </li>
            ))}
          </ul>
        </details>
      )}
    </Card>
  );
}

function SlotRow({
  slot,
  programId,
  index,
}: {
  slot: ClassSlot;
  programId: string;
  index: number;
}) {
  const [state, formAction, pending] = useActionState(updateSlot, idleState);
  const [retireState, retireAction, retirePending] = useActionState(retireSlot, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="rounded-2xl border-2 border-ink/[0.08] bg-mist/20 p-5 sm:p-6">
      <p className="mb-4 text-base font-semibold text-ink">
        Class time {index}: {formatSlot(slot)}
      </p>

      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" value={slot.id} />
        <input type="hidden" name="programId" value={programId} />
        <input type="hidden" name="enrolledCount" value={slot.enrolledCount} />

        <Field label="Day of the week" name={`day-${slot.id}`} errors={errors.dayOfWeek}>
          <Select id={`day-${slot.id}`} name="dayOfWeek" defaultValue={slot.dayOfWeek}>
            {OPEN_DAYS.map((day) => (
              <option key={day} value={day}>
                {DAY_NAMES[day]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Class starts at" name={`start-${slot.id}`} errors={errors.startTime}>
          <TextInput
            id={`start-${slot.id}`}
            name="startTime"
            type="time"
            defaultValue={minutesToTimeValue(slot.startMinutes)}
          />
        </Field>

        <Field label="Class length" name={`length-${slot.id}`} errors={errors.durationMin}>
          <Select
            id={`length-${slot.id}`}
            name="durationMin"
            defaultValue={slot.durationMin}
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Maximum students"
          name={`capacity-${slot.id}`}
          hint="How many students can join this class."
          errors={errors.capacity}
        >
          <TextInput
            id={`capacity-${slot.id}`}
            name="capacity"
            type="number"
            min={1}
            max={60}
            defaultValue={slot.capacity}
          />
        </Field>

        <div className="sm:col-span-2 rounded-xl border-2 border-ink/10 bg-white p-4">
          <p className="mb-3 text-base font-semibold text-ink">Students enrolled</p>
          <SeatStepper
            slotId={slot.id}
            enrolledCount={slot.enrolledCount}
            capacity={slot.capacity}
          />
        </div>

        {errors.enrolledCount?.length ? (
          <p role="alert" className="sm:col-span-2 text-sm font-medium text-rose-700">
            {errors.enrolledCount[0]}
          </p>
        ) : null}

        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-ink/[0.06] pt-5">
          <FormStatus state={state} />
          <SubmitButton pending={pending} variant="quiet">
            Save this class time
          </SubmitButton>
        </div>
      </form>

      <form action={retireAction} className="mt-4 flex justify-end border-t border-ink/[0.06] pt-4">
        <input type="hidden" name="id" value={slot.id} />
        <SubmitButton pending={retirePending} variant="danger">
          <Trash2 size={18} aria-hidden /> Remove this class time
        </SubmitButton>
      </form>
      <FormStatus state={retireState} />
    </div>
  );
}

function NewSlotForm({ programId }: { programId: string }) {
  const [state, formAction, pending] = useActionState(createSlot, idleState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="enrolledCount" value={0} />

      <Field label="Day of the week" name="new-day" errors={errors.dayOfWeek}>
        <Select id="new-day" name="dayOfWeek" defaultValue={6}>
          {OPEN_DAYS.map((day) => (
            <option key={day} value={day}>
              {DAY_NAMES[day]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Class starts at" name="new-start" errors={errors.startTime}>
        <TextInput id="new-start" name="startTime" type="time" defaultValue="09:00" required />
      </Field>

      <Field label="Class length" name="new-length" errors={errors.durationMin}>
        <Select id="new-length" name="durationMin" defaultValue={60}>
          {DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Maximum students"
        name="new-capacity"
        hint="How many students can join."
        errors={errors.capacity}
      >
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

      <div className="sm:col-span-2 space-y-4">
        <FormStatus state={state} />
        <SubmitButton pending={pending}>Add class time</SubmitButton>
      </div>
    </form>
  );
}
