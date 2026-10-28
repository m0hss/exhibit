"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { GALLERY_NAVIGATION_EVENT, HORIZONTAL_QUERY, isHorizontal, isTypingTarget, nearestToCenter, revealInGallery, roomSnapTarget } from "@/lib/gallery-nav";

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
    const track = gallery?.querySelector<HTMLElement>("[data-gallery-track]");
    if (!gallery || !track) return;
    const media = window.matchMedia(HORIZONTAL_QUERY);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let navigating = false;
    let snapping = false;
    let pointerDown = false;

    const clear = () => clearTimeout(timer);
    const settle = () => {
      if (navigating || snapping) {
        navigating = snapping = false;
        return;
      }
      if (!media.matches || pointerDown) return;
      const top = gallery.getBoundingClientRect().top + window.scrollY;
      const distance = gallery.offsetHeight - window.innerHeight;
      const maxX = track.offsetWidth - window.innerWidth;
      if (distance <= 0 || maxX <= 0 || window.scrollY < top || window.scrollY > top + distance) return;
      const trackLeft = track.getBoundingClientRect().left;
      const entrances = Array.from(track.querySelectorAll<HTMLElement>("[data-room]"), (room) => {
        const offset = room.getBoundingClientRect().left - trackLeft;
        return top + Math.min(maxX, Math.max(0, offset)) / maxX * distance;
      });
      const target = roomSnapTarget(window.scrollY, entrances, window.innerWidth);
      if (target === null) return;
      snapping = true;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    const schedule = () => {
      clear();
      timer = setTimeout(settle, 180);
    };
    const cancel = () => {
      clear();
      if (snapping) window.scrollTo({ top: window.scrollY, behavior: "instant" });
      snapping = navigating = false;
    };
    const navigate = () => {
      cancel();
      navigating = true;
      schedule();
    };
    const down = () => { cancel(); pointerDown = true; };
    const up = () => { pointerDown = false; };
    // Capture lets explicit keyboard navigation suppress snapping after cancellation.
    window.addEventListener("keydown", cancel, true);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchend", up);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", navigate);
    window.addEventListener(GALLERY_NAVIGATION_EVENT, navigate);
    media.addEventListener("change", navigate);
    return () => {
      clear();
      window.removeEventListener("keydown", cancel, true);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchend", up);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", navigate);
      window.removeEventListener(GALLERY_NAVIGATION_EVENT, navigate);
      media.removeEventListener("change", navigate);
    };
  }, []);

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
      // Floor-plan navigation focuses its heading but deliberately aligns the room's start.
      if (e.target.matches('[tabindex="-1"]')) return;
      const r = e.target.getBoundingClientRect();
      if (r.left < 0 || r.right > window.innerWidth) reveal(e.target);
    };

    // Deep links like /#room-small-machines.
    const fromHash = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
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
