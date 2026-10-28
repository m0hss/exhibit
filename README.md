# Exhibit

A portfolio template that stages your work as a solo museum exhibition.
Frontend only, fully static: no backend, no API routes, no database, no environment variables.

## Make it yours

1. **Content** — edit `exhibit.config.ts`. Artist, exhibition, rooms, works and every UI string live there.
   - Works without an `image` get a generated composition seeded from their `slug`.
   - To use a screenshot, put it in `/public` and set `image: { src: "/my-work.png", alt: "…" }`.
   - `size` sets the frame's proportions; `frame` is `"black" | "oak" | "white" | "none"`; `shipped: true` adds the red dot.
2. **Colors** — edit `app/theme.css`. `:root` is the gallery, `[data-lights="off"]` is after hours.
   Postcards (Open Graph images) read their colors from `:root` too, so keep those values as hex.
3. **Deploy** — `npm run build`. Every route, including postcards, is prerendered.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · Motion · next/font (Geist, Newsreader, Geist Mono).

## Routes

| Route | What it is |
| --- | --- |
| `/` | Entrance wall → rooms → gift shop |
| `/works/[slug]` | Large view, full label, curator's note, previous/next |
| `/works/[slug]/opengraph-image` | 1200×630 postcard (also the OG image) |
| `/catalog` | Printable catalog: cover, one work per page, essay (A4 and Letter) |

## Behavior

- **Desktop** (≥1024px, motion allowed): vertical scroll walks horizontally through the rooms (sticky viewport + `useScroll`/`useTransform`). The geometry is computed from the config, so nothing is measured on load and the layout never shifts.
- **Mobile and `prefers-reduced-motion`**: rooms stack vertically and nothing moves. Hover lean-in and spotlight easing are off too.
- **Keyboard**: `←`/`→` move between works, `Enter` opens one, `L` toggles the lights. On a work page, `←`/`→` go to the previous/next work.
- **After hours**: walls go dark and works show only inside a spotlight. With a mouse it follows the cursor. With the keyboard it sits on the focused work. On touch screens it sits on the work closest to the center of the screen.
- **Audio guide**: the headphone tag reads the curator's note through `speechSynthesis` in the configured `lang`. It's hidden where speech isn't supported and stops when you navigate.
- **Floor plan**: bottom-left. It highlights the current room, and clicking a room takes you there.

## Contrast

All text pairs pass WCAG AA in both palettes. `--muted` (3.5:1 on the gallery wall) is only used for the giant decorative room numerals, which are hidden from screen readers. Small secondary text uses `--ink-soft`.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run typecheck`

All names, companies and works are fictional.
