import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Artwork } from "@/components/Artwork";
import { PrintButton } from "@/components/PrintButton";
import { WallLabel } from "@/components/WallLabel";
import { altFor, config, rooms, works } from "@/lib/exhibit";

export function generateMetadata() {
  return pageMetadata({
    title: config.ui.catalog.title,
    description: `${config.ui.catalog.title}: ${config.site.description}`,
    pathname: "/catalog",
  });
}

export default function CatalogPage() {
  const { exhibition, artist, ui } = config;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {/* Cover */}
      <section className="print-cover wall flex min-h-svh flex-col justify-between px-5 pb-[24svh] pt-24 sm:px-10 lg:px-[5vw]">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">{ui.catalog.title}</p>
          <PrintButton label={ui.catalog.print} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.22em]">{artist.name}</p>
          <h1 className="mt-3 max-w-[12ch] text-[clamp(3rem,13vw,9rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
            {exhibition.title}
          </h1>
          <p className="mt-6 text-2xl font-light">{exhibition.years}</p>
          <p className="mt-2 text-sm text-ink-soft">{exhibition.curator}</p>
        </div>
      </section>

      {/* Contents */}
      <section aria-labelledby="contents-title" className="print-page mx-auto max-w-3xl px-5 py-20 sm:px-10">
        <h2 id="contents-title" className="text-xs uppercase tracking-[0.2em] text-ink-soft">
          {ui.catalog.contents}
        </h2>
        <ol className="mt-6 space-y-8">
          {rooms.map((room) => (
            <li key={room.id}>
              <p className="text-sm font-medium">
                {ui.room} {room.numeral} · {room.title}
              </p>
              <ol className="mt-2 space-y-1 text-sm">
                {room.works.map((w) => (
                  <li key={w.slug} className="flex justify-between gap-4 border-b border-ink/10 pb-1">
                    <a href={`#plate-${w.slug}`} className="hover:underline">
                      <cite className="italic">{w.title}</cite>, {w.year}
                    </a>
                    <span className="font-mono text-xs text-ink-soft">
                      {ui.catalog.plate} {w.index + 1}
                    </span>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>

      {/* Plates: one work per printed page */}
      {works.map((work) => (
        <article
          key={work.slug}
          id={`plate-${work.slug}`}
          aria-labelledby={`plate-title-${work.slug}`}
          className="print-page mx-auto max-w-5xl border-t border-ink/10 px-5 py-20 sm:px-10"
        >
          <p className="font-mono text-xs text-ink-soft">
            {ui.catalog.plate} {work.index + 1} · {ui.room} {work.numeral}
          </p>
          <h2 id={`plate-title-${work.slug}`} className="mt-2 text-3xl font-semibold tracking-tight">
            <Link href={`/works/${work.slug}`} className="hover:underline">
              {work.title}
            </Link>
          </h2>
          <div className="print-art mt-10 flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-center" data-spot>
            <Artwork work={work} label={altFor(work)} />
            <WallLabel work={work} />
          </div>
          <p className="mx-auto mt-10 max-w-[60ch] font-serif text-lg leading-relaxed">{work.note}</p>
        </article>
      ))}

      {/* Essay */}
      <article aria-labelledby="essay-title" className="print-page mx-auto max-w-3xl border-t border-ink/10 px-5 py-20 sm:px-10">
        <h2 id="essay-title" className="text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-tight tracking-tight">
          {exhibition.essay.title}
        </h2>
        <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed">
          {exhibition.essay.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-soft">— {exhibition.curator}</p>
        <p className="mt-16 text-xs text-ink-soft">{ui.catalog.colophon}</p>
      </article>
    </main>
  );
}
