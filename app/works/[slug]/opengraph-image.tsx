import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { themeTokens, workArtSource } from "@/lib/og";
import { artistLine, config, dimensions, getWork, ratioOf, works } from "@/lib/exhibit";

/*
 * Each work's Open Graph image doubles as its gift-shop postcard.
 * Generated once at build time (static), no runtime server needed.
 * Colors are read from app/theme.css so the palette has a single source of truth.
 */

export const size = { width: 1200, height: 630 };
export const dynamicParams = false;
export const contentType = "image/png";
export const alt = `${config.artist.name} — ${config.exhibition.title}`;

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const t = await themeTokens();
  const ratio = ratioOf(work);

  const src = await workArtSource(work, t.art);

  // Fit the art inside a 640×440 box on the left wall.
  const boxW = 600;
  const boxH = 400;
  const artW = Math.round(Math.min(boxW, boxH * ratio));
  const artH = Math.round(artW / ratio);
  const frameColor = { black: t.frameBlack, oak: t.frameOak, white: t.frameWhite, none: "transparent" }[work.frame];
  const framePad = work.frame === "none" ? 0 : 14;
  const matPad = work.frame === "none" ? 0 : 26;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(to bottom, ${t.wall} 0%, ${t.wall} 50%, ${t.wallShade} 82%, ${t.floor} 82%, ${t.floor} 100%)`,
          color: t.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 720, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
          <div style={{ display: "flex", padding: framePad, background: frameColor, boxShadow: `0 24px 40px -18px ${t.ink}59` }}>
            <div style={{ display: "flex", padding: matPad, background: t.mat }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} width={artW} height={artH} alt="" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 64px 150px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}>
            <span>{config.exhibition.title}</span>
            <span style={{ marginTop: 6, opacity: 0.7 }}>{config.exhibition.years}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: t.label,
              padding: "26px 28px",
              fontSize: 20,
              lineHeight: 1.4,
              position: "relative",
            }}
          >
            <span style={{ fontWeight: 700 }}>{artistLine()}</span>
            <span style={{ fontSize: 30, marginTop: 6 }}>
              {`${work.title}, ${work.year}`}
            </span>
            <span style={{ marginTop: 8, opacity: 0.75 }}>{work.medium}</span>
            <span style={{ opacity: 0.75 }}>{dimensions(work)}</span>
            <span style={{ marginTop: 10, fontSize: 16, letterSpacing: 1 }}>{work.accession}</span>
            {work.shipped ? (
              <div
                style={{
                  position: "absolute",
                  right: -12,
                  bottom: -12,
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: t.redDot,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
