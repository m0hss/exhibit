import { ImageResponse } from "next/og";
import { config, ratioOf, works } from "@/lib/exhibit";
import { generatedArtSource, themeTokens } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${config.exhibition.title}, ${config.exhibition.years} — an exhibition by ${config.artist.name}`;

export default async function Image() {
  const t = await themeTokens();
  const work = works[0];
  const ratio = work ? ratioOf(work) : 1;
  const src = generatedArtSource(work?.slug ?? config.exhibition.title, ratio, t.art);
  const artWidth = Math.round(Math.min(472, 438 * ratio));
  const artHeight = Math.round(artWidth / ratio);

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", padding: 52, background: t.wall, color: t.ink, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 570, paddingRight: 40 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 3, textTransform: "uppercase" }}>{config.artist.name}</div>
          <div style={{ marginTop: 38, fontSize: config.exhibition.title.length > 32 ? 62 : 80, fontWeight: 700, lineHeight: 0.98, letterSpacing: -4 }}>
            {config.exhibition.title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: `2px solid ${t.ink}`, paddingTop: 22 }}>
          <div style={{ fontSize: 48, letterSpacing: -2 }}>{config.exhibition.years}</div>
          <div style={{ marginTop: 12, fontSize: 18 }}>{config.exhibition.hours}</div>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", background: t.wallShade }}>
        <div style={{ display: "flex", padding: 12, background: t.mat, boxShadow: `0 16px 32px ${t.ink}20` }}>
          {/* Generated from the same seed and palette as the gallery. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={artWidth} height={artHeight} alt="" />
        </div>
      </div>
    </div>,
    size,
  );
}
