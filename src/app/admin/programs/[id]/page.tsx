import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAdminProgram } from "@/lib/content";
import ProgramForm from "@/components/admin/ProgramForm";
import SlotEditor from "@/components/admin/SlotEditor";
import TuitionEditor from "@/components/admin/TuitionEditor";
import { HelpBox } from "@/components/admin/ui";

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
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg text-base font-medium text-ink/70 transition-colors hover:text-ink"
      >
        <ArrowLeft size={18} strokeWidth={2} aria-hidden /> Back to all programs
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-display text-ink sm:text-3xl">
            {program.name}
          </h1>
          <p className="mt-1 text-base text-ink/70">{program.category}</p>
        </div>
        <Link
          href={`/programs/${program.slug}`}
          target="_blank"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2.5 text-base font-semibold text-rose-700 transition-colors hover:bg-rose-100"
        >
          Preview on website <ExternalLink size={18} strokeWidth={2} aria-hidden />
        </Link>
      </div>

      <HelpBox title="Work through the 3 steps below">
        <strong>Step 1</strong> — words parents read about this program.{" "}
        <strong>Step 2</strong> — when classes happen and how many seats are open.{" "}
        <strong>Step 3</strong> — monthly or other fees. Save each section when you are done.
      </HelpBox>

      <div className="mt-8 space-y-8">
        <ProgramForm program={program} />
        <SlotEditor programId={program.id} slots={program.slots ?? []} />
        <TuitionEditor programId={program.id} tiers={program.tuition ?? []} />
      </div>
    </div>
  );
}
