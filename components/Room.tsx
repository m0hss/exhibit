import type { CSSProperties } from "react";
import { Hang } from "@/components/Hang";
import { config, type PlacedRoom } from "@/lib/exhibit";

export function Room({ room }: { room: PlacedRoom }) {
  const headingId = `room-${room.id}-title`;
  return (
    <article
      id={`room-${room.id}`}
      data-room={room.id}
      aria-labelledby={headingId}
      className="room"
      style={{ "--room-w": room.widthVw } as CSSProperties}
    >
      <header className="room-intro wall flex flex-col justify-start px-5 pb-[24svh] pt-24 sm:px-10 lg:pl-[5vw] lg:pr-[3vw] lg:pt-[16vh]">
        <p
          aria-hidden="true"
          className="font-sans text-[clamp(6rem,30vw,10rem)] font-light leading-[0.85] tracking-tight text-muted lg:text-[clamp(8rem,16vw,15rem)]"
        >
          {room.numeral}
        </p>
        <h2 id={headingId} tabIndex={-1} className="mt-6 text-2xl font-medium tracking-tight sm:text-3xl">
          <span className="block text-xs font-normal uppercase tracking-[0.2em] text-ink-soft">
            {config.ui.room} {room.numeral}
          </span>
          <span className="mt-2 block">{room.title}</span>
        </h2>
        <p className="mt-4 max-w-[34ch] font-serif text-lg leading-snug text-ink-soft">{room.intro}</p>
      </header>
      <div className="room-bays">
        {room.works.map((work) => (
          <div key={work.slug} className="bay wall">
            <Hang work={work} />
          </div>
        ))}
      </div>
    </article>
  );
}
