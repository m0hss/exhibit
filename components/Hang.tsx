import Link from "next/link";
import { Artwork } from "@/components/Artwork";
import { WallLabel } from "@/components/WallLabel";
import type { PlacedWork } from "@/lib/exhibit";

/** One work on the wall: framed piece at eye level, label to the right and low. */
export function Hang({ work }: { work: PlacedWork }) {
  const labelId = `label-${work.slug}`;
  return (
    <figure className="hang" data-spot data-work-index={work.index}>
      <Link
        href={`/works/${work.slug}`}
        className="hang-link block"
        data-work-link={work.index}
        aria-label={`${work.title}, ${work.year}`}
        aria-describedby={labelId}
      >
        <Artwork work={work} />
      </Link>
      <figcaption>
        <WallLabel work={work} id={labelId} />
      </figcaption>
    </figure>
  );
}
