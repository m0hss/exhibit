/**
 * Exhibit — the only file you need to edit.
 *
 * Everything on the site (copy, rooms, works, labels, button text) comes from here.
 * Colors live in app/theme.css. All names below are fictional placeholders.
 *
 * Placeholders in UI strings:  {title} {n} {numeral} {name}
 */
import type { ExhibitConfig } from "@/lib/types";

const config = {
  site: {
    name: "Exhibit",
    url: "https://exhibit.example.com",
    description:
      "Alex Rivera — Working Interfaces, 2016–2026. A solo exhibition of shipped and unshipped software.",
  },

  lang: "en-US",

  artist: {
    name: "Alex Rivera",
    born: 1991,
    based: "Lives and works online",
    email: "hello@alexrivera.example",
  },

  exhibition: {
    title: "Working Interfaces",
    subtitle: "Alex Rivera",
    years: "2016–2026",
    hours: "Open daily · Free admission",
    statement:
      "For ten years Alex Rivera has made software for people who would rather not think about software. This exhibition gathers eight works — some shipped to thousands of users, some that never left a branch — and hangs them as they deserve: one at a time, at eye level, with room to breathe.",
    curator: "The Exhibit Curatorial Team",
    essay: {
      title: "On interfaces that disappear",
      paragraphs: [
        "A good interface is an act of hospitality. It anticipates the visitor, removes the coat from their shoulders and points the way to the room they came for. Rivera’s work has always started there: not with the screen, but with the person standing in front of it.",
        "The earliest pieces in this exhibition are dense, eager and a little loud. They were made for small teams at Acme who needed answers on Monday morning. Over time the work grows quieter. Controls recede. Type gets bigger. Defaults get kinder.",
        "Not everything here shipped. The red dots mark the works that reached real users; the rest are studies, prototypes and honest failures. They are shown together because the unshipped work is where most of the learning happened.",
        "Walk slowly. Use the audio guide. Turn the lights off if you would like to see each piece on its own.",
      ],
    },
  },

  rooms: [
    {
      id: "early-systems",
      title: "Early Systems",
      intro: "Back-office tools built quickly for people who needed them yesterday.",
    },
    {
      id: "tools-for-others",
      title: "Tools for Other People",
      intro: "Products for teams, dispatchers and field workers — designed by watching them work.",
    },
    {
      id: "small-machines",
      title: "Small Machines",
      intro: "Compact, single-purpose pieces. Each does one thing and then gets out of the way.",
    },
    {
      id: "recent-work",
      title: "Recent Work",
      intro: "The newest piece in the collection, and the one this exhibition is built with.",
    },
  ],

  works: [
    {
      slug: "ledger-no-1",
      title: "Ledger, No. 1",
      year: 2016,
      medium: "PHP, jQuery and MySQL on a shared host",
      size: { w: 1280, h: 800, unit: "px" },
      frame: "black",
      credit: "Gift of Acme Bookkeeping Co.",
      accession: "EX.2016.01",
      shipped: true,
      room: "early-systems",
      note: "Rivera’s first paid commission: a bookkeeping screen for a three-person office. Notice the density. Every pixel is doing a job, and the artist would later spend years learning to give some of those pixels the afternoon off.",
    },
    {
      slug: "untitled-signup-flow",
      title: "Untitled (Signup Flow)",
      year: 2017,
      medium: "Sketch, HTML and CSS",
      size: { w: 390, h: 844, unit: "px" },
      frame: "oak",
      credit: "Collection of the artist",
      accession: "EX.2017.02",
      shipped: false,
      room: "early-systems",
      note: "A seven-step signup reduced to two. The prototype tested well, the project was cancelled, and the idea resurfaced, almost unchanged, in three later works. Some studies are simply early.",
    },
    {
      slug: "dispatch",
      title: "Dispatch",
      year: 2019,
      medium: "React, TypeScript and Node.js",
      size: { w: 1440, h: 900, unit: "px" },
      frame: "white",
      credit: "Commissioned by Acme Logistics",
      accession: "EX.2019.03",
      shipped: true,
      room: "tools-for-others",
      note: "Built after two weeks of sitting beside dispatchers on night shifts. The large type and the single red alert colour come straight from what the artist saw: tired eyes, bad monitors and no time to hunt for the important thing.",
    },
    {
      slug: "study-for-a-dashboard",
      title: "Study for a Dashboard",
      year: 2020,
      medium: "Figma and D3.js",
      size: { w: 1600, h: 1000, unit: "px" },
      frame: "none",
      credit: "Collection of the artist",
      accession: "EX.2020.04",
      shipped: false,
      room: "tools-for-others",
      note: "Hung unframed, as the artist prefers for work in progress. Twelve charts were drawn, nine were removed. The three that remain answer the only questions the team actually asked.",
    },
    {
      slug: "field-notes",
      title: "Field Notes",
      year: 2021,
      medium: "React Native and SQLite",
      size: { w: 1179, h: 2556, unit: "px" },
      frame: "black",
      credit: "Commissioned by Acme Field Services",
      accession: "EX.2021.05",
      shipped: true,
      room: "tools-for-others",
      note: "An offline-first notebook for technicians who work in basements and on rooftops. Everything saves instantly, nothing waits for the network. Its best feature is one no visitor will ever see: it never loses a note.",
    },
    {
      slug: "kettle",
      title: "Kettle",
      year: 2023,
      medium: "Rust compiled to WebAssembly",
      size: { w: 1000, h: 1000, unit: "px" },
      frame: "oak",
      credit: "Acme Labs open-source programme",
      accession: "EX.2023.06",
      shipped: true,
      room: "small-machines",
      note: "A tiny image compressor that runs entirely in the browser. The square format is a nod to the single button at its centre. Drop a file in, take a smaller file out. That is the whole work.",
    },
    {
      slug: "small-weather",
      title: "Small Weather",
      year: 2024,
      medium: "Swift and WidgetKit",
      size: { w: 1080, h: 1350, unit: "px" },
      frame: "white",
      credit: "Collection of the artist",
      accession: "EX.2024.07",
      shipped: false,
      room: "small-machines",
      note: "A home-screen widget that tells you one thing: whether you need a coat. It was never released. The artist still uses it every morning, which may be the only review that matters.",
    },
    {
      slug: "atlas",
      title: "Atlas",
      year: 2026,
      medium: "Next.js, TypeScript and Motion",
      size: { w: 1920, h: 1200, unit: "px" },
      frame: "black",
      credit: "Commissioned by Acme Maps",
      accession: "EX.2026.08",
      shipped: true,
      room: "recent-work",
      note: "The most recent acquisition. Atlas lets a whole company find its way around its own documentation. Look for the quiet details: the focus rings, the reduced-motion fallbacks, the way nothing jumps as the page loads.",
    },
  ],

  ui: {
    skipLink: "Skip to the exhibition",
    nav: { exhibition: "Exhibition", catalog: "Catalog", primary: "Primary" },
    lights: { label: "Lights", on: "Gallery", off: "After hours" },
    legend: "Shipped",
    shippedSticker: "Shipped",
    room: "Room",
    keyboardHint: "← → to move between works · Enter to open · L for lights",
    generatedAlt:
      "{title}: a generated abstract composition of circles, bars and arcs in red, blue, yellow and black on cream paper.",
    audio: {
      play: "Play audio guide stop {n}, {title}",
      stop: "Stop audio guide stop {n}",
      tag: "Audio guide",
    },
    minimap: { label: "Floor plan", jump: "Go to Room {numeral}, {title}" },
    giftShop: {
      eyebrow: "Exit",
      title: "Gift shop",
      body: "Take a postcard on your way out. Each one is a print of a work in this exhibition.",
      commissions: "Commissions open",
      commissionsSubject: "Commission enquiry",
      postcards: "Postcards",
      download: "Download postcard: {title}",
      fileHint: "PNG ↓",
    },
    work: {
      back: "Back to the exhibition",
      previous: "Previous work",
      next: "Next work",
      curatorNote: "Curator’s note",
      accession: "Acc. no.",
      born: "b.",
      visit: "Visit the work",
      inRoom: "Room {numeral} · {title}",
    },
    catalog: {
      title: "Exhibition catalog",
      print: "Print catalog",
      plate: "Plate",
      contents: "Contents",
      colophon: "Set in Geist, Newsreader and Geist Mono.",
    },
    notFound: {
      title: "This room is closed",
      body: "The work you are looking for is not on display.",
      back: "Return to the entrance",
    },
  },
} satisfies ExhibitConfig;

export default config;
