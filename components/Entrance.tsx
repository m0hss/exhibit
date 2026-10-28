import { config } from "@/lib/exhibit";

export function Entrance() {
  const { exhibition, artist, ui } = config;
  return (
    <section aria-labelledby="exhibition-title" className="wall flex min-h-svh flex-col justify-start px-5 pb-[24svh] pt-24 sm:px-10 lg:px-[5vw] lg:pt-[14vh]" data-spot>
      <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">{artist.name}</p>
      <h1
        id="exhibition-title"
        className="mt-4 max-w-[12ch] text-[clamp(3.25rem,15vw,12.5rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-balance"
      >
        {exhibition.title}
      </h1>
      <div className="mt-8 flex flex-col gap-6 sm:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="shrink-0">
          <p className="text-2xl font-light tracking-tight sm:text-3xl">{exhibition.years}</p>
          <p className="mt-2 text-sm text-ink-soft">{exhibition.hours}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm">
            <span aria-hidden="true" className="inline-block size-3 rounded-full bg-red-dot" />
            {ui.legend}
          </p>
        </div>
        <p className="max-w-[48ch] font-serif text-lg leading-relaxed text-ink sm:text-xl">{exhibition.statement}</p>
      </div>
      <p className="mt-8 hidden text-xs text-ink-soft [@media(hover:hover)_and_(pointer:fine)]:block">{ui.keyboardHint}</p>
    </section>
  );
}
