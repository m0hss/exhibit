"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ links, label }: { links: { href: string; text: string; className?: string }[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-4 text-[13px] sm:gap-6">
        {links.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <li key={l.href} className={l.className}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className="underline-offset-4 hover:underline aria-[current=page]:underline"
              >
                {l.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
