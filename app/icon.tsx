import { ImageResponse } from "next/og";
import { themeTokens } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon — a minimal "E" monogram on the exhibition ink colour. */
export default async function Icon() {
  const t = await themeTokens();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: t.ink,
        borderRadius: 4,
      }}
    >
      <span
        style={{
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 20,
          color: t.wall,
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        E
      </span>
    </div>,
    size,
  );
}
