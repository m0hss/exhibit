"use client";

import { useEffect, useState } from "react";
import { revealInGallery } from "@/lib/gallery-nav";

interface PlanRoom {
  id: string;
  numeral: string;
  title: string;
  widthVw: number;
}

/** Top-down plan of the rooms. Highlights the room you are standing in; click to walk there. */
export function FloorPlan({
  rooms,
  label,
  jumpTemplate,
  roomWord,
}: {
  rooms: PlanRoom[];
  label: string;
  jumpTemplate: string;
  roomWord: string;
}) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      let found: string | null = null;
      document.querySelectorAll<HTMLElement>("[data-room]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (cx >= r.left && cx < r.right && cy >= r.top && cy < r.bottom) found = el.dataset.room ?? null;
      });
      setCurrent(found);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const W = 200;
  const H = 52;
  const gap = 5;
  const total = rooms.reduce((s, r) => s + r.widthVw, 0);
  const usable = W - 4 - gap * (rooms.length - 1);
  let cursor = 2;
  const laid = rooms.map((r) => {
    const w = (r.widthVw / total) * usable;
    const item = { ...r, x: cursor, w };
    cursor += w + gap;
    return item;
  });
  const active = rooms.find((r) => r.id === current);

  return (
    <nav
      aria-label={label}
      className="no-print fixed bottom-3 left-3 z-40 w-[12.5rem] border border-label-edge bg-label/95 p-1.5 text-ink shadow-sm sm:bottom-5 sm:left-5 sm:w-[13rem] sm:p-2.5"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible">
        {/* Passages between rooms */}
        {laid.slice(1).map((r) => (
          <rect key={`p-${r.id}`} x={r.x - gap - 1} y={H / 2 - 5} width={gap + 2} height={10} className="fill-wall-shade" />
        ))}
        {laid.map((r) => (
          <a
            key={r.id}
            href={`#room-${r.id}`}
            className="plan-room"
            aria-current={current === r.id ? "location" : undefined}
            aria-label={jumpTemplate.replace("{numeral}", r.numeral).replace("{title}", r.title)}
            onClick={(e) => {
              e.preventDefault();
              const room = document.getElementById(`room-${r.id}`);
              if (!room) return;
              revealInGallery(room, "start");
              room.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
              history.replaceState(null, "", `#room-${r.id}`);
            }}
          >
            <rect x={r.x} y={2} width={r.w} height={H - 4} />
            <text
              x={r.x + r.w / 2}
              y={H / 2 + 5}
              textAnchor="middle"
              className="font-sans"
              style={{ fontSize: 15, fontWeight: 500 }}
            >
              {r.numeral}
            </text>
          </a>
        ))}
      </svg>
      <p className="mt-1.5 hidden truncate text-[11px] sm:block leading-tight text-ink-soft" aria-hidden="true">
        {active ? `${roomWord} ${active.numeral} · ${active.title}` : label}
      </p>
    </nav>
  );
}
