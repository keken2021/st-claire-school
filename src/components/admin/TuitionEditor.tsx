"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import type { TuitionTier } from "@/types";
import { deleteTuitionTier, upsertTuitionTier } from "@/app/admin/actions";
import { idleState } from "@/app/admin/action-state";
import {
  AddNewSection,
  Card,
  Field,
  FormStatus,
  StepBadge,
  SubmitButton,
  TextInput,
} from "./ui";

const CADENCE_OPTIONS = [
  "per month",
  "per session",
  "per term",
  "per package",
];

export default function TuitionEditor({
  programId,
  tiers,
}: {
  programId: string;
  tiers: TuitionTier[];
}) {
  return (
    <Card>
      <StepBadge step={3} label="Prices & fees" />
      <p className="-mt-2 mb-6 text-base text-ink/70">
        What parents pay for this program. You can list more than one option (for example Private
        and Group).
      </p>

      {tiers.length === 0 ? (
        <p className="rounded-xl bg-mist/60 px-5 py-4 text-base text-ink/75">
          No prices listed yet. Add one below — otherwise the program page will not show fees.
        </p>
      ) : (
        <ul className="space-y-5">
          {tiers.map((tier, index) => (
            <li key={tier.id}>
              <TierRow tier={tier} programId={programId} index={index + 1} />
            </li>
          ))}
        </ul>
      )}

      <AddNewSection
        title="Add a new price"
        description='Example: name "Private", amount 4000, billed "per month".'
      >
        <TierForm programId={programId} />
      </AddNewSection>
    </Card>
  );
}

function TierRow({
  tier,
  programId,
  index,
}: {
  tier: TuitionTier;
  programId: string;
  index: number;
}) {
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTuitionTier, idleState);

  return (
    <div className="rounded-2xl border-2 border-ink/[0.08] bg-mist/20 p-5 sm:p-6">
      <p className="mb-4 text-base font-semibold text-ink">
        Price option {index}: {tier.name} — ₱{tier.amount.toLocaleString()} {tier.cadence}
      </p>
      <TierForm programId={programId} tier={tier} />
      <form action={deleteAction} className="mt-4 flex justify-end border-t border-ink/[0.06] pt-4">
        <input type="hidden" name="id" value={tier.id} />
        <SubmitButton pending={deletePending} variant="danger">
          <Trash2 size={18} aria-hidden /> Remove this price
        </SubmitButton>
      </form>
      <FormStatus state={deleteState} />
    </div>
  );
}

function TierForm({ programId, tier }: { programId: string; tier?: TuitionTier }) {
  const [state, formAction, pending] = useActionState(upsertTuitionTier, idleState);
  const errors = state.fieldErrors ?? {};
  const suffix = tier?.id ?? "new";

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="programId" value={programId} />
      {tier && <input type="hidden" name="id" value={tier.id} />}
      <input type="hidden" name="sortOrder" value={tier?.sortOrder ?? 99} />

      <Field
        label="Price name"
        name={`tuition-name-${suffix}`}
        hint='Example: "Private" or "Group"'
        required
        errors={errors.name}
      >
        <TextInput
          id={`tuition-name-${suffix}`}
          name="name"
          defaultValue={tier?.name ?? ""}
          placeholder="Private"
          required
        />
      </Field>

      <Field
        label="Amount in pesos (₱)"
        name={`tuition-amount-${suffix}`}
        required
        errors={errors.amount}
      >
        <TextInput
          id={`tuition-amount-${suffix}`}
          name="amount"
          type="number"
          min={0}
          defaultValue={tier?.amount ?? 0}
          required
        />
      </Field>

      <Field
        label="How often is this paid?"
        name={`tuition-cadence-${suffix}`}
        required
        errors={errors.cadence}
      >
        <TextInput
          id={`tuition-cadence-${suffix}`}
          name="cadence"
          list={`cadence-options-${suffix}`}
          defaultValue={tier?.cadence ?? "per month"}
          required
        />
        <datalist id={`cadence-options-${suffix}`}>
          {CADENCE_OPTIONS.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </Field>

      <Field
        label="Extra note (optional)"
        name={`tuition-note-${suffix}`}
        hint='Example: "Eight 60-minute sessions"'
        errors={errors.note}
      >
        <TextInput
          id={`tuition-note-${suffix}`}
          name="note"
          defaultValue={tier?.note ?? ""}
          placeholder="Eight 60-minute sessions"
        />
      </Field>

      <div className="sm:col-span-2 space-y-4 border-t border-ink/[0.06] pt-5">
        <FormStatus state={state} />
        <SubmitButton pending={pending} variant={tier ? "quiet" : "primary"}>
          {tier ? "Save this price" : "Add price"}
        </SubmitButton>
      </div>
    </form>
  );
}
