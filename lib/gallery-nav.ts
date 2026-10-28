"use client";

/** Desktop + motion allowed → rooms scroll horizontally. Must match app/globals.css. */
export const HORIZONTAL_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
export const GALLERY_NAVIGATION_EVENT = "exhibit:gallery-navigation";

export function isHorizontal(): boolean {
  return window.matchMedia(HORIZONTAL_QUERY).matches;
}

function behavior(): ScrollBehavior {
  return window.matchMedia(REDUCED_QUERY).matches ? "auto" : "smooth";
}

/**
 * Bring any element inside the gallery into view.
 * Horizontal mode maps the element's x-offset in the track to the page's scrollY (1:1).
 */
export function revealInGallery(el: HTMLElement, align: "center" | "start" = "center") {
  window.dispatchEvent(new Event(GALLERY_NAVIGATION_EVENT));
  const gallery = document.querySelector<HTMLElement>("[data-gallery]");
  const track = document.querySelector<HTMLElement>("[data-gallery-track]");
  if (!gallery || !track || !gallery.contains(el) || !isHorizontal()) {
    el.scrollIntoView({ behavior: behavior(), block: align === "start" ? "start" : "center", inline: "nearest" });
    return;
  }
  const vw = window.innerWidth;
  const maxX = track.offsetWidth - vw;
  const scrollDistance = gallery.offsetHeight - window.innerHeight;
  if (maxX <= 0 || scrollDistance <= 0) return;

  const elRect = el.getBoundingClientRect();
  const offset = elRect.left - track.getBoundingClientRect().left; // independent of the current transform
  const wanted = align === "start" ? offset : offset + elRect.width / 2 - vw / 2;
  const x = Math.min(Math.max(wanted, 0), maxX);
  const galleryTop = gallery.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: galleryTop + (x / maxX) * scrollDistance, behavior: behavior() });
}

/** Gentle room proximity, measured along the page's scroll axis. */
export function roomSnapTarget(current: number, entrances: number[], viewportWidth: number): number | null {
  const nearest = entrances.reduce<number | null>((best, point) =>
    best === null || Math.abs(point - current) < Math.abs(best - current) ? point : best, null);
  if (nearest === null) return null;
  const distance = Math.abs(nearest - current);
  return distance > 1 && distance <= Math.min(160, viewportWidth * 0.18) ? nearest : null;
}

/** The element (from a list) whose box is closest to the viewport centre. */
export function nearestToCenter<T extends Element>(elements: Iterable<T>): T | null {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  let best: T | null = null;
  let bestDist = Infinity;
  for (const el of elements) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) continue;
    const d = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
    if (d < bestDist) {
      bestDist = d;
      best = el;
    }
  }
  return best;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}
