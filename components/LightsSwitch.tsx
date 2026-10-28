"use client";

import { toggleLights, useLights } from "@/lib/lights";

export function LightsSwitch({ label, on, off }: { label: string; on: string; off: string }) {
  const lights = useLights();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={lights === "on"}
      aria-keyshortcuts="L"
      onClick={toggleLights}
      className="group inline-flex h-9 items-center gap-2.5 rounded-full px-1.5 text-[13px] text-ink"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="hidden text-ink-soft sm:inline">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="relative inline-flex h-5 w-10 shrink-0 items-center rounded-full border border-ink/60 bg-wall-shade"
      >
        <span className="lights-knob absolute left-0.5 size-3.5 rounded-full bg-ink" />
      </span>
      {/* Both states are rendered; CSS picks one from <html data-lights>, so there is no flash on load. */}
      <span aria-hidden="true" className="min-w-[5.5rem] text-left">
        <span className="lights-off:hidden">{on}</span>
        <span className="hidden lights-off:inline">{off}</span>
      </span>
    </button>
  );
}
