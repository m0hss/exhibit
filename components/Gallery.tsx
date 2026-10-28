"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { isHorizontal, isTypingTarget, nearestToCenter, revealInGallery } from "@/lib/gallery-nav";

/**
 * Rooms in a row. On desktop (and only when motion is allowed) vertical scroll drives a
 * horizontal walk through the rooms: a sticky viewport + translateX from useScroll/useTransform.
 * Everywhere else CSS stacks the rooms and neutralises the transform (see globals.css).
 */
export function Gallery({ trackVw, label, children }: { trackVw: number; label: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `${-(trackVw - 100)}vw`]);

  useEffect(() => {
    const gallery = ref.current;
    if (!gallery) return;

    const links = () => Array.from(document.querySelectorAll<HTMLElement>("[data-work-link]"));
    const reveal = (el: HTMLElement) => revealInGallery((el.closest("[data-spot]") as HTMLElement | null) ?? el);

    // ← / → walk between works. Enter opens the focused work (native link behaviour).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || isTypingTarget(e.target)) return;
      const list = links();
      if (!list.length) return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const focused = (document.activeElement as HTMLElement | null)?.closest<HTMLElement>("[data-work-link]");
      let target: HTMLElement | undefined;
      if (focused) {
        target = list[list.indexOf(focused) + dir];
      } else {
        const near = nearestToCenter(list.map((l) => l.closest("[data-spot]") ?? l));
        const i = near ? list.findIndex((l) => near.contains(l)) : dir > 0 ? 0 : list.length - 1;
        target = list[i];
      }
      if (!target) return;
      e.preventDefault();
      target.focus({ preventScroll: true });
      reveal(target);
    };

    // Tabbing into an off-screen work in horizontal mode: bring it to the middle of the wall.
    const onFocusIn = (e: FocusEvent) => {
      if (!isHorizontal() || !(e.target instanceof HTMLElement)) return;
      const r = e.target.getBoundingClientRect();
      if (r.left < 0 || r.right > window.innerWidth) reveal(e.target);
    };

    // Deep links like /#room-small-machines.
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el && gallery.contains(el)) requestAnimationFrame(() => revealInGallery(el, "start"));
    };

    fromHash();
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", fromHash);
    gallery.addEventListener("focusin", onFocusIn);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", fromHash);
      gallery.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return (
    <section
      ref={ref}
      data-gallery
      aria-label={label}
      className="gallery relative"
      style={{ "--track": trackVw } as CSSProperties}
    >
      <div className="gallery-sticky">
        <motion.div data-gallery-track className="gallery-track" style={{ x }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
