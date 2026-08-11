import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4A1529 0%, #1C1917 60%)",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#D4BC6A",
          }}
        >
          {`${site.address.locality}, ${site.address.region}`}
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 76,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.08,
            maxWidth: 940,
          }}
        >
          St. Claire School of Music and Performing Arts
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "rgba(255,255,255,0.65)" }}>
          Where passion meets performance
        </div>
      </div>
    ),
    size
  );
}
