import Link from "next/link";
import { LightsSwitch } from "@/components/LightsSwitch";
import { NavLinks } from "@/components/NavLinks";
import { config } from "@/lib/exhibit";

export function SiteHeader() {
  const { ui, artist, exhibition } = config;
  return (
    <header className="no-print fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-wall/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="min-w-0 truncate text-[13px]">
          <span className="font-semibold">{artist.name}</span>
          <span className="hidden text-ink-soft md:inline"> — {exhibition.title}</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <NavLinks
            label={ui.nav.primary}
            links={[
              { href: "/", text: ui.nav.exhibition, className: "hidden sm:block" },
              { href: "/catalog", text: ui.nav.catalog },
            ]}
          />
          <LightsSwitch label={ui.lights.label} on={ui.lights.on} off={ui.lights.off} />
        </div>
      </div>
    </header>
  );
}
