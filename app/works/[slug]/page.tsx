import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Artwork } from "@/components/Artwork";
import { WallLabel } from "@/components/WallLabel";
import { WorkKeys } from "@/components/WorkKeys";
import { altFor, config, format, getNeighbors, getWork, works } from "@/lib/exhibit";

export const dynamicParams = false;

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  return pageMetadata({
    title: `${work.title}, ${work.year}`,
    description: work.note,
    pathname: `/works/${work.slug}`,
    image: `/works/${work.slug}/opengraph-image`,
  });
}

export default async function WorkPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const { prev, next } = getNeighbors(work);
  const { ui } = config;
  const room = config.rooms[work.roomIndex];

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <WorkKeys prev={prev && `/works/${prev.slug}`} next={next && `/works/${next.slug}`} />
      <div className="wall px-5 pb-[18svh] pt-20 sm:px-10 lg:px-[5vw]">
        <nav aria-label={ui.nav.exhibition} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
          <Link href={`/#room-${room?.id ?? ""}`} className="underline-offset-4 hover:underline">
            ← {ui.work.back}
          </Link>
          <span className="text-ink-soft">{format(ui.work.inRoom, { numeral: work.numeral, title: work.roomTitle })}</span>
        </nav>
        <div className="flex min-h-[calc(100svh-9rem)] items-center justify-center py-10">
          <figure className="hang" data-spot>
            <Artwork work={work} size="large" priority label={altFor(work)} />
            <figcaption>
              <WallLabel work={work} />
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-10">
        <h1 className="text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.035em]">{work.title}</h1>
        <p className="mt-3 text-ink-soft">
          {config.artist.name}, {work.year}
        </p>
        <section aria-labelledby="note-title" className="mt-12">
          <h2 id="note-title" className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            {ui.work.curatorNote}
          </h2>
          <p className="mt-4 font-serif text-xl leading-relaxed sm:text-2xl">{work.note}</p>
          <p className="mt-4 text-sm text-ink-soft">— {config.exhibition.curator}</p>
        </section>
        {work.href && (
          <p className="mt-10">
            <a href={work.href} className="underline underline-offset-4" rel="noreferrer">
              {ui.work.visit} ↗
            </a>
          </p>
        )}

        <nav aria-label={`${ui.work.previous} / ${ui.work.next}`} className="mt-16 grid grid-cols-2 gap-4 border-t border-ink/15 pt-6 text-sm">
          <div>
            {prev && (
              <Link href={`/works/${prev.slug}`} rel="prev" className="group block" aria-keyshortcuts="ArrowLeft">
                <span className="block text-ink-soft">← {ui.work.previous}</span>
                <cite className="mt-1 block italic group-hover:underline">{prev.title}</cite>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/works/${next.slug}`} rel="next" className="group block" aria-keyshortcuts="ArrowRight">
                <span className="block text-ink-soft">{ui.work.next} →</span>
                <cite className="mt-1 block italic group-hover:underline">{next.title}</cite>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </main>
  );
}
