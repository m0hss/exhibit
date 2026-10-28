import { compose, type ArtColor } from "@/lib/art";

const FILL: Record<ArtColor, string> = {
  red: "var(--art-red)",
  blue: "var(--art-blue)",
  yellow: "var(--art-yellow)",
  black: "var(--art-black)",
};

/** Deterministic composition drawn from the slug. Purely presentational. */
export function GeneratedArt({ slug, ratio, className }: { slug: string; ratio: number; className?: string }) {
  const c = compose(slug, ratio);
  return (
    <svg
      viewBox={`0 0 ${c.width} ${c.height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={c.width} height={c.height} style={{ fill: "var(--art-paper)" }} />
      {c.shapes.map((s, i) => {
        const style = { fill: FILL[s.color] };
        if (s.kind === "circle") return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} style={style} />;
        if (s.kind === "bar")
          return (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              transform={`rotate(${s.rotate} ${s.cx} ${s.cy})`}
              style={style}
            />
          );
        return <path key={i} d={s.d} style={style} />;
      })}
    </svg>
  );
}
