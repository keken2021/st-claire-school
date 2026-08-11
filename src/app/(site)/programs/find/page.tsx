import { Suspense } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProgramFinder from "@/components/ProgramFinder";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Find the Right Program",
  description:
    "Answer four quick questions about your child's age, interests, and schedule, and we'll recommend the St. Claire programs that fit best.",
  alternates: { canonical: "/programs/find" },
};

export const revalidate = 300;

export default async function FindProgramPage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHero
        eyebrow="Program Finder"
        title="Which Program Fits Your Child?"
        description="Four quick questions. We'll match their age, interest, and your schedule, then hand the details straight to our team."
      />

      <section className="py-16 sm:py-20 bg-cream">
        <div className="container-page">
          <Suspense
            fallback={
              <div className="mx-auto max-w-2xl rounded-2xl border border-ink/[0.06] bg-white p-8 shadow-card">
                <div className="h-6 w-2/3 animate-pulse rounded bg-mist" />
                <div className="mt-4 h-4 w-full animate-pulse rounded bg-mist" />
              </div>
            }
          >
            <ProgramFinder programs={programs} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
