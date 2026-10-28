import Link from "next/link";
import { config } from "@/lib/exhibit";

export default function NotFound() {
  const { notFound } = config.ui;
  return (
    <main id="main" className="wall flex min-h-svh flex-col items-start justify-center px-5 pb-[24svh] sm:px-10 lg:px-[5vw]">
      <h1 className="text-[clamp(2.5rem,9vw,6rem)] font-semibold leading-none tracking-[-0.04em]">{notFound.title}</h1>
      <p className="mt-4 font-serif text-xl text-ink-soft">{notFound.body}</p>
      <Link href="/" className="mt-8 underline underline-offset-4">
        {notFound.back}
      </Link>
    </main>
  );
}
