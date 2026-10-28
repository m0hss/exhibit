"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLights } from "@/lib/lights";
import { nearestToCenter } from "@/lib/gallery-nav";

type Mode = "pointer" | "focus" | "center";

/**
 * After hours: only artwork surfaces are dimmed outside a radial spotlight.
 * Labels, controls and focus rings are never covered by a page-wide veil.
 *  - mouse      → the light follows the cursor
 *  - keyboard   → the light sits on the focused work (or focused control)
 *  - touch/none → the light sits on the work nearest the centre of the screen
 * Updates CSS variables directly (no React re-renders while moving).
 */
export function Spotlight() {
  const lights = useLights();
  const pathname = usePathname();

  useEffect(() => {
    if (lights !== "off") return;
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>("[data-spot-surface]"));

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let mode: Mode = "center";
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let frame = 0;

    const setVars = (x: number, y: number, r: number) => {
      for (const surface of surfaces) {
        const box = surface.getBoundingClientRect();
        surface.style.setProperty("--spot-x", `${Math.round(x - box.left)}px`);
        surface.style.setProperty("--spot-y", `${Math.round(y - box.top)}px`);
        surface.style.setProperty("--spot-r", `${Math.round(r)}px`);
      }
    };

    const fitTo = (target: Element) => {
      const r = target.getBoundingClientRect();
      const radius = Math.max(Math.hypot(r.width, r.height) * 0.95, 160);
      setVars(r.left + r.width / 2, r.top + r.height / 2, radius);
    };

    const pointerRadius = () => Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.52, 240);

    const update = () => {
      frame = 0;
      if (mode === "pointer") {
        setVars(pointer.x, pointer.y, pointerRadius());
        return;
      }
      if (mode === "focus") {
        const active = document.activeElement;
        if (active && active !== document.body) {
          fitTo(active.closest("[data-spot]") ?? active);
          return;
        }
      }
      const target = nearestToCenter(document.querySelectorAll("[data-spot]"));
      if (target) fitTo(target);
      else setVars(window.innerWidth / 2, window.innerHeight / 2, pointerRadius());
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mode = "pointer";
        pointer = { x: e.clientX, y: e.clientY };
      } else {
        mode = "center";
      }
      schedule();
    };
    const onFocus = () => {
      // Mouse clicks also move focus; only keyboard-style (focus-visible) focus takes the light.
      if (document.activeElement?.matches(":focus-visible")) mode = "focus";
      schedule();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
        mode = "focus";
        schedule();
      }
    };

    mode = finePointer ? "pointer" : "center";
    update();

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      for (const surface of surfaces) {
        for (const property of ["--spot-x", "--spot-y", "--spot-r"]) surface.style.removeProperty(property);
      }
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
    };
  }, [lights, pathname]);

  return null;
}
