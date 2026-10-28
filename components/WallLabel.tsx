import { AudioGuideButton } from "@/components/AudioGuideButton";
import { artistLine, config, dimensions, format, type PlacedWork } from "@/lib/exhibit";

export function WallLabel({ work, id, className = "" }: { work: PlacedWork; id?: string; className?: string }) {
  const { ui } = config;
  return (
    <div className={`wall-label ${className}`} id={id}>
      <div className="no-print absolute right-2.5 top-2.5">
        <AudioGuideButton
          id={work.slug}
          stop={work.stop}
          text={`${work.title}. ${work.note}`}
          lang={config.lang}
          playLabel={format(ui.audio.play, { n: work.stop, title: work.title })}
          stopLabel={format(ui.audio.stop, { n: work.stop })}
        />
      </div>
      <p className="pr-14 font-semibold">{artistLine()}</p>
      <p className="mt-1 pr-14">
        <cite className="font-medium italic">{work.title}</cite>, {work.year}
      </p>
      <p className="mt-2 text-ink-soft">{work.medium}</p>
      <p className="text-ink-soft">{dimensions(work)}</p>
      <p className="mt-2 text-ink-soft">{work.credit}</p>
      <p className="mt-3 font-mono text-[11px] tracking-wide text-ink-soft">
        <span className="sr-only">{ui.work.accession} </span>
        {work.accession}
      </p>
      {work.shipped && <span className="red-dot" role="img" aria-label={ui.shippedSticker} />}
    </div>
  );
}
