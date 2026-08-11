import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAdminProgram } from "@/lib/content";
import ProgramForm from "@/components/admin/ProgramForm";
import SlotEditor from "@/components/admin/SlotEditor";
import TuitionEditor from "@/components/admin/TuitionEditor";

export const dynamic = "force-dynamic";

export default async function AdminProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getAdminProgram(id);

  if (!program) notFound();

  return (
    <div>
      <Link
        href="/admin/programs"
        className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink"
      >
        <ArrowLeft size={15} strokeWidth={1.75} /> All programs
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-display text-ink">
            {program.name}
          </h1>
          <p className="mt-1 text-sm text-ink/70">{program.category}</p>
        </div>
        <Link
          href={`/programs/${program.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          View public page <ExternalLink size={14} strokeWidth={1.75} />
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        <ProgramForm program={program} />
        <SlotEditor programId={program.id} slots={program.slots ?? []} />
        <TuitionEditor programId={program.id} tiers={program.tuition ?? []} />
      </div>
    </div>
  );
}
