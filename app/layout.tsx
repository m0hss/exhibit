import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { RouteEffects } from "@/components/RouteEffects";
import { SiteHeader } from "@/components/SiteHeader";
import { Spotlight } from "@/components/Spotlight";
import { config } from "@/lib/exhibit";
import { exhibitionTitle, pageMetadata } from "@/lib/metadata";
import { LIGHTS_STORAGE_KEY } from "@/lib/constants";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  const metadata = pageMetadata();
  // Canonicals belong to pages, so unknown routes do not claim the home URL.
  return {
    ...metadata,
    alternates: undefined,
    metadataBase: new URL(config.site.url),
    title: { default: exhibitionTitle, template: `%s · ${exhibitionTitle}` },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Runs before paint so a visitor who left the lights off never sees a flash of the bright gallery.
const lightsScript = `try{if(localStorage.getItem(${JSON.stringify(LIGHTS_STORAGE_KEY)})==="off")document.documentElement.dataset.lights="off"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={config.lang}
      data-lights="on"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: lightsScript }} />
      </head>
      <body className="min-h-svh antialiased">
        <a href="#main" className="skip-link no-print">
          {config.ui.skipLink}
        </a>
        <SiteHeader />
        {children}
        <Spotlight />
        <RouteEffects />
      </body>
    </html>
  );
}
