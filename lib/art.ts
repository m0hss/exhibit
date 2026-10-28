/**
 * Deterministic Bauhaus-style compositions, seeded from a work's slug.
 * Same slug + ratio → same picture, on the server, in the browser and in OG images.
 */

export type ArtColor = "red" | "blue" | "yellow" | "black";

export type Shape =
  | { kind: "circle"; color: ArtColor; cx: number; cy: number; r: number }
  | { kind: "bar"; color: ArtColor; x: number; y: number; w: number; h: number; rotate: number; cx: number; cy: number }
  | { kind: "arc"; color: ArtColor; d: string };

export interface Composition {
  width: number;
  height: number;
  shapes: Shape[];
}

/** xmur3 string hash → 32-bit seed. */
function hashSeed(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** mulberry32 PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORS: ArtColor[] = ["red", "blue", "yellow", "black"];
const round = (n: number) => Math.round(n * 10) / 10;

export function compose(slug: string, ratio: number): Composition {
  const rand = mulberry32(hashSeed(slug));
  const between = (min: number, max: number) => min + rand() * (max - min);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T;

  const height = 1000;
  const width = Math.round(height * ratio);
  const unit = Math.min(width, height);
  const count = 3 + Math.floor(rand() * 5); // 3–7

  const shapes: Shape[] = [];
  let last: ArtColor | null = null;
  const nextColor = (): ArtColor => {
    let c = pick(COLORS);
    if (c === last) c = COLORS[(COLORS.indexOf(c) + 1 + Math.floor(rand() * 3)) % COLORS.length] as ArtColor;
    last = c;
    return c;
  };

  for (let i = 0; i < count; i++) {
    const roll = rand();
    const cx = round(between(0.18, 0.82) * width);
    const cy = round(between(0.18, 0.82) * height);
    const color = nextColor();

    if (roll < 0.38) {
      shapes.push({ kind: "circle", color, cx, cy, r: round(between(0.07, 0.28) * unit) });
    } else if (roll < 0.72) {
      const long = between(0.35, 0.95) * Math.max(width, height) * 0.8;
      const thick = between(0.025, 0.085) * unit;
      const rotate = pick([0, 0, 90, 90, 45, -45] as const);
      shapes.push({
        kind: "bar",
        color,
        x: round(cx - long / 2),
        y: round(cy - thick / 2),
        w: round(long),
        h: round(thick),
        rotate,
        cx,
        cy,
      });
    } else {
      const r = between(0.12, 0.34) * unit;
      const start = pick([0, 90, 180, 270] as const);
      const sweep = pick([90, 180, 180] as const);
      const a0 = (start * Math.PI) / 180;
      const a1 = ((start + sweep) * Math.PI) / 180;
      const x0 = round(cx + r * Math.cos(a0));
      const y0 = round(cy + r * Math.sin(a0));
      const x1 = round(cx + r * Math.cos(a1));
      const y1 = round(cy + r * Math.sin(a1));
      const rr = round(r);
      shapes.push({ kind: "arc", color, d: `M${cx} ${cy}L${x0} ${y0}A${rr} ${rr} 0 0 1 ${x1} ${y1}Z` });
    }
  }

  // Large solids first, bars on top: reads as a composed arrangement rather than noise.
  shapes.sort((a, b) => Number(a.kind === "bar") - Number(b.kind === "bar"));
  return { width, height, shapes };
}

export type ArtPalette = Record<ArtColor | "paper", string>;

/** Serialise a composition to an SVG string (used for Open Graph images). */
export function toSvgString(c: Composition, palette: ArtPalette): string {
  const body = c.shapes
    .map((s) => {
      const fill = palette[s.color];
      if (s.kind === "circle") return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${fill}"/>`;
      if (s.kind === "bar")
        return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${fill}" transform="rotate(${s.rotate} ${s.cx} ${s.cy})"/>`;
      return `<path d="${s.d}" fill="${fill}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.width} ${c.height}" width="${c.width}" height="${c.height}"><rect width="100%" height="100%" fill="${palette.paper}"/>${body}</svg>`;
}
