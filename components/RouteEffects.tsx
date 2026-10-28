"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toggleLights } from "@/lib/lights";
import { stopSpeaking } from "@/lib/speech";
import { isTypingTarget } from "@/lib/gallery-nav";

/** Site-wide behaviour: L toggles the lights; navigating away stops the audio guide. */
export function RouteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    stopSpeaking();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        toggleLights();
      }
    };
    const onLeave = () => stopSpeaking();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pagehide", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  return null;
}
