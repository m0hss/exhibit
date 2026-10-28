import { config, format, postcardUrl, works } from "@/lib/exhibit";

export function GiftShop() {
  const { ui, artist } = config;
  const mailto = `mailto:${artist.email}?subject=${encodeURIComponent(ui.giftShop.commissionsSubject)}`;
  return (
    <section id="gift-shop" aria-labelledby="gift-shop-title" className="bg-wall-shade px-5 pb-32 pt-24 sm:px-10 lg:px-[5vw]">
      <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">{ui.giftShop.eyebrow}</p>
      <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="gift-shop-title" className="text-[clamp(2.5rem,9vw,6rem)] font-semibold leading-none tracking-[-0.04em]">
            {ui.giftShop.title}
          </h2>
          <p className="mt-4 max-w-[44ch] font-serif text-lg text-ink-soft">{ui.giftShop.body}</p>
        </div>
        <a
          href={mailto}
          className="inline-flex w-fit items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-medium text-wall transition-opacity hover:opacity-90"
          data-spot
        >
          <span aria-hidden="true" className="inline-block size-2.5 rounded-full bg-red-dot" />
          {ui.giftShop.commissions}
        </a>
      </div>

      <h3 className="mt-16 text-sm font-medium uppercase tracking-[0.18em]">{ui.giftShop.postcards}</h3>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {works.map((work) => (
          <li key={work.slug} data-spot>
            <a
              href={postcardUrl(work)}
              download={`${work.slug}-postcard.png`}
              className="group block"
              aria-label={format(ui.giftShop.download, { title: work.title })}
            >
              <span data-spot-surface className="block aspect-[1200/630] overflow-hidden bg-label shadow-[0_1px_2px_var(--shadow-contact),0_14px_30px_-18px_var(--shadow-cast)] transition-transform motion-safe:group-hover:-translate-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={postcardUrl(work)} alt="" width={1200} height={630} loading="lazy" decoding="async" className="block h-full w-full" />
              </span>
              <span className="mt-2.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate">
                  <cite className="italic">{work.title}</cite>, {work.year}
                </span>
                <span aria-hidden="true" className="shrink-0 font-mono text-[11px] text-ink-soft group-hover:underline">
                  {ui.giftShop.fileHint}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-16 max-w-[60ch] text-xs leading-relaxed text-ink-soft">{ui.fictionalNotice}</p>
    </section>
  );
}
