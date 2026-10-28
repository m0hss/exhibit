export type FrameStyle = "black" | "oak" | "white" | "none";

export interface Work {
  /** URL segment and seed for the generated artwork. Must be unique. */
  slug: string;
  title: string;
  year: number;
  medium: string;
  /** Physical (or pixel) size. The ratio w/h decides the shape of the frame. */
  size: { w: number; h: number; unit: string };
  frame: FrameStyle;
  credit: string;
  accession: string;
  /** Adds a red dot sticker to the wall label. */
  shipped: boolean;
  /** id of the room this work hangs in. */
  room: string;
  /** Read aloud by the audio guide and shown on the work page. */
  note: string;
  /** Optional image in /public. Without it a generated composition is drawn from the slug. */
  image?: { src: string; alt: string };
  /** Optional link to the live project. */
  href?: string;
}

export interface Room {
  id: string;
  title: string;
  intro: string;
}

export interface ExhibitConfig {
  site: {
    name: string;
    /** Absolute URL of the deployed site, used for Open Graph links. */
    url: string;
    description: string;
  };
  /** BCP 47 language tag; used for <html lang> and the audio guide voice. */
  lang: string;
  artist: {
    name: string;
    born: number;
    based: string;
    email: string;
  };
  exhibition: {
    title: string;
    subtitle: string;
    years: string;
    hours: string;
    statement: string;
    curator: string;
    essay: { title: string; paragraphs: string[] };
  };
  rooms: Room[];
  works: Work[];
  ui: {
    fictionalNotice: string;
    skipLink: string;
    nav: { exhibition: string; catalog: string; primary: string };
    lights: { label: string; on: string; off: string };
    legend: string;
    shippedSticker: string;
    room: string;
    keyboardHint: string;
    generatedAlt: string;
    audio: { play: string; stop: string; tag: string };
    minimap: { label: string; jump: string };
    giftShop: {
      eyebrow: string;
      title: string;
      body: string;
      commissions: string;
      commissionsSubject: string;
      postcards: string;
      download: string;
      fileHint: string;
    };
    work: {
      back: string;
      previous: string;
      next: string;
      curatorNote: string;
      accession: string;
      born: string;
      visit: string;
      inRoom: string;
    };
    catalog: {
      title: string;
      print: string;
      plate: string;
      contents: string;
      colophon: string;
    };
    notFound: { title: string; body: string; back: string };
  };
}
