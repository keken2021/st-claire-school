import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RippleButton from "@/components/RippleButton";
import FloatingNotes from "@/components/FloatingNotes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative min-h-[70svh] flex items-center bg-ink overflow-hidden">
          <div className="absolute inset-0 bg-spotlight" />
          <FloatingNotes className="opacity-25" />
          <div className="container-page relative text-center max-w-xl mx-auto py-24">
            <p className="eyebrow !text-gold-light mb-5">404</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-display">
              This page has left the stage
            </h1>
            <p className="mt-5 text-white/60 leading-relaxed">
              The link may be out of date. Try our programs, or let us point you to the right one.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <RippleButton href="/programs" variant="gold">
                Browse programs
              </RippleButton>
              <RippleButton
                href="/programs/find"
                variant="ghost"
                className="!text-white !border-white/25"
              >
                Find a match
              </RippleButton>
            </div>
            <Link href="/" className="mt-8 inline-block text-sm text-white/55 hover:text-white">
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
