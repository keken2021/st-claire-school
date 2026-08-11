import { ImageResponse } from "next/og";
import { getProgram, getPrograms } from "@/lib/content";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

/**
 * Branded share card per program, so a link pasted into Messenger or Facebook
 * looks like the school rather than a bare URL.
 */
export default async function Image({ params }: { params: { slug: string } }) {
  const program = await getProgram(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #4A1529 0%, #1C1917 55%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#D4BC6A",
            }}
          >
            {`${site.shortName} · ${site.address.locality}, ${site.address.region}`}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 86,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.05,
            }}
          >
            {program?.name ?? "Music & Performing Arts"}
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: "rgba(255,255,255,0.7)", maxWidth: 900 }}>
            {program ? `${program.ageGroup} · ${program.skillLevel}` : site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 6, width: 96, background: "#C43B6E", borderRadius: 999 }} />
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.55)" }}>
            Enrolling now — ask on Messenger
          </div>
        </div>
      </div>
    ),
    size
  );
}
