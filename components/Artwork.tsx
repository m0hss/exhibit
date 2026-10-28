import { GeneratedArt } from "@/components/GeneratedArt";
import { ratioOf } from "@/lib/exhibit";
import type { Work } from "@/lib/types";
import type { CSSProperties } from "react";

/** A work in its frame and mat. Size is driven by CSS (see .art-box) so nothing shifts on load. */
export function Artwork({
  work,
  size = "wall",
  priority = false,
  label,
}: {
  work: Work;
  size?: "wall" | "large";
  priority?: boolean;
  /** Accessible description. Omit when a surrounding link or caption already names the work. */
  label?: string;
}) {
  const ratio = ratioOf(work);
  return (
    <div className="frame" data-frame={work.frame}>
      <div className="mat">
        <div
          className="art-box"
          data-size={size}
          style={{ "--ratio": ratio } as CSSProperties}
          {...(label ? { role: "img", "aria-label": label } : {})}
        >
          {work.image ? (
            // Plain <img>: works with any static host and with `next export`. Size is reserved by .art-box.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={work.image.src}
              alt=""
              className="art-surface object-cover"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <GeneratedArt slug={work.slug} ratio={ratio} className="art-surface" />
          )}
        </div>
      </div>
    </div>
  );
}
