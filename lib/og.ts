import { readFile } from "node:fs/promises";
import path from "node:path";
import { compose, toSvgString, type ArtPalette } from "@/lib/art";
import { ratioOf } from "@/lib/exhibit";
import type { Work } from "@/lib/types";

/** Server-only image helpers. The CSS palette is also the poster/postcard palette. */
export async function themeTokens() {
  const css = await readFile(path.join(process.cwd(), "app/theme.css"), "utf8");
  const block = css.replace(/\/\*[\s\S]*?\*\//g, "").match(/:root\s*\{([^}]+)\}/)?.[1];
  if (!block) throw new Error("app/theme.css: missing :root palette");
  const token = (name: string) => {
    const match = block.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
    if (!match?.[1]) throw new Error(`app/theme.css: --${name} must be a hex color in :root`);
    return match[1];
  };
  return {
    wall: token("wall"),
    wallShade: token("wall-shade"),
    floor: token("floor"),
    ink: token("ink"),
    label: token("label"),
    redDot: token("red-dot"),
    frameBlack: token("frame-black"),
    frameOak: token("frame-oak"),
    frameWhite: token("frame-white"),
    mat: token("mat"),
    art: {
      paper: token("art-paper"),
      red: token("art-red"),
      blue: token("art-blue"),
      yellow: token("art-yellow"),
      black: token("art-black"),
    } satisfies ArtPalette,
  };
}

const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };

export function generatedArtSource(seed: string, ratio: number, palette: ArtPalette): string {
  return `data:image/svg+xml;base64,${Buffer.from(toSvgString(compose(seed, ratio), palette)).toString("base64")}`;
}

export async function workArtSource(work: Work, palette: ArtPalette): Promise<string> {
  if (!work.image) return generatedArtSource(work.slug, ratioOf(work), palette);
  const file = await readFile(path.join(process.cwd(), "public", work.image.src));
  return `data:${MIME[path.extname(work.image.src).toLowerCase()] ?? "image/png"};base64,${file.toString("base64")}`;
}
