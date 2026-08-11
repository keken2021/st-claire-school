"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import type { TuitionTier } from "@/types";
import { deleteTuitionTier, upsertTuitionTier } from "@/app/admin/actions";
import { idleState } from "@/app/admin/action-state";
import { Card, Field, FormStatus, SectionTitle, SubmitButton, TextInput } from "./ui";

export default function TuitionEditor({
  programId,
  tiers,
}: {
  programId: string;
  tiers: TuitionTier[];
}) {
  return (
    <Card>
      <SectionTitle hint="Rates shown on the program page and in its structured data.">
        Tuition
      </SectionTitle>

      {tiers.length === 0 ? (
        <p className="rounded-lg bg-mist/70 px-4 py-3 text-sm text-ink/70">
          No rates published. The program page will omit the tuition section entirely.
        </p>
      ) : (
        <ul className="space-y-3">
          {tiers.map((tier) => (
            <li key={tier.id}>
              <TierRow tier={tier} programId={programId} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-ink/[0.08] pt-6">
        <TierForm programId={programId} />
      </div>
    </Card>
  );
}

function TierRow({ tier, programId }: { tier: TuitionTier; programId: string }) {
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTuitionTier, idleState);

  return (
    <div className="rounded-xl border border-ink/[0.08] p-4">
      <TierForm programId={programId} tier={tier} />
      <form action={deleteAction} className="mt-2 flex justify-end">
        <input type="hidden" name="id" value={tier.id} />
        <button
          type="submit"
          disabled={deletePending}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/65 hover:text-rose-700 disabled:opacity-50"
        >
          <Trash2 size={13} /> {deletePending ? "Removing…" : "Remove rate"}
        </button>
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
    <form action={formAction} className="grid gap-3 sm:grid-cols-5">
      <input type="hidden" name="programId" value={programId} />
      {tier && <input type="hidden" name="id" value={tier.id} />}

      <Field label="Label" name={`tuition-name-${suffix}`} errors={errors.name}>
        <TextInput
          id={`tuition-name-${suffix}`}
          name="name"
          defaultValue={tier?.name ?? ""}
          placeholder="Private"
          required
        />
      </Field>

      <Field label="Amount (₱)" name={`tuition-amount-${suffix}`} errors={errors.amount}>
        <TextInput
          id={`tuition-amount-${suffix}`}
          name="amount"
          type="number"
          min={0}
          defaultValue={tier?.amount ?? 0}
          required
        />
      </Field>

      <Field label="Cadence" name={`tuition-cadence-${suffix}`} errors={errors.cadence}>
        <TextInput
          id={`tuition-cadence-${suffix}`}
          name="cadence"
          defaultValue={tier?.cadence ?? "per month"}
          required
        />
      </Field>

      <Field label="Note" name={`tuition-note-${suffix}`} errors={errors.note}>
        <TextInput
          id={`tuition-note-${suffix}`}
          name="note"
          defaultValue={tier?.note ?? ""}
          placeholder="Eight 60-minute sessions"
        />
      </Field>

      <div className="flex items-end gap-2">
        <input type="hidden" name="sortOrder" value={tier?.sortOrder ?? 99} />
        <SubmitButton pending={pending} variant={tier ? "quiet" : "primary"}>
          {tier ? "Save rate" : "Add rate"}
        </SubmitButton>
      </div>

      <div className="sm:col-span-5">
        <FormStatus state={state} />
      </div>
    </form>
  );
}
