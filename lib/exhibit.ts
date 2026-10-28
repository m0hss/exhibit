import config from "@/exhibit.config";
import type { Room, Work } from "@/lib/types";

export { config };

/** Replace {key} placeholders in a UI string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n: number): string {
  let out = "";
  let rest = n;
  for (const [value, glyph] of ROMAN) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

export interface PlacedWork extends Work {
  /** 0-based position in the walking order. */
  index: number;
  /** Audio guide stop number, museum style: room 2, second work → 202. */
  stop: number;
  roomIndex: number;
  numeral: string;
  roomTitle: string;
}

export interface PlacedRoom extends Room {
  index: number;
  numeral: string;
  works: PlacedWork[];
  /** Width of the room on desktop, in vw. Deterministic so the layout never shifts. */
  widthVw: number;
}

/** Desktop wall geometry (vw). Room = intro panel + one bay per work, min. one viewport. */
export const WALL = { introVw: 38, bayVw: 52 } as const;

function buildRooms(): PlacedRoom[] {
  let index = 0;
  return config.rooms.map((room, roomIndex) => {
    const numeral = toRoman(roomIndex + 1);
    const works = config.works
      .filter((w) => w.room === room.id)
      .map((w, i): PlacedWork => ({
        ...w,
        index: index++,
        stop: (roomIndex + 1) * 100 + i + 1,
        roomIndex,
        numeral,
        roomTitle: room.title,
      }));
    return {
      ...room,
      index: roomIndex,
      numeral,
      works,
      widthVw: Math.max(100, WALL.introVw + works.length * WALL.bayVw),
    };
  });
}

export const rooms: PlacedRoom[] = buildRooms();
export const works: PlacedWork[] = rooms.flatMap((r) => r.works);
export const trackVw: number = rooms.reduce((sum, r) => sum + r.widthVw, 0);

export function getWork(slug: string): PlacedWork | undefined {
  return works.find((w) => w.slug === slug);
}

export function getNeighbors(work: PlacedWork) {
  const prev = works[work.index - 1];
  const next = works[work.index + 1];
  return { prev, next };
}

export function ratioOf(work: Work): number {
  return work.size.w / work.size.h;
}

export function dimensions(work: Work): string {
  return `${work.size.w.toLocaleString("en-US")} × ${work.size.h.toLocaleString("en-US")} ${work.size.unit}`;
}

export function artistLine(): string {
  return `${config.artist.name} (${config.ui.work.born} ${config.artist.born})`;
}

export function altFor(work: Work): string {
  return work.image?.alt ?? format(config.ui.generatedAlt, { title: work.title });
}

/** Static URL of the Open Graph image generated for each work (also used as the postcard). */
export function postcardUrl(work: Work): string {
  return `/works/${work.slug}/opengraph-image`;
}

// Fail loudly at build time on config mistakes, rather than silently in production.
{
  const slugs = new Set<string>();
  for (const w of config.works) {
    if (slugs.has(w.slug)) throw new Error(`exhibit.config: duplicate slug "${w.slug}"`);
    slugs.add(w.slug);
    if (!config.rooms.some((r) => r.id === w.room)) {
      throw new Error(`exhibit.config: work "${w.slug}" points to unknown room "${w.room}"`);
    }
  }
}
