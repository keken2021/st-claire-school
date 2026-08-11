import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Gallery from "@/components/Gallery";
import CTA from "@/components/CTA";
import JsonLd from "@/components/JsonLd";
import { getGallery } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photographs from classes, student performances, and events at St. Claire School of Music and Performing Arts in Minglanilla, Cebu.",
  alternates: { canonical: "/gallery" },
};

export const revalidate = 300;

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments From Our Studios and Stages"
        description="Classes, rehearsals, and performances — a look at everyday life at St. Claire."
      />

      <section className="py-16 sm:py-20 bg-cream">
        <div className="container-page">
          <Gallery images={images} />
        </div>
      </section>

      <CTA source="gallery_cta" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
    </>
  );
}
