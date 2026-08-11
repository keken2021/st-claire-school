import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.address.locality}, ${site.address.region}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "music school Cebu",
    "music lessons Minglanilla",
    "piano lessons Cebu",
    "voice lessons Cebu",
    "ballet Minglanilla",
    "performing arts Cebu",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} | ${site.address.locality}, ${site.address.region}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

/**
 * Root layout carries only the document shell and fonts. Public chrome lives in
 * the (site) group and admin chrome in /admin, so the two never bleed together.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
