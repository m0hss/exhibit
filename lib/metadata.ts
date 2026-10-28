import type { Metadata } from "next";
import { config } from "@/lib/exhibit";

export const exhibitionTitle = `${config.artist.name} — ${config.exhibition.title}`;

/** Supply complete nested fields: Next.js merges route metadata shallowly. */
export function pageMetadata({
  title = exhibitionTitle,
  description = config.site.description,
  pathname = "/",
  image = "/opengraph-image",
}: {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
} = {}): Metadata {
  const fullTitle = title === exhibitionTitle ? title : `${title} · ${exhibitionTitle}`;
  const url = new URL(pathname, config.site.url);
  const images = [{ url: new URL(image, config.site.url).href, width: 1200, height: 630, alt: fullTitle }];
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: config.site.name, type: "website", images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
