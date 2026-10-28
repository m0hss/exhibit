"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTypingTarget } from "@/lib/gallery-nav";

/** ← / → on a work page go to the previous / next work. */
export function WorkKeys({ prev, next }: { prev?: string; next?: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || isTypingTarget(e.target)) return;
      const href = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : undefined;
      if (!href) return;
      e.preventDefault();
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);
  return null;
}
